# start
## 安装
```javascript
npm i webpack --save-dev
npm i webpack-cli --save-dev
```
```json
// --mode 模式
// ./src/hello.js 入口
// --output 出口
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack  --mode development --output ./output/main.js",
    "build": "webpack --mode production --output ./output/main.js"
   
  },
```
## 打包es6和webpack-cli 命令
```javascript
npm i @babel/core babel-loader @babel/preset-env --save-dev
// 项目根目录创建 配置文件 .babelrc 
{
 "presets": ["@babel/preset-env"]
}
```
```javascript
config：指定一个 Webpack 配置文件的路径；
–mode：指定打包环境的 mode，取值为 development 和 production ，分别对应着开发环境和生产环境；
–json：输mode出 Webpack 打包的结果，可以使用 webpack --json > stats.json 方式将打包结果输出到指定
的文件；
–progress：显示 Webpack 打包进度；
–watch, -w：watch 模式打包，监控文件变化之后重新开始打包；
–color, --colors / –no-color, --no-colors：控制台输出的内容是否开启颜色；
–hot：开启 Hot Module Replacement模式，后面会详细介绍；
–profile：会详细的输出每个环节的用时（时间），方便排查打包速度瓶颈。
```

# 配置
## 配置文件
### 普通
```javascript
module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
 };
```
### 函数类型的配置
```javascript
module.exports = (env, argv) => {
 return {
  mode: env.production ? 'production' : 'development',
  devtool: env.production ? 'source-maps' : 'eval',
  plugins: [
    new TerserPlugin({
      terserOptions: {
        compress: argv['optimize-minimize'] // 只有传入 -p 或 --optimize-minimize
        }
      })
    ]
  };
};
```
### 异步加载与多配置
```javascript
module.exports = () => {
 return new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      entry: './app.js'
      /* ... */
      });
    }, 5000);
 });
};

module.exports = [
 {
  mode: 'production'
  // 配置1
 },
 {
  // 配置2
 }
];
```

### 配置的使用
```javascript
webpack --config webpack.config.js  // 默认是这个
npx webpack --config webpack.config.entry.js --mode development // 设置模式 默认是production
```

### 常用名词
+ entry 项目入口
+ module 开发中每一个文件都可以看做 module，模块不局限于 js，也包含 css、图片等
+ chunk 代码块，一个 chunk 可以由多个模块组成
+ loader 模块转化器，模块的处理器，对模块进行转换处理
+ plugin 扩展插件，插件可以处理 chunk，也可以对最后的打包结果进行处理，可以完成 loader 完不成的任务
+ bundle 最终打包完成的文件，一般就是和 chunk 一一对应的关系，bundle 就是对 chunk 进行便意压缩打包等处理后的产出

### entry and output
#### entry
```javascript
// context 上下文entry 和 output 的相对路径 默认为 process.cwd() 一般不用设置

// entry
entry: 'path/to/my/entry/file.js'
// entry对象模式
entry: {
 main: 'path/to/my/entry/file.js'
}
// 可以是数组
entry: ['./src/app.js', './src/home.js'],
// 多文件 会打包出三个文件
entry: {
 home: 'path/to/my/entry/home.js',
 search: 'path/to/my/entry/search.js',
 list: 'path/to/my/entry/list.js'
}
```
#### output
```javascript
// path ：此选项制定了输出的 bundle 存放的路径，比如 dist 、 output 等
// filename ：这个是 bundle 的名称
// publicPath ：指定了一个在浏览器中被引用的 URL 地址

module.exports = {
 entry: {
  home: 'path/to/my/entry/home.js',
  search: 'path/to/my/entry/search.js',
  list: 'path/to/my/entry/list.js'
 },
 output: {
  filename: '[name].js',  // 模块名称
  path: __dirname + '/dist'
 }
};
```

#### 占位符 
占位符是可以组合使用的，例如 [name]-[hash:8]
+ [hash] 模块标识符的 hash
+ [chunkhash] chunk 内容的 hash
+ [name] 模块名称
+ [id] 模块标识符
+ [query] 模块的 query，例如，文件名 ? 后面的字符串
+ [function] 一个 return 出一个 string 作为 filename 的函数

