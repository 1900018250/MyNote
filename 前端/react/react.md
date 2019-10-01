##  react的生命周期
yarn add @babel/runtime --dev
http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

![img](/Users/ldl/Desktop/forget/study/笔记/前端/react/img/1106982-20170811224737742-1564011484.png)

1. 组件初始化 initalization 阶段

2. ```javascript
   static getDerivedStateFromProps(props, state)
   getDerivedStateFromProps 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
   ```

2. 更新

   ```javascript
   shouldComponentUpdate(nextProps, nextState)
   根据 shouldComponentUpdate() 的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响。默认行为是 state 每次发生变化组件都会重新渲染。大部分情况下，你应该遵循默认行为。
   ```

   ```
   getSnapshotBeforeUpdate(prevProps, prevState)
   etSnapshotBeforeUpdate() 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期的任何返回值将作为参数传递给 componentDidUpdate()。
   ```

   ```
   componentDidUpdate(prevProps, prevState, snapshot)
   componentDidUpdate() 会在更新后会被立即调用。首次渲染不会执行此方法。
   
   当组件更新后，可以在此处对 DOM 进行操作。如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。（例如，当 props 未发生变化时，则不会执行网络请求）。
   ```

 ```
componentWillMount() – 在渲染之前执行，在客户端和服务器端都会执行。
componentDidMount() – 仅在第一次渲染后在客户端执行。
componentWillReceiveProps() – 当从父类接收到 props 并且在调用另一个渲染器之前调用。
shouldComponentUpdate() – 根据特定条件返回 true 或 false。如果你希望更新组件，请返回true 否则返回 false。默认情况下，它返回 false。
componentWillUpdate() – 在 DOM 中进行渲染之前调用。
componentDidUpdate() – 在渲染发生后立即调用。
componentWillUnmount() – 从 DOM 卸载组件后调用。用于清理内存空间。
 ```



## Context	

Context 提供一个无需为每一层组件手动添加props 就能在组件树间进行数据传递的方法

### 何时使用Context

ontext 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。

使用context 可以避免通过中间元素传递props

```javascript
const ThemeContext = React.createContext('light')  //定义

// 使用
export default class ConButton extends React.Component {
    public render() {
        console.log(12312323)
        console.log(this.context);
        
      // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
      // 无论多深，任何组件都能读取这个值。
      // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
      return (
        <ThemeContext.Provider value="dark">
          <Toolbar />
        </ThemeContext.Provider>
      );
    }
  }

 // ConButton.contextType = ThemeContext // 在组件中使用
//挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象。这能让你使用 this.context 来消费最近 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中。
```



## refs 转发

Ref 转发是将ref自动的通过组件传递到其一子组件的技巧，对某些课冲用的组件库很有用

什么时候使用Refs

1. 管理焦点 文本选择 和 媒体播放
2. 触发强制动画
3. 集成第三方的DOM库

```javascript
public ref = React.createRef()
const FancyButton:any = React.forwardRef(({children, ref1, onClick}: {
            children:any
            ref1:any
            onClick: () => void
        }) => (
            <button ref={ref1} className="Fancy" onClick={onClick}>
                {children}
            </button>
        ))
```



## 懒加载

```javascript
import React, { Suspense, lazy } from 'react';
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}


const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
```





## hook

###State Hook 函数中使用state

```javascript
import * as React  from 'react'
import { useState } from 'react'

export default function Example() {
    // 声明一个叫 “count” 的 state 变量。
    const [count, setCount] = useState(0);
    const [num, setNum] = useState<number>(1)

    return (
      <div>
        <p>You clicked {count} times {num}</p>
        <button onClick={() => { 
            setCount(count + 1)
            setNum(num + 1)
            }}>
          Click me
        </button>
      </div>
    );
  }
```



### Effect Hook 给函数增加操作副作用的能力

```javascript
// 相当于componentDidMount componentDidUpdate componentWillUnmount
useEffect(() => {
  document.title = `you ${count}`
})

useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新

useEffect(() => {
        document.title = `you click ${count}`
        console.log('开始副作用')
        return function cleanup() {
            console.log('清楚副作用')
        };
    })
```

在react组件中有两种常见的副作用操作 需要清楚和不需要清楚的

useEffect告诉React组件需要在渲染之后执行某些操作



### 自定义Hook

```javascript
function useTest(id:number):any {
  const [isOn, setIsOn] = useState<boolean>(false)
  useEffect(() => {
    console.log('开始自定义副作用')
    if(id % 2 === 0) {
      setIsOn(true)
    } else {
      setIsOn(false)
    }
    return () => { 
      console.log('开始清理自定义副作用')
      // setIsOn(false)
    }
  })
  return isOn
}
```



### useContext

```javascript
const value = useContext(MyContext);
```



## react router

### withRouter

```javascript
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

// A simple component that shows the pathname of the current location
class ShowTheLocation extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { match, location, history } = this.props;

    return <div>You are now at {location.pathname}</div>;
  }
}

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
const ShowTheLocationWithRouter = withRouter(ShowTheLocation);
```

让被包装的组件可以访问到 match location history 这三个属性



###  重定向 Redirect

<Redirect />

to: string 重定向到一个url

to: object 

```javascript
<Redirect
  to={{
    pathname: "/login",
    search: "?utm=your+face",
    state: { from: props.location }	// 传递到const { from } = this.props.location.state
  }}
/>
```



### 自定义Link

