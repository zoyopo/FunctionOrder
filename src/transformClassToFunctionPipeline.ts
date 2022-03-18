import fpl from "./FunctionPipeline";

interface Type<T> extends Function {
    new(...args: any[]): T;
}

export default function createFunctionPipelineByClass<T extends { [props: string]: any }>(cls: Type<T>) {
    const instance = new cls()
    let methodNames = Reflect.ownKeys(Object.getPrototypeOf(instance))
    methodNames = methodNames.filter(item => item !== 'constructor')
    let fplInstance = new fpl()
    methodNames.forEach((item) => {
        fplInstance = fplInstance.lineTo(instance[item as string])
    })
    return fplInstance
}