#### output.publicPath
对于使用 <script> 和 <link> 标签时，当文件路径不同于他们的本地磁盘路径（由 output.path 指定）时， output.publicPath 被用来作为 src 或者 link 指向该文件
```javascript
module.exports = {
 output: {
  path: '/home/git/public/assets',
  publicPath: '/assets/'
 }
};
// 输出
<head>
 <link href="/assets/logo.png" />
</head>

module.exports = {
 output: {
 path: '/home/git/public/assets',
 publicPath: 'http://cdn.example.com/assets/'
 }
};
// 输出
<head>
 <link href="http://cdn.example.com/assets/logo.png" />
</head>

```

#### output.library
打包的目的是生成一个供别人使用的库，
```javascript
module.exports = {
 output: {
   library: 'myLib' // '[name]'
 }
};
```

#### output.libraryTarget
```javascript
// 使用 output.libraryTarget 指定库打包出来的规范， output.l
// ibraryTarget 取值范围为： var 、 assign 、 this 、 window 、 global 、 commonjs 、 commonjs2 、 commonjs-module 、 amd 、 umd 、 umd2 、 jsonp ，默认是 var
```
+ 默认的导出方式 output.libraryTarget=‘var’ 只能以 <script> 标签的形式引入我们的库
+ commonjs output.libraryTarget=‘commonjs’ 只能按照 commonjs 的规范引入我们的库
+ amd output.libraryTarget=‘amd’ 只能按照 amd 规范引入 
+ umd output.libraryTarget=‘umd’ 可以用 <script> 、commonjs、amd 引入

###　externals 
跟output这些是同级的
```javascript
// externals 配置项用于去除输出的打包文件中依赖的某些第三方 js 模块（例如 jquery ， vue 等等）
externals: {
  jquery: "jQuery"
},
```

### target 
target 的值有两种类型：string 和 function。
```javascript
module.exports = {
 target: 'web' // 默认是 web，可以省略
};
// web, node 等等
```

### devtool
是来控制怎么显示sourcemap，通过 sourcemap 我们可以快速还原代码的错误位置。

### resolve
resolve 配置是帮助 Webpack 查找依赖模块的，通过resolv的配置，可以帮助 Webpack 快速查找依赖
```javascript
module.exports = {
  resolve: {
    // resolve的配置
  }
};
```

#### resolve.extensions
扩展webpack解析扩展名
默认值： ['.wasm', '.mjs', '.js', '.json']
```javascript
module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.css']
  }
};
```

#### resolve.alias
设置alias可以帮助webpack更快的查找模块依赖,import 路径别名
```javascript
resolve: {
  extensions: ['.js', '.json', '.css'],
  alias: {
    'lib': path.resolve(__dirname, 'src/lib') // lib代表src/lib 路径， 使用 import a from 'lib/say'
  },
}
```
在根目录中新建jsconfig.json 让vscode可以提示
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
    "@lib/": ["src/lib"]
    }
  }
 }
```
生产环境与开发环境不同库
```javascript
module.exports = {
  resolve: {
    alias: {
      san: process.env.NODE_ENV === 'production' ? 'san/dist/san.min.js' : 'san/dist/san.dev.js'
    }
  }
};

```
末尾扩展，不精准匹配
```javascript
module.exports = {
  resolve: {
    alias: {
      react$: '/path/to/react.min.js'
    }
  }
};

