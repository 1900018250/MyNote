## 安装

## 起步

### 结构

```dart
// 入口
void main() => runApp(MyApp());

// 应用结构
// 应用本身也是一个Widget
// MaterialApp 是app框架
// Scaffold 是Material库中提供的页面脚手架
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // 名称
      title: 'Flutter Demo',
      theme: ThemeData(
        // 主题
        primarySwatch: Colors.red,
      ),
      // 首页路由
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}
```

## 首页

```dart
// StatefulWidget 表示一个有状态的组件
class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

// _MyHomePageState类是MyHomePage类对应的状态类
class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Scaffold 是 Material组件库中提供的一个组件，它提供了默认的导航栏、标题和包含主屏幕widget树（后同“组件树”或“部件树”）的body属性。组件树可以很复杂
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(

        child: Column(
  
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              '111cccbbbbaaaaYou111111 have cdadadlicked the sssbutton this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.display1,
            ),
          ],
        ),
      ),
      // floatingActionButton是页面右下角的带“+”的悬浮按钮
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
```

## 路由

### MaterialPageRoute

```dart
// MaterialPageRoute 继承PageRoute PageRoute是一个抽象类 表示有一个占有整个屏幕的路由页面 MaterialPageRoute 是安卓风格
/*
builder 是一个WidgetBuilder类型的回调函数，它的作用是构建路由页面的具体内容，返回值是一个widget。我们通常要实现此回调，返回新路由的实例。
settings 包含路由的配置信息，如路由名称、是否初始路由（首页）。
maintainState：默认情况下，当入栈一个新路由时，原来的路由仍然会被保存在内存中，如果想在路由没用的时候释放其所占用的所有资源，可以设置maintainState为false。
fullscreenDialog表示新的路由页面是否是一个全屏的模态对话框，在iOS中，如果fullscreenDialog为true，新页面将会从屏幕底部滑入（而不是水平方向）
*/
MaterialPageRoute({
  WidgetBuilder builder,
  RouteSettings settings,
  bool maintainState = true,
  bool fullscreenDialog = false,
})
```

### Navigator

Navigator 是一个路由管理组件 她提供打开和退出路由的方法

```dart
Future push(BuildContext context, Route route)	// 压入路由
bool pop(BuildContext context, [ result ])	// 返回
```

### 路由传值

### 路由表

在入口页面App中注册路由

```dart
Map<String, WidgetBuilder> routes;
```

```dart
MaterialApp(
  title: 'Flutter Demo',
  theme: ThemeData(
    primarySwatch: Colors.blue,
  ),
  //注册路由表
  routes:{
   "new_page":(context)=>NewRoute(),
    ... // 省略其它路由注册信息
  } ,
  home: MyHomePage(title: 'Flutter Demo Home Page'),
);

// 通过路由名字打开新页
onPressed: () {
  Navigator.pushNamed(context, "new_page");
  //Navigator.push(context,
  //  new MaterialPageRoute(builder: (context) {
  //  return new NewRoute();
  //}));  
},
```

路由表传值

```dart
var result = await Navigator.of(context).pushNamed("top_page", arguments: "hi");
Text(ModalRoute.of(context).settings.arguments),
```

适配接受值的组件

```dart
MaterialApp(
  ... //省略无关代码
  routes: {
   "tip2": (context){
     return TipRoute(text: ModalRoute.of(context).settings.arguments);
   },
 }, 
);
```

路由钩子

```dart
Route<dynamic> Function(RouteSettings settings)
```

```dart
MaterialApp(
  ... //省略无关代码
  onGenerateRoute:(RouteSettings settings){
      return MaterialPageRoute(builder: (context){
           String routeName = settings.name;
       // 如果访问的路由页需要登录，但当前未登录，则直接返回登录页路由，
       // 引导用户登录；其它情况则正常打开路由。
     }
   );
  }
);
```

## 包管理

- `name`：应用或包名称。
- `description`: 应用或包的描述、简介。
- `version`：应用或包的版本号。
- `dependencies`：应用或包依赖的其它包或插件。
- `dev_dependencies`：开发环境依赖的工具包（而不是flutter应用本身依赖的包）。
- `flutter`：flutter相关的配置选项。

```dart
dependencies:
    pkg1:
        path: ../../code/pkg1
dependencies:
  pkg1:
    git:
      url: git://github.com/xxx/pkg1.git
dependencies:
  package1:
    git:
      url: git://github.com/flutter/packages.git
      path: packages/package1
```

## 资源管理

## Widget

```dart
@immutable
abstract class Widget
  extends DiagnosticableTree // 提供调试信息
{
  // 决定widget更新时候是否复用旧的
  //决定的条件在canUpdate()方法中。
  const Widget({ this.key });
  final Key key;
   
  // 先调用此方法生成对应节点的Element对象
  @protected
  Element createElement();

  @override
  String toStringShort() {
    return key == null ? '$runtimeType' : '$runtimeType-$key';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties.defaultDiagnosticsTreeStyle = DiagnosticsTreeStyle.dense;
  }
  
  static bool canUpdate(Widget oldWidget, Widget newWidget) {
    return oldWidget.runtimeType == newWidget.runtimeType
        && oldWidget.key == newWidget.key;
  }
}
```

### statelessWidget

他继承了Widget 类 重写了createElement 方法

用于不需要维护状态的场景

组件的 build 方法，又一个BuildContext context 参数，她表示widget在widget树中的上下文，每一个widget都 iiu会对应一个context对象。

```dart
class ContextRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Context测试"),
      ),
      body: Container(
        child: Builder(builder: (context) {
          // 在Widget树中向上查找最近的父级`Scaffold` widget
          Scaffold scaffold = context.ancestorWidgetOfExactType(Scaffold);
          // 直接返回 AppBar的title， 此处实际上是Text("Context测试")
          return (scaffold.appBar as AppBar).title;
        }),
      ),
    );
  }
}
```



### statefulWidget

StatefulWidget 类中添加了一个新的接口createState( )并重写了`createElement()`方法

`StatefulElement`中可能会多次调用`createState()`来创建状态(State)对象

### State

一个statefulWidget 类会对应一个State类，表示其对应的StatefulWidget 要维护的状态

State 的生命周期

![image-20191027184631475](/Users/ldl/Library/Application Support/typora-user-images/image-20191027184631475.png)

+ initState: 当Widget 第一次插入到Widget 树时会被调用 只会调用一次 通常用来做一次性的操作， 状态初始化，订阅子树的时间通知

+ didChangeDependencies: 当State对象的依赖发生变化的时候调用 典型场景当前系统的语言 应用的主题改变的时候调用该回调

+ build : 

  在调用initState()之后。
  在调用didUpdateWidget()之后。
  在调用setState()之后。
  在调用didChangeDependencies()之后。
  在State对象从树中一个位置移除后（会调用deactivate）又重新插入到树的其它位置之后。

+ Reassemble: 热重载 开发的时候用

+ didUpdateWidget: 在widget重新构建的时候 调用

+ deactivete: 当State重树中移除的时候

+ Dispose: 移除 在这里释放资源

### widget树中获取State对象











































