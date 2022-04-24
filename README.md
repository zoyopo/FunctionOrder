
![logo](https://pic.imgdb.cn/item/62595a0f239250f7c5fdd74b.png)

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


## Use in react

[Please visit this repo](https://github.com/zoyopo/react-function-order)


## online demo(react)

[Online Supermarket ](https://codesandbox.io/s/functionorder-demo-f1kqwz)


## quick start

```bash 
    npm i function-order -S   // or yarn add function-order -S   
```

## how it works

![流程图](https://pic.imgdb.cn/item/6255959b239250f7c5103c3b.jpg)



## how to use

### The simplest use


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
    // 2 is plus function param
    fo.run(2)
    // className ActionJustFn as nameSpace
    // getActionResult was key of result
    globalThis.store["getActionResult"] // 7
```


###  If we change `minus` and `Square` to asynchronous functions


```javascript
   import {transformClassToFunctionPipeline} from 'function-order'

    class FnReturnPromiseAction {
        plus(num) {
            return 1 + num
        }
    
        square(num) {
            return new Promise((resolve => {
                setTimeout(() => {
                    resolve(Math.pow(num, 2))
                },100)
            }))
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
        console.log(globalThis.store["getActionResult"])
        // 7    
    }, 300)

```
`functionOrder` will automatically execute asynchronous functions in synchronous order for us

###  Execute multiple parallel asynchronous functions when`run`
1. The functions between parallel and asynchronous functions are still executed in turn
```javascript
    import {transformClassToFunctionPipeline,InitKeys} from 'function-order'
  
    class PromiseIndependentAction {
        init() {
            return {
                // Declare the functions's names that need to store the result
                [InitKeys.saveResultNames]: ['storeMotoName', 'storeLocation'],
                // Declare flat async functions name
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
                expect(globalThis.store["storeMotoName"]).toBe('gsx250r')
                expect(globalThis.store["storeLocation"]).toBe('Japan')
                done()
            }, 1000)
        })
    })
```

We can declare `flatAsyncNames` in the `init` function and mark them as asynchronous functions executed in parallel. The functions after these functions will still be executed in turn. Now there are two results. We need to use two `keys` to store them.

Therefore, we can declare the function that stores the value in `saveResultNames` and use it as a `key`.

2. An asynchronous function returns promises executed in parallel

```javascript

class getMotoAction {
    getBrandNameById(id) {
        return new Promise((resolve => {
            setTimeout(() => {
                const map = {
                    7: 'suzuki',
                    8: 'honda'
                }
                resolve(map[id])
            }, 30)

        }))
    }

    getPopularMotoByBrand(brand) {
        let p = new Promise((resolve => {
            setTimeout(() => {
                const map = {
                    'honda': 'honda cm300',
                    'suzuki': 'gsx250r'
                }
                resolve(map[brand])
            }, 30)
        }))

        let p2 = new Promise((resolve => {
            setTimeout(() => {
                const map = {
                    'honda': 'Japan',
                    'suzuki': 'Japan',
                    'BMW': 'Ger'
                }
                resolve(map[brand])
            }, 30)
        }))
        return [p,p2]
    }
}
const setState = (fn) => {
    globalThis.store = fn(globalThis.store || {})
}
const fo = transformClassToFunctionPipeline(getMotoAction, setState)
fo.run('suzuki')
setTimeout(() => {
    console.log(globalThis.store["getActionResult"])
    // ["gsx250r","Japan"]        
}, 300)
```




## Change Log
- 0.1.9 —— Change actionState key from `className/methodName` to `methodName`
