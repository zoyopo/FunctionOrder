import fpl from "./FunctionPipeline";

interface Type<T> extends Function {
    new(...args: any[]): T;
}

export default function transformClassToFunctionPipeline<T extends { [props: string]: any }>(value: Type<T>) {
    const instance = new value()
    let methodNames = Reflect.ownKeys(Object.getPrototypeOf(instance))
    methodNames = methodNames.filter(item => item !== 'constructor')
    let fplInstance = new fpl()
    methodNames.forEach((item) => {
        fplInstance = fplInstance.next(instance[item as string])
    })
    return fplInstance
}
