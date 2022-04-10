import fpl from "./FunctionPipeline";

interface Type<T> extends Function {
    new(...args: any[]): T;
}

type NormalObj = { [props: string]: any }
type SetState = (values: NormalObj) => void

export default function createFunctionPipelineByClass<T extends NormalObj>(cls: Type<T>, setState: SetState) {
    const instance = new cls()

    let methodNames = Reflect.ownKeys(Object.getPrototypeOf(instance))
    methodNames = methodNames.filter(methodName => !['constructor', 'init'].includes(methodName as string))
    let fplInstance = new fpl()
    // if(!instance['init']){
    //     throw new Error('init method is required')
    // }
    const {rootPromiseFnNames, stateStoredFnNames} = instance['init']()

    // if(!rootPromiseFnNames){
    //     throw new Error('please config  rootPromiseFnNames  in init method')
    // }
    methodNames.forEach((methodName) => {
        if (rootPromiseFnNames && rootPromiseFnNames.includes(methodName)) {
            fplInstance = fplInstance.next(instance[methodName as string](fplInstance.rootParams))
        } else {
            fplInstance = fplInstance.next((value: any) => {
                const val = instance[methodName as string](value)
                //@ts-ignore
                if (stateStoredFnNames && stateStoredFnNames.includes(methodName)) {
                    setState((prev: NormalObj) => ({...prev, [methodName]: val}))
                }
                return val
            })
        }
    })
    return fplInstance
}
