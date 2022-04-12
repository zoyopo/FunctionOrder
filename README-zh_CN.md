# FunctionOrder

提供一种更规范，高效，易于测试的函数式编程方式

## 为何创建此库

前端开发总是伴随着事件、IO操作和逻辑处理。这些限制通常

导致逻辑分散，代码测试和维护困难。

## 特性

- 接收`promise `和纯函数，并根据接收顺序执行业务流程。

- 支持集成状态管理，可以存储某些函数的返回值

- 支持 react hooks
- 支持 vue hooks (待开发)

## 快速开始

```bash
    npm i function-order -S   // or yarn add function-order -S   
```


## 基本使用

### 情景1：接收纯函数

```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
    // or const {FunctionPipeline}  = require('function-order') in nodejs
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
    const fpl = transformClassToFunctionPipeline(JustFnAction, setState)
    // 2 作为`plus`函数参数
    fpl.run(2) 
    // 类名ActionJustFn作为名称空间
    // getActionResult是最终结果的key
    globalThis.store["ActionJustFn/getActionResult"] // 7
```

### 情景2：接受纯函数和函数返回`Promise`
```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
    // or const {FunctionPipeline}  = require('function-order') in nodejs
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
    const fpl = transformClassToFunctionPipeline(ActionJustFn, setState)
    fpl.run(2) 
    setTimeout(()=>{
        console.log(globalThis.store["FnReturnPromiseAction/getActionResult"] )
        // 7    
    },300)

```

### Situation3: 调用run方法时执行无依赖`Promise`
```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
    // or const {FunctionPipeline}  = require('function-order') in nodejs
    class PromiseIndependentAction {
        init() {
            return {    
                // 声明需要存储结果的函数名
                stateStoredFnNames: ['storeMotoName', 'storeLocation'],
                // 声明用run方法时执行无依赖`Promise`的函数名
                rootPromiseFnNames: ['getPopularMotoByBrand', 'getLocationByBrand']
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
    const fpl = transformClassToFunctionPipeline(PromiseIndependentAction, setState)
    describe('Action.promise independent', () => {
        it('works', done => {
            fpl.run('suzuki')
            setTimeout(() => {
                expect(globalThis.store["PromiseIndependentAction/storeMotoName"]).toBe('gsx250r')
                expect(globalThis.store["PromiseIndependentAction/storeLocation"]).toBe('Japan')
                done()
            }, 1000)
        })
    })
```

### Situation4:  Promise 依赖于前面的 Promise

```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
    // or const {FunctionPipeline}  = require('function-order') in nodejs
    class PromiseDependOnBeforePromiseAction {
        init() {
            return {           
                rootPromiseFnNames: ['getPopularMotoByBrand']
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
    const fpl = transformClassToFunctionPipeline(PromiseDependOnBeforePromiseAction, setState)
    
    describe('Action.promise dependent', () => {
        it('works', done => {
            fpl.run('suzuki')
            setTimeout(() => {
                expect(global.store["PromiseDependOnBeforePromiseAction/getActionResult"]).toBe('180kg')
                done()
            }, 1000)
    
        })
    })
```
## 和react状态管理集成(react 自定义hooks)

```jsx
    import {useActionState} from 'function-order'
    class SimpleAction{
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
        function App() {
        const {actionState, fplIns} = useActionState({action: SimpleAction})
        useEffect(() => {
            fplIns.run(2)
        }, [])
    
        useEffect(() => {
            console.log('actionState Change', actionState)
            // actionState Change {}
            // actionState Change {SimpleAction/getActionResult: 7}
        }, [actionState])
    
        return (
            <div className="App">
                {actionState['SimpleAction/getActionResult']}
            </div>
        )
    }
```

