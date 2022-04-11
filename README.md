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

#### function format

```ts
import {FunctionPipeline} from 'functionPipe'
// or const {FunctionPipeline}  = require('functionpipeline') in nodejs
class ActionJustFn {

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
const fpl = transformClassToFunctionPipeline(ActionJustFn, setState)
// 2 is plus function param
fpl.run(2) 
// ActionJustFn as nameSpace
// getActionResult was key of result
globalThis.store["ActionJustFn/getActionResult"] // 7
```





