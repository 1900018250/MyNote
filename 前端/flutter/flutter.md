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

### 文本字体样式

#### Text

```dart
Text("Hello world "*6,  //字符串重复六次
  textAlign: TextAlign.center,
)；
```

`textAlign`：文本的对齐方式

`maxLines`、`overflow`：指定文本显示的最大行数

`textScaleFactor`：代表文本相对于当前字体大小的缩放因子

#### TextStyle

```dart
Text("Hello world",
  style: TextStyle(
    color: Colors.blue,
    fontSize: 18.0,
    height: 1.2,  
    fontFamily: "Courier",
    background: new Paint()..color=Colors.yellow,
    decoration:TextDecoration.underline,
    decorationStyle: TextDecorationStyle.dashed
  ),
);
```

####  TextSpan

为一行文字指定不同样式

```dart
Text.rich(TextSpan(
    children: [
     TextSpan(
       text: "Home: "
     ),
     TextSpan(
       text: "https://flutterchina.club",
       style: TextStyle(
         color: Colors.blue
       ),  
       recognizer: _tapRecognizer
     ),
    ]
))
```

####DefaultTextStyle

在Widget树中，文本的样式默认是可以被继承的

```dart
DefaultTextStyle(
  //1.设置文本默认样式  
  style: TextStyle(
    color:Colors.red,
    fontSize: 20.0,
  ),
  textAlign: TextAlign.start,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text("hello world"),
      Text("I am Jack"),
      Text("I am Jack",
        style: TextStyle(
          inherit: false, //2.不继承默认样式
          color: Colors.grey
        ),
      ),
    ],
  ),
);
```

### 布局

#### 线性布局

#### ROW

Row可以在水平方向排列其子widget。定义如下：

```dart
Row({
  ...  
  TextDirection textDirection,    
  MainAxisSize mainAxisSize = MainAxisSize.max,    
  MainAxisAlignment mainAxisAlignment = MainAxisAlignment.start,
  VerticalDirection verticalDirection = VerticalDirection.down,  
  CrossAxisAlignment crossAxisAlignment = CrossAxisAlignment.center,
  List<Widget> children = const <Widget>[],
})
```

- `textDirection`：表示水平方向子组件的布局顺序(是从左往右还是从右往左)，默认为系统当前Locale环境的文本方向(如中文、英语都是从左往右，而阿拉伯语是从右往左)。
- `mainAxisSize`：表示`Row`在主轴(水平)方向占用的空间，默认是`MainAxisSize.max`，表示尽可能多的占用水平方向的空间，此时无论子widgets实际占用多少水平空间，`Row`的宽度始终等于水平方向的最大宽度；而`MainAxisSize.min`表示尽可能少的占用水平空间，当子组件没有占满水平剩余空间，则`Row`的实际宽度等于所有子组件占用的的水平空间；
- `mainAxisAlignment`：表示子组件在`Row`所占用的水平空间内对齐方式，如果`mainAxisSize`值为`MainAxisSize.min`，则此属性无意义，因为子组件的宽度等于`Row`的宽度。只有当`mainAxisSize`的值为`MainAxisSize.max`时，此属性才有意义，`MainAxisAlignment.start`表示沿`textDirection`的初始方向对齐，如`textDirection`取值为`TextDirection.ltr`时，则`MainAxisAlignment.start`表示左对齐，`textDirection`取值为`TextDirection.rtl`时表示从右对齐。而`MainAxisAlignment.end`和`MainAxisAlignment.start`正好相反；`MainAxisAlignment.center`表示居中对齐。读者可以这么理解：`textDirection`是`mainAxisAlignment`的参考系。
- `verticalDirection`：表示`Row`纵轴（垂直）的对齐方向，默认是`VerticalDirection.down`，表示从上到下。
- `crossAxisAlignment`：表示子组件在纵轴方向的对齐方式，`Row`的高度等于子组件中最高的子元素高度，它的取值和`MainAxisAlignment`一样(包含`start`、`end`、 `center`三个值)，不同的是`crossAxisAlignment`的参考系是`verticalDirection`，即`verticalDirection`值为`VerticalDirection.down`时`crossAxisAlignment.start`指顶部对齐，`verticalDirection`值为`VerticalDirection.up`时，`crossAxisAlignment.start`指底部对齐；而`crossAxisAlignment.end`和`crossAxisAlignment.start`正好相反；
- `children` ：子组件数组
#### Column



## 容器类组件

### Padding

```dart
Padding({
  ...
  EdgeInsetsGeometry padding,
  Widget child,
})
```

### EdgeInsets

我们看看`EdgeInsets`提供的便捷方法：

- `fromLTRB(double left, double top, double right, double bottom)`：分别指定四个方向的填充。
- `all(double value)` : 所有方向均使用相同数值的填充。
- `only({left, top, right ,bottom })`：可以设置具体某个方向的填充(可以同时指定多个方向)。
- `symmetric({ vertical, horizontal })`：用于设置对称方向的填充，`vertical`指`top`和`bottom`，`horizontal`指`left`和`right`。



### 尺寸限制类容器

#### ConstrainedBox

## 可以滚动的组件







































