const {transformClassToFunctionPipeline} = require('../dist/index')

class Action {
    doAction1() {
        return 1
    }
    doAction2(b) {
        console.log('b+2', b + 2)
        return b + 2
    }
}

const fpl = transformClassToFunctionPipeline(Action)

console.log(fpl.run())
