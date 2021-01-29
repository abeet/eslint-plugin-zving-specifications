const fs = require("fs")
const path = require("path")
const cacheDirectory = {}

function getSuffixFilesByCache (fileUrl, sourceName) {
  const suffixFiles = []
  const files = cacheDirectory[fileUrl]

  if(!files || !files.length) {
    return suffixFiles
  }

  for(let i = 0; i < files.length; i++) {
    const fileName = files[i]
    const fileSplit = fileName.split('.')

    if(fileSplit.length <= 1) {
      continue
    }

    const curSuf = fileSplit[fileSplit.length - 1]
    const curName = sourceName[0] + '.' + curSuf

    if(sourceName.length > 1) {
      const n = sourceName.join('.') + '.' + curSuf
      if(n === fileName) {
        continue
      }
    }

    if(curName !== fileName) {
      continue
    }

    suffixFiles.push(fileName)
  }

  return suffixFiles
}

function analysis(context, opt) {
  const {
    sourceValue,
    curAbsolutePath,
    sourceName,
    notNeedExtensions,
    isFilter,
    node,
    paths
  } = opt
  // 明显有后缀的不要处理
  if(/\.(jsx?|tsx?|json|html?|tpl|vue|s?css|sass|less|png|jpe?g|gif|svg)$/i.test(sourceValue)){
    return
  }
  // 如果引用的是 node_modules 下的库，直接跳过
  if(/[\/\\]node_modules[\/\\]/.test(curAbsolutePath)){
    return
  }
  if(context.options && context.options[0] && context.options[0].resolve &&  context.options[0].resolve.modules &&  context.options[0].resolve.modules.length ){
    const  modules = context.options[0].resolve.modules
    for(let i=0;i<modules.length;i++){
      if(curAbsolutePath.startsWith(modules[i])){
        // 如果是配置的其他  node_modules 下的库，也直接跳过
        return
      }
    }
  }

  let fileUrl = ''

  const curAbsolutePathSplit = curAbsolutePath.split('\\')
  let relativePath = []

  for(let i = 0; i < curAbsolutePathSplit.length - 1;i++) {
    relativePath.push(curAbsolutePathSplit[i])
  }
  for(let i=1; i < paths.length - 1; i++) {
    relativePath.push(paths[i])
  }

  fileUrl = path.join(...relativePath)

  let files = []

  let suffixFiles = getSuffixFilesByCache(fileUrl, sourceName)

  if(suffixFiles.length <= 0) {
    try {
      files = fs.readdirSync(fileUrl)

      cacheDirectory[fileUrl] = files

      suffixFiles = getSuffixFilesByCache(fileUrl, sourceName)
    } catch(e) {
      console.log('err-- 73', e)
      context.report(
        node.source,
        '未检测到' + sourceValue +'后缀'
      )
    }
  }

  const isSuf = cacheDirectory[fileUrl].filter(name => sourceName.join('.') === name && name.indexOf('.') > -1)

  if(isSuf.length > 0) {
    return
  }


  if(isFilter === 1) {
    const filterSuffixFiles = suffixFiles.filter(file => {
      let isNoSuffix = true
      notNeedExtensions.forEach(suffix => {
        const reg = new RegExp(suffix + '$')
        if(reg.test(file)) {
          isNoSuffix = false
        }
      })

      return isNoSuffix
    })

    if(filterSuffixFiles.length <= 0) {
      return
    }
  }

  let tips = '导入的模块 ' + sourceValue + ' 请添加后缀名：' + suffixFiles.join('或')

  if(sourceName.length > 1) {
    tips = '导入的模块 ' + sourceValue + ' 后缀名有误，请修改为：' + suffixFiles.join('或')
  }
  if(suffixFiles.length > 0) {
    context.report(
      node.source,
      tips
    )
  } else {
    const dirName = sourceName.join('.')

    fileUrl = path.join(fileUrl, dirName)

    files = cacheDirectory[fileUrl]

    if(!files || !files.length) {
      try {
        files = fs.readdirSync(fileUrl)

        cacheDirectory[fileUrl] = files
      } catch(e){
        console.log('134: ', e)
        context.report(
          node.source,
          '未检测到' + sourceValue +'后缀'
        )
      }
    }

    suffixFiles = getSuffixFilesByCache(fileUrl, ['index'])

    if(suffixFiles && suffixFiles.length) {
      context.report(
        node.source,
        '导入的模块 ' + sourceValue + ' 请添加后缀名：' + suffixFiles.join('或')
      )
    } else {
      context.report(
        node.source,
        '未检测到' + sourceValue +'后缀'
      )
    }
  }
}

module.exports = function(context) {
  return {
    ImportDeclaration(node) {
      const sourceValue = node.source.value

      if(!context.options || !context.options.length || !sourceValue) {
        return
      }

      const curAbsolutePath = context.getFilename()
      const {
        projectDirname,
        resolve: webpackConfig,
        isFilter = 0
      } = context.options[0]

      const {
        modules = [],
        notNeedExtensions = [],
        alias = {}
      } = webpackConfig || {}
      const paths = sourceValue.split('/')
      let sourceName = paths[paths.length - 1].split('.')

      if(sourceName.length > 2) {
        let fn = []
        for(let i = 0; i < sourceName.length - 1; i++) {
          fn.push(sourceName[i])
        }

        sourceName = [fn.join('.'), sourceName[sourceName.length - 1]]
      }

      const opt = {
        sourceValue,
        curAbsolutePath,
        sourceName,
        webpackConfig,
        notNeedExtensions,
        node,
        isFilter,
        paths
      }

      if(/^\.\//.test(sourceValue)) {
        analysis(context, opt)
      } else if(/^\.\.\//.test(sourceValue)) {
        const back = []
        const url = []

        paths.forEach(item => {
          if(item === '..') {
            back.push(item)
          } else {
            url.push(item)
          }
        })

        back.push('..')
        opt.curAbsolutePath = path.join(curAbsolutePath, ...back, ...url)
        opt.paths = []
        analysis(context, opt)
      } else {
        let isAlias = false

        for(let key in alias) {
          const aliasVal = alias[key]

          if(paths[0] === key) {
            paths[0] = alias[key]
            isAlias = true
            break
          }
        }
        // 处理别名
        if (isAlias) {
          opt.curAbsolutePath = path.join(paths.join('\\'))
          opt.paths = []

          analysis(context, opt)
        } else {
          if(paths.length > 1) { // 如果是 import xx from 'xxx' 默认认为是模块
            for(let i = 0; i < modules.length; i++){
              const modulePath = modules[i]
              const absolutePath = path.join(modulePath, sourceValue)
              let stat

              try {
                stat = fs.statSync(path.join(absolutePath, '..'))

                if(stat && stat.isDirectory()) {
                  opt.curAbsolutePath = absolutePath
                  opt.paths = []
                  analysis(context, opt)
                }
              } catch (error) {
                console.log('249:' ,error)
                node.source,
                '未检测到该文件后缀'
              }
            }

            if(!modules.length) {
              context.report(
                node.source,
                '导入的模块 ' + sourceValue + ' 无法正确识别后缀名，请检查eslint是否正确！'
              )
            }
          }
        }
      }
    }
  }
}
