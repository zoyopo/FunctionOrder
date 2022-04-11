# FunctionPipeline

A lib offer good ways for function programing in javascript (node and browser)

## why create the lib

Front-end development is always accompanied by events, IO operations and logic processing. These restrictions usually
lead to scattered logic and difficult code testing and maintenance.

## feature

- receive promise and pure functions, and execute a business process according to the receiving order.
- will support integrated state management, which can store the return values of some functions

## demo

### situation 1:receive pure functions

```ts
import {transformClassToFunctionPipeline} from 'functionPipe'
// or const {FunctionPipeline}  = require('functionpipeline') in nodejs
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
```ts
import {transformClassToFunctionPipeline} from 'functionPipe'
// or const {FunctionPipeline}  = require('functionpipeline') in nodejs
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