```javascript
function OldSchoolMenuLink({ label, to, activeOnlyWhenExact }) {
  return (
    <Route
      path={to}
      exact={activeOnlyWhenExact}
      children={({ match }) => (
        <div className={match ? "active" : ""}>
          {match ? "> " : ""}
          <Link to={to}>{label}</Link>
        </div>
      )}
    />
  );
}
```



## redux

API 是 subscrbe dispatch getState

三大原则： 单一数据源 State是只读的 使用纯函数执行修改

### Action 

在 Redux 中的 action 创建函数只是简单的返回一个 action

```javascript
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})
```

或者创建一个 **被绑定的 action 创建函数** 来自动 dispatch

```javascript
const boundAddTodo = text => dispatch(addTodo(text))
const boundCompleteTodo = index => dispatch(completeTodo(index))

boundAddTodo(text);
boundCompleteTodo(index);
```



### Reducer

**Reducers** 指定了应用状态的变化如何响应 [actions](https://www.redux.org.cn/docs/basics/Actions.html) 并发送到 store 的，记住 actions 只是描述了*有事情发生了*这一事实，并没有描述应用如何更新 state。

[`combineReducers()`](https://www.redux.org.cn/docs/api/combineReducers.html) 

```javascript
import { combineReducers } from 'redux'

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```





## redux-saga

### takeEvery

`redux-saga` 当一些特定的操作被调度到Store时，提供一些辅助效果包装内部函数以生成任务。

```javascript
import { takeEvery } from 'redux-saga/effects'

// FETCH_USERS
function* fetchUsers(action) { ... }

// CREATE_USER
function* createUser(action) { ... }

// use them in parallel
export default function* rootSaga() {
  yield takeEvery('FETCH_USERS', fetchUsers)
  yield takeEvery('CREATE_USER', createUser)
}
```



### Effect提供的具体方法

```csharp
{ take, call, put, select, fork, takeEvery, takeLatest }
```

常见effect的用法

1. call 异步阻塞调用
2. fork 异步非阻塞调用，无阻塞的执行fn，执行fn时，不会暂停Generator
3. put 相当于dispatch，分发一个action
4. select 相当于getState，用于获取store中相应部分的state
5. take 监听action，暂停Generator，匹配的action被发起时，恢复执行。take结合fork，可以实现takeEvery和takeLatest的效果
6. takeEvery 监听action，每监听到一个action，就执行一次操作
7. takeLatest 监听action，监听到多个action，只执行最近的一次
8. cancel 指示 middleware 取消之前的 fork 任务，cancel 是一个无阻塞 Effect。也就是说，Generator 将在取消异常被抛出后立即恢复
9. race 竞速执行多个任务
10. throttle 节流

#### takeEvery takeLatest

takeEvery和takeLatest用于监听相应的动作并执行相应的方法，是构建在take和fork上面的高阶api

```javascript
yield takeEvery('INCREMENT_ASYNC', incrementAsync)
```

在任何时刻 `takeLatest` 只允许一个 `fetchData` 任务在执行。并且这个任务是最后被启动的那个

#### call

异步阻塞调用

call(fn, ...args)

call和apply方法与js中的call和apply相似

创建一个 Effect 描述信息，用来命令 middleware 以参数 `args` 调用函数 `fn` 。

- `fn: Function` - 一个 Generator 函数, 也可以是一个返回 Promise 或任意其它值的普通函数。
- `args: Array<any>` - 传递给 `fn` 的参数数组。
- 

#### put

![image-20190920131718000](/Users/ldl/Library/Application Support/typora-user-images/image-20190920131718000.png)

```javascript
 yield put({ type:'login' })
```



#### select

select(selector, ...args)

创建一个 Effect，用来命令 middleware 在当前 Store 的 state 上调用指定的选择器（即返回 `selector(getState(), ...args)` 的结果）。

- `selector: Function` - 一个 `(state, ...args) => args` 的函数。它接受当前 state 和一些可选参数，并返回当前 Store state 上的一部分数据。
- `args: Array<any>` - 传递给选择器的可选参数，将追加在 `getState` 后。

如果调用 `select` 的参数为空（即 `yield select()`），那么 effect 会取得完整的 state（与调用 `getState()` 的结果相同）



### * 监听未来的action

Take 创建另一个命令对象 告诉middleware等待一个特定的action

```javascript
import { select, take } from 'redux-saga/effects'

function* watchAndLog() {
  while (true) {
    const action = yield take('*')
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  }
}
```



### 无阻塞调用

```javascript
import { take, call, put, cancelled } from 'redux-saga/effects'
import Api from '...'

function* authorize(user, password) {
  try {
    const token = yield call(Api.authorize, user, password)
    yield put({type: 'LOGIN_SUCCESS', token})
    yield call(Api.storeItem, {token})
    return token
  } catch(error) {
    yield put({type: 'LOGIN_ERROR', error})
  } finally {
    if (yield cancelled()) {
      // ... put special cancellation handling code here
    }
  }
}

function* loginFlow() {
  while(true) {
    const {user, password} = yield take('LOGIN_REQUEST')
    // fork return a Task object
    const task = yield fork(authorize, user, password)
    const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
    if(action.type === 'LOGOUT')
      yield cancel(task)
    yield call(Api.clearItem('token'))
  }
}
```



### 并行运行多个任务

```javascript
import { all, call } from 'redux-saga/effects'

// correct, effects will get executed in parallel
const [users, repos] = yield all([
  call(fetch, '/users'),
  call(fetch, '/repos')
])
```











