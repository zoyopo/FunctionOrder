const {transformClassToFunctionPipeline} = require('../dist/index')

class Action {
    init() {
        return {
            stateStoredFnNames: ['promiseDependentOperate'],
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

    promiseDependentOperate(res) {
        return res
    }
}


const setState = (fn) => {
    global.store = fn(global.store || {})
}
const fpl = transformClassToFunctionPipeline(Action, setState)

describe('Action.promise dependent', () => {
    it('works', done => {
        fpl.run('suzuki')
        setTimeout(() => {
            expect(global.store.promiseDependentOperate).toBe('180kg')
            done()
        }, 1000)

    })
})
