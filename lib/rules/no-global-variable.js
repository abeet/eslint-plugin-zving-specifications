const allowModifyAry = [
  'window',
  'self',
  'document',
  'name',
  'location',
  'customElements',
  'history',
  'locationbar',
  'menubar',
  'personalbar',
  'scrollbars',
  'statusbar',
  'toolbar',
  'status',
  'closed',
  'frames',
  'length',
  'top',
  'opener',
  'parent',
  'frameElement',
  'navigator',
  'origin',
  'external',
  'screen',
  'innerWidth',
  'innerHeight',
  'scrollX',
  'pageXOffset',
  'scrollY',
  'pageYOffset',
  'visualViewport',
  'screenX',
  'screenY',
  'outerWidth',
  'outerHeight',
  'devicePixelRatio',
  'clientInformation',
  'screenLeft',
  'screenTop',
  'defaultStatus',
  'defaultstatus',
  'styleMedia',
  'onsearch',
  'isSecureContext',
  'performance',
  'onappinstalled',
  'onbeforeinstallprompt',
  'crypto',
  'indexedDB',
  'webkitStorageInfo'
]

module.exports = function (context) {
  return {
    AssignmentExpression (node) {
      const makeException = []
      if(context.options && context.options.length) {
        const opt = context.options[0]

        if(Object.prototype.toString.call(opt) === '[object Array]') {
          makeException.push(...opt)
        }
      }

      if(
        node.left.object &&
        node.left.object.name &&
        node.left.object.name === 'window' &&
        node.left.property &&
        node.left.property.name &&
        ![...makeException, ...allowModifyAry].includes(node.left.property.name) &&
        node.right
      ) {
        context.report({
          node,
          message: '不能在window对象上添加内容'
       })
      }
    }
  }
}
