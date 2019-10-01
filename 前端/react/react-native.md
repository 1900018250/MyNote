# React Native

## 坑

### 解决500

yarn add babel-preset-react-native

### Module `react-native-*` does not exist in the Haste module map 

在安装完新的插件后发生的，提示之前安装的插件出了问题。

```
Module `react-native-*` does not exist in the Haste module
```

**解决办法：**

**首先**，运行`npm install react-native-* -save`( **注意：** `react-native-*`为插件名称)
**然后**，关闭下图窗口并运行`yarn start --reset-cache` or `npm start --reset-cache`

再重新打开命令后 react-native run-android

### picker组件

安卓上设置backrground #fff 去掉三角形

设置放大缩小来设置

```css	
transform: [
{ scaleX: 0.9 }, 
{ scaleY: 0.9 },
]
```



## 状态栏 安卓 

```javascript
<StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={'#fff'} //状态栏的背景色
          // translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle="dark-content"
          color='red'
      />
```




# React Navigation

## BASE

### createStactNavgator

返回一个React组件的方法 需要一个路由配置对象 和一个可选对象

```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  // 第一种
//  Home: {
 //   screen: HomeScreen,
 // },
  // 简写
  Home: HomeScreen,
});

export default createAppContainer(AppNavigator);
```



### 切换screens

```javascript
 <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
```

this.props.navgation  传递给每个在stacknavgator中定义的组件

可以多导航到同一个路由

右上角返回操作为 this.props.navigation.goBack()



### 导航生命周期

一个包含A和B页面的StackNavigator 当到A时候 A的DidMount调用

当跳转到B的时候 B的DidMount 调用， 但是A依然是被加载的状态 不会调用WillUnMount, 当B跳回A的时候 B的WillUnMount 调用， 但是A的DidMount不会被调用



### 给路由传递参数

```javascript
// 传递
<Button 
    title='切换'
    onPress={() => {this.props.navigation.navigate('Details',{
       id: 100
      })
    }}
/>

// 接收
<Text>{this.props.navigation.getParam('id', 'no id')}</Text>
```



### 配置header bar

```javascript
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    console.log(this.props)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button 
          title='切换'
          onPress={() => {this.props.navigation.navigate('Details',{
            id: 100
          })
        }}
        />
      </View>
    );
  }
}

// 自定义
class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require('./spiro.png')}
        style={{ width: 30, height: 30 }}
      />
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);



// 跨页面共享通用的navigationOptions

class HomeScreen extends React.Component {
  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <LogoTitle />,
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate('Details', {
              itemId: 86,
              otherParam: 'anything you want here',
            });
          }}
        />
      </View>
    );
  }
}

//使用
// navigation 上一个屏幕传递的参数
// navigationOptions - 如果未提供新值，将使用的默认或上一个选项
static navigationOptions = ({ navigation, navigationOptions }) => {
    console.log(navigationOptions);
    // Notice the logs ^
    // sometimes we call with the default navigationOptions and other times
    // we call this with the previous navigationOptions that were returned from
    // this very function
    return {
      title: navigation.getParam('otherParam', 'A Nested Details Screen'),
      headerStyle: {
        backgroundColor: navigationOptions.headerTintColor,
      },
      headerTintColor: navigationOptions.headerStyle.backgroundColor,
    };
  };

```



### 安卓标题居中

```javascript
navigationOptions: {
      headerTitleStyle:{
        alignSelf:'center',
        textAlign: 'center',
        flex:1,
      }
}

navigationOptions: {
      headerTitleStyle:{
        alignSelf:'center',
        textAlign: 'center',
        flex:1,
      },
      headerRight:React.createElement(View, null, null),
    }
```



### hearder 按钮

```javascript
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#fff"
      />
    ),
  };
}
```

在navigationOptions中 的 this不是 当前组件



### 开启全屏

```javascript
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class HomeScreen extends React.Component {
  static navigationOptions =  ({ navigation }) => {
    return {
      headerTitle: 'Home',
      headerRight: (
        <Button
          onPress={navigation.getParam('increaseCount')}
          title="+1"
          color="#333"
        />
      ),
      headerLeft: (
        <Button
          onPress={() => navigation.navigate('MyModal')}
          title="Info"
          color="#333"
        />
      ),
    }
  };

  state = {
    count: 0
  }

  _increaseCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  componentDidMount() {
    this.props.navigation.setParams({ increaseCount: this._increaseCount });
  }


  render() {
    console.log(this.props)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{this.state.count}</Text>
        <Button 
          title='切换'
          onPress={() => {this.props.navigation.navigate('Details',{
            id: 100
          })
        }}
        />
      </View>
    );
  }
}
class DetailsScreen extends React.Component {
  // static navigationOptions = {
  //   title: 'Details',
  // };
  render() {
    console.log(this.props.navigation.getParam('id', 'no id'));
    
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>{this.props.navigation.getParam('id', 'no id')}</Text>
        {/* <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')} */}
    
      </View>
    );
  }
}

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
    Details: {
      screen: DetailsScreen,
      navigationOptions: ({
        title: 'Details111',
      })
    }
  },
  {
    initialRouteName: 'Home'
  }
)

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    MyModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
```

`mode`配置可以是`card`（默认）或`modal`。 在 iOS 上，`modal`表现为从页面底部划入，并允许用户从页面顶部向下缩小以关闭它。 `modal`配置对Android没有影响，因为全屏模式在该平台上没有任何不同的转换行为



### Navigation Prop

这个 prop 将被传递到所有页面上，并且可以用于以下内容

- `dispatch`会向路由发送 action

- `state`是页面的当前路由

- `getParam`是访问可能在路由上的参数的助手

- `navigate`、`goBack`等方法是触发事件的便捷方法

  ``` javascript
   console.log(this.props.navigation.state)
   console.log(this.props.navigation.getParam('id', 'no id'));
  ```



## Guides

### 标签导航

yarn add createBottomTabNavigator

```javascript
import React from 'react';
import { Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen,
});

export default createAppContainer(TabNavigator);
```



### 自定义导航外观

```javascript
const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state
  if (routeName === 'Home') {
    iconName = `ios-information-circle`;
  } else if (routeName === 'Settings') {
    iconName = `ios-options`;
  }
  return <Ionicons name={iconName} size={25} color={tintColor} />
}

export default createAppContainer(
  createBottomTabNavigator(
    {
      Home: { screen: HomeScreen },
      Settings: { screen: SettingsScreen },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      },
    }
  )
);
```

tabBarIcon 是navgationOptions上的一个属性 把它放在createBottomTabNavigator是为了方便配置



### 切换tab

```javascript
 <Button
          title="Go to Settings"
          onPress={() => this.props.navigation.navigate('Settings')}
        />
```



### 每个 Tab 的 stack navigator

```javascript
const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  Details: DetailsScreen,
});

export default createAppContainer(
  createBottomTabNavigator(
    {
      Home: { screen: HomeStack },
      Settings: { screen: SettingsStack },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      },
    }
  )
);
```



### 在特定stack 中隐藏掉 bottom-tab

```javascript
const FeedStack = createStackNavigator({
  FeedHome: FeedScreen,
  Details: DetailsScreen,
});

FeedStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};
```



