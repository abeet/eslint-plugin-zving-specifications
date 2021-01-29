# eslint-plugin-zving-specifications

eslint-plugin-zving-specifications 是一个ESLint插件，对代码中如下写法作出警告：  
- 为了减少打包后js文件体积，不允许导入整个 lodash 库，请导入你需要的特定的 lodash 函数

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-zving-specifications`:

```
$ npm install eslint-plugin-zving-specifications --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-zving-specifications` globally.

## Usage

Add `zving-specifications` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "zving-specifications"
    ]
}
```
## rules说明
```
no-full-import: 'warn' //不允许引入lodash、lodash-compat、rambda或date-fns的整个依赖包

no-option-cookie: 'warn' // 不允许操作cookie

no-add-object-to-window: [1, makeException]
  作用：不允许修改window对象中的方法，不需要给window对象添加属性
  参数说明 -- [可选]
  makeException: type: Array, 当给window添加特定的属性时不检测

big-package-replace：'warn' // 或 [1, packageConfig]
  作用：需要替代的大体积依赖包
  参数说明 -- [可选]：
  packageConfig: [{ name: 'xx', replaceName: 'aa' }]
  name: 需要检测的依赖名称
  replaceName: 替换的依赖名称

need-extension：[ 1, webpackConfig]
  作用：检测导入文件后缀名
  参数说明：
  webpackConfig: {
    // 当前项目的根目录 -- [必须]
    "projectDirname": __dirname,
    // resolve -- [可选]
    "resolve": {
      // 依赖包路径 -- [可选]
      "modules": [path.join(__dirname, 'node_modules')],
      // 不需要过滤的后缀,示例： ['.js'] 不会检测后缀名为js的文件 -- [可选]
      "notNeedExtensions": [], 
      // 别名路径配置 -- [可选]
      "alias": {
        // 别名: 绝对路径
        "@src": path.join(__dirname, 'src'), // 示例： 
        "@static": ""
      }
    },
    // 0：关闭，1：开启： 是否开启过滤 -- [可选]
    "isFilter": 0
  }
```

## eslint -> rules配置示例
```js
{
  "rules": {
    // "zving-specifications/rule-name": 2,
    'no-full-import': 1,
    'no-option-cookie': 1，
    'big-package-replace': 1,
    'no-add-object-to-window': 1,
    "need-extension": [1, {
      "projectDirname": __dirname, // 当前项目的根目录
      "resolve": {
        // 依赖包路径
        "modules": [path.join(__dirname, 'node_modules')],
        // 不需要过滤的后缀,示例： ['.js'] 不会检测后缀名为js的文件
        "notNeedExtensions": [], 
        "alias": {
          // 别名: 绝对路径
          "@src": path.join(__dirname, 'src'), // 示例： 
          "@static": ""
        }
      },
      "isFilter": 0 // 0：关闭，1：开启： 是否开启过滤
    }]
  }
}
```

## Supported Rules

* Fill in provided rules here





