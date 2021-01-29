module.exports = function (context) {
  return {
    ImportDeclaration (node) {
      if (
        node.source.value === 'lodash' ||
        node.source.value === 'lodash-compat' ||
        node.source.value === 'date-fns' ||
        node.source.value === 'rambda'
      ) {
        context.report(
          node.source,
          '为了减少打包后js文件体积，不允许导入整个 ' +
            node.source.value +
            ' 库，请单独导入你需要的函数。'
        )
      }
    }
  }
}