// 使用
import react from 'react'; // 精确匹配，所以 react.min.js 被解析和导入
import file from 'react/file.js'; // 非精确匹配，触发普通解析
```

#### 其他 
+ resolve.mainFields 解析目录时候的默认文件名， 们用到的模块会针对不同宿主环境提供几份代码
+ resolve.modules ：查找模块依赖时，默认是 node_modules ；
+ resolve.symlinks ：是否解析符合链接（软连接，symlink）；
+ resolve.plugins ：添加解析插件，数组格式；
+ resolve.cachePredicate ：是否缓存，支持 boolean 和 function，function 传入一个带有 path 和 require 的对象，必须返回 boolean 值。

### module
webpack 解析模块的同时，不同的模块需要使用不同类型的模块处理器来处理

#### module.noParse
可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理,
在代码中不用import这些模块
```javascript
module.exports = {
  module: {
    // 使用正则表达式
    noParse: /jquery|lodash/,
    // 使用函数，从 Webpack 3.0.0 开始支持
    noParse: (content) => {
      // content 代表一个模块的文件路径
      // 返回 true or false
      return /jquery|lodash/.test(content);
    }
  }
}
```
#### module.rules
##### 条件匹配
通过 test 、 include 、 exclude 等配置来命中可以应用规则的模块文件
resource：请求文件的绝对路径。它已经根据 resolve 规则解析
issuer: 被请求资源（requested the resource）的模块文件的绝对路径，即导入时的位置
```javascript
// 匹配的条件为：来自 src 和 test 文件夹，
// 不包含 node_modules 和 bower_modules 子目录
// 模块的文件路径为 .tsx 和 .jsx 结尾的文件。
{
  test: [/\.jsx?$/, /\.tsx?$/],
  include: [
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'test')
  ],
  exclude: [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, 'bower_modules')
  ]
}
```

##### loader
###### 使用方法
```javascript
module.exports = {
  module:{
    rules:[
      test: /\.less$/, use:'less-loader'
    ]
  }
}
```

除了在webpack.config json中使用loader ,还可以在import的时候使用loader
```javascript
// 合并写法，效果等同webpack.config.js写法
const html = require('html-loader!./loader.html');  // 有一个! 号
console.log(html);

// webpack.config.js写法
const html = require('./loader.html');
console.log(html);

module.exports = {
  module: {
    rules: [{test: /\.html$/, use: ['html-loader']}]
  }
};
```
###### 给loader传递参数.
使用options 或者 query两种方式传入
```javascript
// inline内联写法，通过 query 传入
const html = require("html-loader?attrs[]=img:src&attrs[]=img:data-src!./file.html");
// config内写法，通过 options 传入
module: {
  rules: [{
    test: /\.html$/,
    use: [{
      loader: 'html-loader',
      options: {
        minimize: true,
        removeComments: false,
        collapseWhitespace: false
      }
    }]
  }]
}
// config内写法，通过 query 传入
module: {
  rules: [{
    test: /\.html$/,
    use: [ {
      loader: 'html-loader?minimize=true&removeComments=false&collapseWhitespace=false',
    }]
  }]
}
```
###### loader解析顺序
```javascript
// query 写法从右到左，使用!隔开
const styles = require('css-loader!less-loader!./src/index.less');
// 数组写法，从后到前 从后到前
module.exports = {
 module: {
  rules: [
    {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        },
        {
          loader: 'less-loader'
        }
      ]
    }
  ]
 }
```
### plugins
```javascript
module.exports = {
  //....
  plugins: [
      // 压缩js
      new webpack.optimize.UglifyJsPlugin();
  ]
}

// 非默认的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  //....
  plugins: [
    // 导出css文件到单独的内容
    new ExtractTextPlugin({
      filename: 'style.css'
    })
  ]
};
```

## 模块化
### 一切皆模块
```javascript
var img = require('./img/webpack.png');
var style = require('./css/style.css');
var template = require('./template.ejs');
```

#### import()和神奇注释 (按需加载)
```javascript
// layz.js
export default 'lazy module';
// index.js
// 这里的注释会指定打包后的文件名字
import(
  /*
  webpackChunkName: 'layzz-name'
  */
  './layzz'
).then(layzz => void(console.log(layzz)))
```
打包后会多一个layzz-name.js,这是动态打包 通过异步的方式加载

目前支持的注释有：

+ webpackInclude ：如果是 import 的一个目录，则可以指定需要引入的文件特性，例如只加载 json 件：/\.json$/ ；
+ webpackExclude ：如果是 import 的一个目录，则可以指定需要过滤的文件，例如 /\.noimport\.json$/ ；
+ webpackChunkName ：这是 chunk 文件的名称，例如 lazy-name ；
+ webpackPrefetch : 是否预取模块，及其优先级，可选值 true 、或者整数优先级别，0 相当true，webpack4.6+支持；
+ webpackPreload : 是否预加载模块，及其优先级，可选值 true 、或者整数优先级别，0 相true，webpack4.6+支持；
+ webpackMode : 可选值 lazy / lazy-once / eager / weak 

Tips：prefetch 优先级低于 preload，preload 会并行或者加载完主文件之后立即加载；
prefetch 则会在主文件之后、空闲时在加载。
prefetch 和 preload 可以用于提前加载图片、样式等资源的功能。

打包所有图片
```javascript
import(/* webpackChunkName: "image", webpackInclude: /\.(png|jpg|gif)/ */ './assets/img');
```

## Babel
### 配置
可以在根目录下建立 .babelrc文件，
如果这个文件找不到，找package.json中找 "babel": {}
```json
// package.json
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    "presets": ["@babel/preset-env"]
  }
}

