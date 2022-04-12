# FunctionOrder

[简体中文](https://github.com/zoyopo/FunctionPipeline/blob/master/README-zh_CN.md)

A lib offer ways like pipeline for function programing in javascript (node or browser)。

## why create the lib

Front-end development is always accompanied by events, IO operations and logic processing. These restrictions usually
lead to scattered logic and difficult code testing and maintenance.

## feature

- receive promise and pure functions, and execute a business process according to the receiving order.
- will support integrated state management, which can store the return values of some functions
- react hooks support
- vue hooks will be supported

## quick start

```bash
    npm i function-order -S   // or yarn add function-order -S   
```

## how to use

### situation 1:receive pure functions

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
// 2 is plus function param
fpl.run(2)
// className ActionJustFn as nameSpace
// getActionResult was key of result
globalThis.store["ActionJustFn/getActionResult"] // 7
```

### situation 2: receive pure functions and function return promise

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
setTimeout(() => {
    console.log(globalThis.store["FnReturnPromiseAction/getActionResult"])
    // 7    
}, 300)

```

### Situation3: independent Promise execute when run method called

```javascript
    import {transformClassToFunctionPipeline} from 'function-order'

// or const {FunctionPipeline}  = require('function-order') in nodejs
class PromiseIndependentAction {
    init() {
        return {
            // Declare the functions's names that need to store the result
            stateStoredFnNames: ['storeMotoName', 'storeLocation'],
            // Declare the functions's names that the returned result is promise and has no pre dependency, which need to be executed when run method called
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

### Situation4:  Promise depend on Promise before

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

## Integration with react(react custom hooks)

```jsx
    import {useActionState} from 'function-order'

class SimpleAction {
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

