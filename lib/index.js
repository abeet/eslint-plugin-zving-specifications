module.exports = {
  rules: {
    'no-full-import': require('./rules/no-full-import.js'),
    'need-extension': require('./rules/need-extension.js'),
    'no-import-bloated-package': require('./rules/no-import-bloated-package.js'),
    'no-global-variable': require('./rules/no-global-variable'),
    'no-write-cookie': require('./rules/no-write-cookie')
  },
  rulesConfig: {
    'no-full-import': 1,
    'need-extension': 1,
    'no-import-bloated-package': 1,
    'no-global-variable': 1,
    'no-write-cookie': 1
  }
}
