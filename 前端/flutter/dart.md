## const final

const表示编译时常量，即在代码还没有运行时我们就知道它声明变量的值是什么；而final不仅有const的编译时常量的特性，最重要的它是运行时常量，并且final是惰性初始化，即在运行时第一次使用前才初始化变

final x = new DateTime.now(); // 正确

const x = new DateTime.now(); // 错误

## buillt-in types

+ numbers

  int double

+ strings

  三引号 多行

+ booleans

+ list

+ maps

+ runes

+ symbols

## List

```dart
// 固定长度
List<int> l1 = List(1);
// l1.add(100); error
l1[0] = 11;
print(l1.length); // 长度

// 可变长度 .from([1, 2, 3, 4])
List<int> l2 = [];
l2.add(1);

// 不可变列表
List l3 = List.unmodifiable(l2);
// l3[0] = 111; error

// 创建指定长度内容
List l4 = List.filled(10, null);
// 用生成器赋值
List l5 = List.generate(10, (int index) {
  // print(index);
  return index;
});

// 相关属性
// .first .last .isEmpty .iterator 
// .single  // 判断是否只有一个元素
// print(l5.hashCode);
print(l5.runtimeType); // List<dynamic>

print(l5.toString());
l5.add(0);
print(l5.toSet());  // 集合
print(l5.toList());
print(l5.join(','));

// 查询
// .contains('?')   //是否包含
// .elementAt(?) => .[?]
// .indexOf('?')  .lastIndexOf('?')
print(l5.sublist(1, 3));

// insert
// .add(var)  .addAll(List)
// .insert(index, var)  .insertAll(index, List)

List l6 = ['a', 'c', 'd'];
// delete
// .remove(var) //删除第一次找到的坐标
l6.remove('c');
print(l6);
// .removeA(index)
// .removeLast()  // 删除最后一个
// .clear() 

// update
//  .sort();
// .shuffle() 随机排列
// List.setAll(int index, Iterable<String> iterable) → void
```



## Map



## func

### 可选位置参数

```dart
String say(String from, String msg, [String device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}
assert(say('Bob', 'Howdy') == 'Bob says Howdy');
assert(say('Bob', 'Howdy', 'smoke signal') ==
    'Bob says Howdy with a smoke signal');
```

### 默认参数值

```dart
void enableFlags({bool bold = false, bool hidden = false}) {
  // ...
}

// bold will be true; hidden will be false.
enableFlags(bold: true);
```

## operators

Expr1 ?? expr2 如果expr1不是null, 返回默认值 否则返回expr2的执行结果

级联操作符

```dart
querySelector('#button') // Get an object.
  ..text = 'Confirm'   // Use its members.
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));
```

?.

条件成员访问	和 . 类似，但是左边的操作对象不能为 null，例如 foo?.bar 如果 foo 为 null 则返回 null，否则返回 bar 成员

## exceptions

```dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  // A specific exception
  buyMoreLlamas();
} on Exception catch (e) {
  // Anything else that is an exception
  print('Unknown exception: $e');
} catch (e) {
  // No specified type, handles all
  print('Something really unknown: $e');
}

rethrow;	// 重新抛出异常

try {
  breedMoreLlamas();
} catch(e) {
  print('Error: $e');  // Handle the exception first.
} finally {
  cleanLlamaStalls();  // Then clean up.
}
```

## classes

### 命名构造函数

使用命名构造函数可为一个类实现多个构造函数 或者使用命名构造函数来更清晰表达意图

```dart
class Point {
  num x;
  num y;
  Point(this.x, this.y);
  Point.fromJson(Map json) {
    print(111);
    x = json['x'];
    y = json['y'];
  }
}

Point.fromJson({
  'x': 1,
  'y': 2
});
```

### 继承

 在构造函数参数后使用冒号 (`:`) 可以调用 超类构造函数

```dart
class Employee extends Person {
  // ...
  Employee() : super.fromJson(findDefaultData());
}
```

### 重定向构造函数

```dart
Point(this.x, this.y);

// Delegates to the main constructor.
Point.alongXAxis(num x) : this(x, 0);
```

### getters and setters

```dart
class Rectangle {
  num left;
  num top;
  num width;
  num height;

  Rectangle(this.left, this.top, this.width, this.height);

  // Define two calculated properties: right and bottom.
  num get right             => left + width;
      set right(num value)  => left = value - width;
  num get bottom            => top + height;
      set bottom(num value) => top = value - height;
}

main() {
  var rect = new Rectangle(3, 4, 20, 15);
  assert(rect.left == 3);
  rect.right = 12;
  assert(rect.left == -8);
}
```

### 枚举

```dart
enum Color {
  red,
  green,
  blue
}
```

### mixins

```dart
abstract class Musical {
  bool canPlayPiano = false;
  bool canCompose = false;
  bool canConduct = false;

  void entertainMe() {
    if (canPlayPiano) {
      print('Playing piano');
    } else if (canConduct) {
      print('Waving hands');
    } else {
      print('Humming to self');
    }
  }
}

class Musician extends Performer with Musical {
  // ...
}

class Maestro extends Person with Musical, Aggressive, Demented {
  Maestro(String maestroName) {
    name = maestroName;
    canConduct = true;
  }
}
```



## Generics

