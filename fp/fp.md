# 紹介
## 簡単な例
```typescript
export default () => {
  type Add<T> = (x:T, y:T) => T
  type Multiply<T> = (x:T, y:T) => T  

  const add: Add<number> = (x, y) => x + y
  const multiply: Multiply<number> = (x, y) => x * y

  const f_a = 4
  const f_b = 2

  const s = multiply(f_b, add(f_a, f_a))
  
  console.log(s)
}

```

# 一等function 
##　概要
arrayを保存して、parameterとして送る

# functionのいい
```typescript
Object.freeze(obj)
Object.isFrozen(obj)
```
+ functionの入力から出力まではマッピング
+ Cacheable
+ Portable / Self-Documenting
+ Testable
+ Reasonable
```typescript
export default () => {
  type Compact<T> = (xs: T[]) => T[]
  type Memoize<T> = (f: Function) => (...ar: T[]) => T

  const compact: Compact<number> = xs =>  xs.filter(x => x !== null && x !== undefined)
  const memoize: Memoize<number> = f => {
    let cache: {
      [ar: string]: number
    } = {}
    return function (...ar) {
      const arg_str = JSON.stringify(ar)
      cache[arg_str] = cache[arg_str] || f.apply(f, ar)
      return cache[arg_str]
    }
  }

  const add = memoize((x: number, y: number) => {
    return x + y
  })

  console.log(add(1, 2))
}
```

# curryをなる
只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数
curry 函数所做的正是这样：每传递一个参数调用函数，就返回一个新函数处理剩余的参数。这就是一个输入对应一个输出啊。
Functionにちょうとのparmを送って呼び出し、
即策略性地把要操作的数据（String， Array）放到最后一个参数里。到使用它们的时候你就明白这样做的原因是什么了。
```typescript
import { curry } from 'lodash'

export default () => {
  const match = curry((what: RegExp | string, str: string) => str.match(what))
  const replace = curry((what: RegExp | string, replacement: string, str: string) =>  str.replace(what, replacement))
  const filter = curry((f: any, ary: string[]) => ary.filter(f))
  const map = curry((f: any, ary: string[]) => ary.map(f))

  const hasSpaces = match(/\s+/g)
  const findSpaces = filter(hasSpaces);
  console.log(findSpaces(["tori_spelling", "tori amos"]))  // ["tori amos"]
}
```

# compose

# 命令式
```typescript
// map 的组合律
var law = compose(map(f), map(g)) == map(compose(f, g));
```

# 类型签名


