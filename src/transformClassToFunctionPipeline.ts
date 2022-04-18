import fpl from "./FunctionPipeline";

interface Type<T> extends Function {
    new(...args: any[]): T;
}

type NormalObj = { [props: string]: any }
export type TObj = { [props: string]: any, getActionResult?: (res: any) => any }
type SetState = (values: NormalObj) => void

enum KeyMethods {
    getActionResult = "getActionResult",
    init = 'init'
}

export enum InitKeys {
    flatAsyncNames = "flatAsyncNames",
    saveResultNames = "saveResultNames"
}

export default function createFunctionPipelineByClass<T extends TObj>(cls: Type<T>, setState?: SetState) {
    const instance = new cls()
    let methodNames = Reflect.ownKeys(Object.getPrototypeOf(instance))
    methodNames = methodNames.filter(methodName => !['constructor', KeyMethods.init].includes(methodName as string))
    let fplInstance = new fpl()
    // if(!instance['init']){
    //     throw new Error('init method is required')
    // }
    let _flatAsyncNames: string[]
    let _saveResultNames: string[]
    if (instance[KeyMethods.init]) {
        const initResult = instance[KeyMethods.init]()
        _flatAsyncNames = initResult[InitKeys.flatAsyncNames]
        _saveResultNames = initResult[InitKeys.saveResultNames]
    }


    // if(!rootPromiseFnNames){
    //     throw new Error('please config  rootPromiseFnNames  in init method')
    // }
    methodNames.push(KeyMethods.getActionResult)
    instance.getActionResult = (res) => {
        return res
    }
    methodNames.forEach((methodName) => {
        if (_flatAsyncNames && _flatAsyncNames.includes(methodName as string)) {
            fplInstance = fplInstance.next({type: 'root', promise: instance[methodName as string]})
        } else {
            fplInstance = fplInstance.next((value: any) => {
                const val = instance[methodName as string](value)
                const isMethodNameNeedStore = (_saveResultNames && _saveResultNames.includes(methodName as string)) || (methodName === KeyMethods.getActionResult)
                //@ts-ignore
                if (isMethodNameNeedStore && setState) {
                    setState((prev: NormalObj) => ({...prev, [`${methodName as string}`]: val}))
                }
                return val
            })
        }
    })
    return fplInstance
}
