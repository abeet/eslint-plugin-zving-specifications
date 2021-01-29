module.exports = function (context) {
  return {
    AssignmentExpression (node) {
      if(
        node.left.object &&
        node.left.object.name &&
        node.left.object.name === 'document' &&
        node.left.property &&
        node.left.property.name &&
        node.left.property.name === 'cookie' &&
        node.right
      ) {
        context.report({
          node,
          message: "不允许操作{{name}}",
          data: {
            name: node.left.property.name
          }
        })
      }
    }
  }
}
