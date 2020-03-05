# go
## 快速开始一个go程序
```golang
package main
import (
 "log"
 "os"

// 前面加一个_ 是初始化操作，允许导入包不使用，调用对于包内所有文件的init方法
 _ "github.com/goinaction/code/chapter2/sample/matchers"
 "github.com/goinaction/code/chapter2/sample/search"
)
def main() {

}
```
```golang
// 小写字母开头的变量不公开， 大写的公开
// map是一个引用类型 需要使用make来构造， 因为map变量默认的0值是nil
var matchers = make(map[string]Matcher)

// 调用了包里的RetrieveFeeds函数，
// 第一个返回值是Feed类型的切片，第二个是错误值
// := 用于声明一个变量，同时给变量赋予初始值
feeds, err := RetrieveFeeds()
if err != nil {
  log.Fatal(err)
}

// 创建一个无缓冲的通道，接收匹配后的结果
// 使用内置的make 创建一个没有缓冲的通道
// 在go中通道channel, 映射map, 切片slice都是引用类型
// 但是通道本身实现的是一组带类型的数据， 用于在goroutine之间传递，内置同步机制，从而保证了通道的安全
results := make(chan *Result)

// 为了防止程序在全部搜索执行完之前终止
// 构造一个 wait group，以便处理所有的数据源
var waitGroup sync.WaitGroup
// 设置需要等待处理
// 每个数据源的 goroutine 的数量
waitGroup.Add(len(feeds))


// 为每个数据源启动一个 goroutine 来查找结果
// 下划线是占位符，占据了保存 range 调用返回的索引值的变量的位
for _, feed := range feeds {
  // 获取一个匹配器用于查找
  matcher, exists := matchers[feed.Type]
  if !exists {
    matcher = matchers["default"]
  }

  // 启动一个 goroutine 来执行搜索
  go func(matcher Matcher, feed *Feed) {
      Match(matcher, feed, searchTerm, results)
      waitGroup.Done()
  }(matcher, feed)
}
```
```golang
// 声明了一个名叫 Feed 的结构类型。这个类型会对外暴露
// ` 引号里的部分被称作标记（tag）
type Feed struct {
  Name string `json:"site"`
  URI string `json:"link"`
  Type string `json:"type"`
}
```

## 打包和工具链