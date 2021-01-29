module.exports = function (context) {
  return {
    ImportDeclaration (node) {
      let packageConfig = [{ 
        name: 'moment',
        replaceName: 'dayjs'
      }]

      if(context.options && context.options.length) {
        packageConfig = context.options[0]
      }

      const sourceValue = node.source.value

      const curFilterData = packageConfig.filter(({ name }) => name === sourceValue)


      if(curFilterData.length){
        const filterData = curFilterData[0]

        context.report(
          node.source,
          '为了减少打包后js文件体积，请使用 ' + filterData.replaceName + ' 替代 ' +
            node.source.value +
            ' 库'
        )
      }
    }
  }
}
