## 安装

```javascript
npm install --save styled-components
npm i @types/styled-components@4.1.8 --save-dev --save-exact
用最新版本会报错
```

## 开始

```javascript
import * as React from 'react'
import styled from 'styled-components'
```

```javascript
// 基础语法
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;
render(
  <Wrapper>
    <Title>
      Hello World!
    </Title>
  </Wrapper>
);
```

## 基于props

```javascript
export default function Sld({ primary, }: Props): JSX.Element {
   
    const Title: any = styled.h1`
        font-size: 1.5em;
        text-align: center;
        color: ${() => primary ? 'red' : 'yellow'}
    `;
      return (
        <Title>
            Hello World!21222
        </Title>
    );
}
```

## 扩展样式， 重定义标签名(适用于定制样式)

```javascript
const Title: any = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: ${() => primary ? 'red' : 'yellow'}
`;
// 在Title的基础上扩展属性
const FreeTitle = styled(Title)`
	text-decoration: underline;
`

const Button = styled.button`
  display: inline-block;
  color: palevioletred;
  display: block;
`
interface RbProps {
  children: string
}
const ReversedButton = (props:RbProps) => <Button {...props} 
children={props.children.split('').reverse()} />

 return (
   // as="h2" 把原本上h1点Title变成了h2
   <FreeTitle as="h2">
  	 Hello World!21222
   </FreeTitle>
   <Button>Normal Button</Button>
   <Button as={ReversedButton}>Custom Button with Normal Button styles</Button>
        
    );
```

## 样式组件

```javascript
const Link = ( { className, children }:{
    className: any  // 类名
    children: any   // 字符串
}) => (
    <a className={className}>
      {children}
    </a>
  );
const StyledLink = styled(Link)`
    color: palevioletred;
    font-weight: bold;
`
<StyledLink className='aaa'>Styled, exciting Link</StyledLink>


interface BoxProps {
  theme?: ThemeInterface;
  borders?: boolean;
  className?: string;
}

const Box: React.FunctionComponent<BoxProps> = props => <div className={props.className}>{props.children}</div>

const StyledBox = styled(Box)`
  padding: ${props => props.theme.lateralPadding};
`
```

## 传递props

```javascript
const Input = styled.input`
  padding: .5em;
  margin: .5em;
  color: ${(propss: {
            inputColor: string
            }) =>
  {
  console.log(propss)
  return propss.inputColor || "palevioletred"
  } 

  };
  background: papayawhip;
  border: none;
  border-radius: 3px;
`
Input defaultValue="@geelen" type="text" inputColor="rebeccapurple" />
```

这里的inputColor="rebeccapurple" 没有传递到标签上 因为styled-components 自动过滤了

## css伪选择器 和嵌套

```c++
“~”的定义和用法 ~ul选择器 p之后出现的所有ul
.a，.b｛逗号指相同的css样式｝；
.a .b｛空格指后代元素｝；
.a>.b｛大于号指子代元素｝；
.a+.b｛这个“+”是选择相邻兄弟，叫做“相邻兄弟选择器”
```

## 附加额外的props

```javascript
const MyInput = styled.input
.attrs(
  // 这是attrs.constructor 通过它可以添加额外的 props 或 attributes 到组
    (props123: any) => ({
        // we can define static props
        type: "password",
        typeIndex: 0,   // 这里不会写到元素属性中
        // or we can define dynamic ones
        size: props123.size || "1em",
    })
)
.attrs(
    {
        tabIndex: i++   // 这里会写到元素属性
    }
)`
    color: palevioletred;
    font-size: 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
  
    /* here we use the dynamically computed prop */
    margin: ${props123 => props123.size};
    padding: ${props123 => props123.size};
  `;

<div>
    <MyInput placeholder="A small text input" />
    <br />
    <MyInput placeholder="A bigger text input" size="2em" />
 </div>
```

可以使用 [`.attrs` constructor](https://www.styled-components.com/docs/api#attrs). 通过它可以添加额外的 props 或 attributes 到组件.

这里重组了props123`.attrs` 对象也接收函数,返回值也将合并进 props.

## 动画

```javascript
// Create the keyframes
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
// Here we create a component that will rotate everything we pass in over two seconds
const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;
render(
  <Rotate>&lt; 💅 &gt;</Rotate>
);
```