// 如果想针对不同的环境
// env 选项的值将从 process.env.BABEL_ENV 获取 没有的话，则获取 process.env.NODE_ENV
{
  "env": {
    "production": {
      "presets": ["@babel/preset-env"]
      }
  }
}
```

### Babel 的插件和 Preset 
@babel/preset-env 是 Babel 官方推出的插件预设，它可以根据开发者的配置按需加载对应的插件
useBuiltIns 和 target 是最重要的两个，
useBuiltIns 用来设置浏览器 polyfill， target 是为了目标浏览者对应的环境（browser/node）。
```javascript
// useBuiltIns
{
  "presets": [
  ["@babel/preset-env", {
    // 默认值false 可以用usage,entry
    // 一般使用 usage
    "useBuiltIns": "usage|entry|false"
  }]
  ]
}

// target 指定游览器和Node版本
{
 "presets": [
    ["@babel/preset-env", {
      "targets": {
       "browsers": "IE 10"
      }
    }]
  ]
}
```

### 在 Webpack 中使用 Babel
安装
```javascript
# 安装开发依赖
npm i webpack babel-loader webpack-cli @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
# 将 runtime 作为依赖
npm i @babel/runtime -S
```

还可以在项目根目录下创建 .babelrc 或者使用 package.json 的 babel 字段。
```javascript
// webpack.config.js
module.exports = {
  entry: './babel.js',
  mode: 'development',
  devtool: false,
  module: {
    rules: [
        {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage'
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
};
```

### Browserslist
实际上就是声明了一段浏览器的集合，我们的工具可以根据这段集合描述，针对性的输出兼容性代码
在 package.json 中的配置是增加一个 browserslist 数组属性：
```json
{
  "browserslist": ["last 2 version", "> 1%", "maintained node versions", "not ie < 11"]
}
```

Browserslist 的环境变量
```json
{
  "browserslist": {
    "production": ["> 1%", "ie 10"],
    "development": ["last 1 chrome version", "last 1 firefox version"]
  }
}
```

### Babel Polyfill 的最佳实践
多个文件中用到了 async 和 await 关键字，那么每个文件都会编译出一遍asyncGeneratorStep 和_asyncToGenerator函数
需要用到 @babel/plugin-transform-runtime 这个 Babel 插件。

```json
// .babelrc
{
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": false, // 默认值，可以不写
                "helpers": true, // 默认，可以不写
                "regenerator": false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
                "useESModules": true // 使用 es modules helpers, 减少 commonJS 语法代码
            }
        ]
    ],
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {}, // 这里是targets的配置，根据实际browserslist设置
                "corejs": 3, // 添加core-js版本
                "modules": false, // 模块使用 es modules ，不使用 commonJS 规范
                "useBuiltIns": "usage" // 默认 false, 可选 entry , usage
            }
        ]
    ]
}
```

## Typescript
安装ts, 和tsconfig.json文件
安装 ts-loader 的命令为： 
```javascript
npm i ts-loader --save-dev
```
webpack继成ts
```javascript
module.exports = {
  entry: './src/app.ts',
  output: {
    filename: 'app.js',
    path: './dist'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [{test: /\.ts$/, loader: 'ts-loader'}]
  }
}
```

## 样式文件
### css-loader
```javascript
npm i -D css-loader
```

