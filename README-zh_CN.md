# FunctionOrder
<p style="text-align: center"><img src="https://pic.imgdb.cn/item/6259587d239250f7c5fafab0.png" alt=""></p>

提供一种更规范，高效，易于测试的函数式编程方式。

## 为何创建此库

前端开发总是伴随着事件、IO操作和逻辑处理。这些限制通常导致逻辑分散，代码测试和维护困难。

## 好处
- 以类来描述一个业务逻辑
- 支持集成状态管理
- 将逻辑由命令式转换为声明式
- 易于测试
- 支持 react hooks
- 支持 vue hooks (待开发)

## 快速开始

### nodejs
```bash 
    npm i function-order -S   // or yarn add function-order -S   
```
### react
```bash
    npm i react-function-order -S   // or yarn add react-function-order -S   
```

## 在线demo(react)

[选中物品分类获取物品和剩余的例子(codesandbox需翻墙)](https://codesandbox.io/s/functionorder-demo-4tgzj1?file=/src/App.tsx)

## 运行机制
![流程图](https://pic.imgdb.cn/item/6255959b239250f7c5103c3b.jpg)



## 一些约定
- 所有的函数都需要进行返回
- 同步函数和非立即执行的的`Promise`函数按照`class`内的声明顺序进行执行
- 想要立即执行的的`Promise`要在`init`函数中以`promiseExecutedImmediately`进行声明其所处的方法
- 立即执行的的`Promise`所处的方法的参数从`run`方法中获取
- 立即执行的的`Promise`会并行执行，当他们执行完毕，才会执行各自后面的函数 


## 基本使用

### 情景1：同步函数
#### nodejs
```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
  
    class JustFnAction {
    
        plus(num) {
            return 1 + num
        }
    
        square(num) {
            return Math.pow(num, 2)
        }
    
        minus(num) {
            return num - 2
        }
    }
    
    const setState = (fn) => {
        globalThis.store = fn(globalThis.store || {})
    }
    const fo = transformClassToFunctionPipeline(JustFnAction, setState)
    // 2 作为`plus`函数参数
    fo.run(2) 
    // 类名ActionJustFn作为名称空间
    // getActionResult是最终结果的key
    globalThis.store["ActionJustFn/getActionResult"] // 7
```
#### react

```jsx
   import {useFunctionOrderState} from 'react-function-order'
    function App() {
        const {actionState, foIns} = useFunctionOrderState({action: JustFnAction})
        useEffect(() => {
            foIns.run(2)
        }, [])
    
        useEffect(() => {
            console.log('actionState Change', actionState)
            // actionState Change {}
            // actionState Change {SimpleAction/getActionResult: 7}
        }, [actionState])
    
        return (
            <div className="App">
                {actionState['JustFnAction/getActionResult']}
            </div>
        )
    }
```
### 情景2：同步函数和异步函数
#### nodejs
```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
  
    class FnReturnPromiseAction {
        plus(num) {
            return 1 + num
        }
        square(num) {
            return Math.pow(num, 2)
        }
        minus(num) {
            return new Promise((resolve => {
                setTimeout(() => {
                    resolve(num - 2)
                }, 200)
    
            }))
        }
    }
    
    const setState = (fn) => {
        globalThis.store = fn(globalThis.store || {})
    }
    const fo = transformClassToFunctionPipeline(ActionJustFn, setState)
    fo.run(2) 
    setTimeout(()=>{
        console.log(globalThis.store["FnReturnPromiseAction/getActionResult"] )
        // 7    
    },300)

```

#### react

```jsx
   import {useFunctionOrderState} from 'react-function-order'
    function App() {
        const {actionState, foIns} = useFunctionOrderState({action: FnReturnPromiseAction})
        useEffect(() => {
            foIns.run(2)
        }, [])
    
        useEffect(() => {
            console.log('actionState Change', actionState)
            // actionState Change {}
            // actionState Change {SimpleAction/getActionResult: 7}
        }, [actionState])
    
        return (
            <div className="App">
                {actionState['FnReturnPromiseAction/getActionResult']}
            </div>
        )
    }
```

### Situation3: 扁平的异步函数
#### nodejs
```javascript
    import {transformClassToFunctionPipeline,InitKeys} from 'function-order'
  
    class PromiseIndependentAction {
        init() {
            return {    
                // 声明需要存储结果的函数名
                [InitKeys.saveResultNames]: ['storeMotoName', 'storeLocation'],
                // 声明扁平的异步函数名
                [InitKeys.flatAsyncNames]: ['getPopularMotoByBrand', 'getLocationByBrand']
            }
        }
    
        getPopularMotoByBrand(brand) {
            return new Promise((resolve => {
                setTimeout(() => {
                    const map = {
                        'honda': 'honda cm300',
                        'suzuki': 'gsx250r'
                    }
                    resolve(map[brand])
                }, 30)
    
            }))
        }
    
        storeMotoName(res) {
            return res
        }
    
        getLocationByBrand(brand) {
            return new Promise((resolve => {
                setTimeout(() => {
                    const map = {
                        'honda': 'Japan',
                        'suzuki': 'Japan',
                        'BMW': 'Ger'
                    }
                    resolve(map[brand])
                }, 30)
            }))
        }
    
        storeLocation(res) {
            return res
        }
    }
    
    
    const setState = (fn) => {
        globalThis.store = fn(globalThis.store || {})
    }
    const fo = transformClassToFunctionPipeline(PromiseIndependentAction, setState)
    describe('Action.promise independent', () => {
        it('works', done => {
            fo.run('suzuki')
            setTimeout(() => {
                expect(globalThis.store["PromiseIndependentAction/storeMotoName"]).toBe('gsx250r')
                expect(globalThis.store["PromiseIndependentAction/storeLocation"]).toBe('Japan')
                done()
            }, 1000)
        })
    })
```
#### react

```jsx
   import {useFunctionOrderState,InitKeys} from 'react-function-order'
    function App() {
        const {actionState, foIns} = useFunctionOrderState({action: PromiseIndependentAction})
        useEffect(() => {
            foIns.run('suzuki')
        }, [])
    
        useEffect(() => {
            console.log('actionState Change', actionState)     
            //{
            // PromiseIndependentAction/storeMotoName:"gsx250r",
            //  PromiseIndependentAction/storeLocation:'Japan'
            // }
        }, [actionState])
    
        return (
            <div className="App">
                {actionState['PromiseIndependentAction/storeMotoName']}
            </div>
        )
    }
```
### Situation4:  异步函数依赖于前面的异步函数
#### nodejs
```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
  
    class PromiseDependOnBeforePromiseAction {    
        getPopularMotoByBrand(brand) {
            return new Promise((resolve => {
                setTimeout(() => {
                    const map = {
                        'honda': 'honda cm300',
                        'suzuki': 'gsx250r'
                    }
                    resolve(map[brand])
                }, 30)
    
            }))
        }
    
        getWeightOfMotoName(motoName) {
            return new Promise((resolve => {
                setTimeout(() => {
                    const map = {
                        'honda cm300': '170kg',
                        'gsx250r': '180kg'
                    }
                    resolve(map[motoName])
                }, 30)
            }))
        }
    
    }


    const setState = (fn) => {
        globalThis.store = fn(globalThis.store || {})
    }
    const fo = transformClassToFunctionPipeline(PromiseDependOnBeforePromiseAction, setState)
    
    describe('Action.promise dependent', () => {
        it('works', done => {
            fo.run('suzuki')
            setTimeout(() => {
                expect(global.store["PromiseDependOnBeforePromiseAction/getActionResult"]).toBe('180kg')
                done()
            }, 1000)
    
        })
    })
```
#### react


```jsx
   import {useFunctionOrderState} from 'react-function-order'
    function App() {
        const {actionState, foIns} = useFunctionOrderState({action: PromiseDependOnBeforePromiseAction})
        useEffect(() => {
            foIns.run('suzuki')
        }, [])
    
        useEffect(() => {
            console.log('actionState Change', actionState)     
            //{
            // PromiseDependOnBeforePromiseAction/getActionResult:"180kg"        
            // }
        }, [actionState])
    
        return (
            <div className="App">
                {actionState['PromiseDependOnBeforePromiseAction/getActionResult']}
            </div>
        )
    }
```



