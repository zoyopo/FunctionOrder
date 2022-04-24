
<p style="text-align: center"><img src="https://pic.imgdb.cn/item/62595a0f239250f7c5fdd74b.png" alt=""></p>

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

## 在react总使用

[请访问这个仓库](https://github.com/zoyopo/react-function-order)


## 在线demo(react)

[在线超市(codesandbox)](https://codesandbox.io/s/functionorder-demo-f1kqwz)

## 快速开始

```bash 
    npm i function-order -S   // or yarn add function-order -S   
```




## 运行机制
![流程图](https://pic.imgdb.cn/item/6255959b239250f7c5103c3b.jpg)




## 基本使用

### 最简单的使用

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
    globalThis.store["getActionResult"] // 7
```

### 如果我们将`minus`,`square`改为异步函数

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
    setTimeout(()=>{
        console.log(globalThis.store["getActionResult"] )
        // 7    
    },300)

```
`functionOrder`会自动为我们将异步函数按照同步顺序执行


### `run`的时候执行多个并行的异步函数
1. 并行异步函数之间的函数依然依次执行
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
                expect(globalThis.store["storeMotoName"]).toBe('gsx250r')
                expect(globalThis.store["storeLocation"]).toBe('Japan')
                done()
            }, 1000)
        })
    })
```
我们可以在`init`函数中声明`flatAsyncNames`，标记其为并行执行的异步函数，在这些函数之后的函数，依然会依次执行。那么现在有两个结果，我们需要利用两个`key`来存储，
所以我们可以在`saveResultNames`声明存储值的函数，并以此为`key`

2. 一个异步函数返回并行执行的promises
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

## 版本改动记录
- 0.1.9 —— 将actionState的key从`className/methodName` 改为 `methodName`

