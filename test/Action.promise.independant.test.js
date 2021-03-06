const {transformClassToFunctionPipeline,InitKeys} = require('../dist/index')

class PromiseIndependentAction {
    init() {
        return {
            [InitKeys.saveResultNames]: ['storeMotoName', 'storeLocation'],
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
    global.store = fn(global.store || {})
}
const fpl = transformClassToFunctionPipeline(PromiseIndependentAction, setState)

describe('Action.promise independent', () => {
    it('works', done => {
        fpl.run('suzuki')
        setTimeout(() => {
            expect(global.store["storeMotoName"]).toBe('gsx250r')
            expect(global.store["getActionResult"]).toBe('Japan')
            done()
        }, 1000)
    })
})
