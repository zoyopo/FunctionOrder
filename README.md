# FunctionOrder
![logo](https://pic.imgdb.cn/item/625594a3239250f7c50ea0fc.jpg)

[简体中文](https://github.com/zoyopo/FunctionPipeline/blob/master/README-zh_CN.md)

It provides a more standardized, efficient and easy to test functional programming method.

## why create the lib

Front-end development is always accompanied by events, IO operations and logic processing. These restrictions usually
lead to scattered logic and difficult code testing and maintenance. 

## Benefits

- Describe a business logic with classes

- Support integration status management

- Convert logic from imperative to declarative

- Easy to test

- Support react hooks

- Support Vue hooks (to be developed)



## quick start

### nodejs
```bash 
    npm i function-order -S   // or yarn add function-order -S   
```
### react
```bash
    npm i react-function-order -S   // or yarn add react-function-order -S   
```
## online demo(react)

[codeSandbox](https://codesandbox.io/s/functionorder-demo-4tgzj1?file=/src/App.tsx)

## how it works

![流程图](https://pic.imgdb.cn/item/6255959b239250f7c5103c3b.jpg)

## Some conventions
- All functions need to be returned
- Synchronous and non-immediately executed 'Promise' functions are executed in the order declared within 'class'
- The 'Promise' that wants to be executed immediately declares its method in the 'init' function as 'promiseExecutedImmediately'
- The parameters of the method in which the 'Promise' of immediate execution is executed are taken from the 'run' method
- Immediately executed 'Promises' are executed in parallel, and when they are finished, the functions that follow them are executed

## how to use

### situation 1:receive pure functions

#### nodejs

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
    const fo = transformClassToFunctionPipeline(JustFnAction, setState)
    // 2 is plus function param
    fo.run(2)
    // className ActionJustFn as nameSpace
    // getActionResult was key of result
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

### situation 2: receive pure functions and function return promise

#### nodejs

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
    const fo = transformClassToFunctionPipeline(ActionJustFn, setState)
    fo.run(2)
    setTimeout(() => {
        console.log(globalThis.store["FnReturnPromiseAction/getActionResult"])
        // 7    
    }, 300)

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

### Situation3: independent Promise execute when run method called

#### nodejs

```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
    // or const {FunctionPipeline}  = require('function-order') in nodejs
    class PromiseIndependentAction {
        init() {
            return {
                // Declare the functions's names that need to store the result
                needReturnValStoredMethods: ['storeMotoName', 'storeLocation'],
                // Declare the functions's names that the returned result is promise and has no pre dependency, which need to be executed when run method called
                promiseExecutedImmediately: ['getPopularMotoByBrand', 'getLocationByBrand']
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
   import {useFunctionOrderState} from 'react-function-order'
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

### Situation4:  Promise depend on Promise before

#### nodejs

```javascript
    import {transformClassToFunctionPipeline} from 'function-order'
    // or const {FunctionPipeline}  = require('function-order') in nodejs
    class PromiseDependOnBeforePromiseAction {
        init() {
            return {
                promiseExecutedImmediately: ['getPopularMotoByBrand']
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


