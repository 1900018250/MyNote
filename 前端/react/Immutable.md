# Immutable.js

## 简介

es6实现了assign相当于浅copy

Immutable 可持久化的数据结构， 数据一旦被创建 就不能更改的数据

没当对immutable对象进行修改的时候 返回一个新的对象来保证数据的不可变\

数组对应List 对象对应Map

## 优势

- 便于数据回溯

+ 并发安全
+ 函数式编程 

## Immutable.js 的几种数据类型

- List: 有序索引集，类似JavaScript中的Array。
- Map: 无序索引集，类似JavaScript中的Object。
- OrderedMap: 有序的Map，根据数据的set()进行排序。
- Set: 没有重复值的集合。
- OrderedSet: 有序的Set，根据数据的add进行排序。
- Stack: 有序集合，支持使用unshift()和shift()添加和删除。
- Record: 一个用于生成Record实例的类。类似于JavaScript的Object，但是只接收特定字符串为key，具有默认值。
- Seq: 序列，但是可能不能由具体的数据结构支持。
- Collection: 是构建所有数据结构的基类，不可以直接构建。



## Map

```javascript
const map1 = Map({ a: 1, b: 2, c: 3, x: List([ Map({ y: 123 }) ]) })
map1.get('a')	// 1
const map2 = map1.set('a', 2)	// 对原数据操作后赋值给新数据
// setIn
map1.size	// 3
map1.has('a')	// true
map1.getIn(['x', 0, 'y'])	// 123
map1.includes(1)	// true
map1.first()	// 1
map1.last()	// List([ Map({ y: 123 }) ])
const map3 = map1.delete('c')	// 返回新数据 不操作原来的数据

// 独有
// deleteAll['a', 'c']	// 只有map支持
```



## List

```javascript
const List1 = List([1 ,2 ])
// 独有
const List2 = List1.push('1')
//push()：在List末尾插入一个元素
//pop(): 在List末尾删除一个元素
//unshift: 在List首部插入一个元素
//shift: 在List首部删除一个元素
//insert：在List的index处插入元素
// setSize()	设置长度



// update
const List1 =  List([1 ,2 ])
const l2 = List1.update(0, v => v + 1)
// updateIn

// clear() 清除所有的数据
```



## Merga

```javascript
merge	//作用：浅合并，新数据与旧数据对比，旧数据中不存在的属性直接添加，就数据中已存在的属性用新数据中的覆盖
mergrWith(fn, newMap)	// 作用：自定义浅合并，可自行设置某些属性的值
mergeIn	// 作用：对深层数据进行浅合并
mergeDeep	// 作用：深合并，新旧数据中同时存在的的属性为新旧数据合并之后的数据
mergeDeepIn // 作用：对深层数据进行深合并
mergrDeepWith 作用:自定义深合并，可自行设置某些属性的值
```



## 序列算法

```javascript
concat()

map()
Map({a:1,b:2}).map((key,val)=>{
  return [key+'l',val*10]
})
//Map{al:10,bl:20}


filter()
sort()
sortBy()

reverse()

reduce()
Immutable.fromJS([1,2,3,4]).reduce((pre,next,index,arr)=>{
  console.log(pre+next)
  return pre+next; 
})
// 3 6 10
reduceRight()

every()
some()

count()
list.count((value,index,list)=>{
  return value > 2;
})    //2

```

## 分组

```
const listOfMaps = List([
  Map({ v: 0 }),
  Map({ v: 1 }),
  Map({ v: 1 }),
  Map({ v: 0 }),
  Map({ v: 2 })
])
const groupsOfMaps = listOfMaps.groupBy(x => x.get('v'))
// Map {
//   0: List [ Map{ "v": 0 }, Map { "v": 0 } ],
//   1: List [ Map{ "v": 1 }, Map { "v": 1 } ],
//   2: List [ Map{ "v": 2 } ],
// }


```



## find

```javascript
// indexOf() 、 lastIndexOf Map不存在此方法
// findIndex() 、 findLastIndex() Map不存在此方法
Immutable.fromJS([1,2,3,4]).findIndex((value,index,array)=>{
  return value%2 === 0;
})   // 1
Immutable.fromJS([1,2,3,4]).findLastIndex((value,index,array)=>{
  return index%2 === 0;
})  // 3
// find() 、 findLast() 查找满足条件的元素的value值

findKey() 、 findLastKey()
Immutable.fromJS([1,2,3,4]).findKey((value,index,array)=>{
  return value%2 === 0;
})  // 1
Immutable.fromJS([1,2,3,4]).findLastKey((value,index,array)=>{
  return value%2 === 0;
})  // 3

findEntry() 、 findLastEntry()
Immutable.fromJS([1,2,3,4]).findEntry((value,index,array)=>{
  return value%2 === 0;
})  // [1,2]
Immutable.fromJS([1,2,3,4]).findLastEntry((value,index,array)=>{
  return value%2 === 0;
})  // [3,4]

keyOf() lastKeyOf()
Immutable.fromJS([1,2,3,4]).keyOf(2) //1
Immutable.fromJS([1,2,3,4]).lastKeyOf(2) //1

max() 、 maxBy()
min() 、 minBy()
```



## 创建子集

```javascript
slice()
rest()	//返回除第一个元素之外的所有元素
butLast()
skip()	// 有一个参数n, 返回截掉前n个元素之后剩下的所有元素
skipLast()
...
```



## 

# 