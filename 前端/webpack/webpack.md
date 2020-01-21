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

