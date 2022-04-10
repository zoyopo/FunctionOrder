const {transformClassToFunctionPipeline} = require('../dist/index')

class Action {
    init() {
        return {
            stateStoredFnNames: ['operateResult']
        }
    }

    plus(num) {
        return 1 + num
    }

    square(num) {
        return Math.pow(num, 2)
    }

    minus(num) {
        return num - 2
    }

    operateResult(res) {
        return res
    }
}

const setState = (fn) => {
    global.store = fn(global.store || {})
}
const fpl = transformClassToFunctionPipeline(Action, setState)

describe('Action.justFn', () => {
    it('works', () => {
        fpl.run(2)
        expect(global.store.operateResult).toBe(7)

    })
})
