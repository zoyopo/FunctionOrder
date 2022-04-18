const {transformClassToFunctionPipeline,InitKeys} = require('../dist/index')

class ActionJustFn {
    init() {
        return {
            [InitKeys.saveResultNames]: ['operateResult']
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

}

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
const fplOfFnReturnPromiseAction = transformClassToFunctionPipeline(FnReturnPromiseAction, setState)
describe('Action.justFn', () => {
    it('pure fn', () => {
        fpl.run(2)
        expect(globalThis.store["getActionResult"]).toBe(7)
    })
    it('fn with fn return promise', done => {
        fplOfFnReturnPromiseAction.run(2)
        setTimeout(() => {
            expect(globalThis.store["getActionResult"]).toBe(7)
            done()
        }, 500)

    })
})
