//@ts-ignore
import React, {useState, useEffect, useRef} from 'react'
import {
    transformClassToFunctionPipeline as createFunctionPipelineByClass, TObj, FunctionPipeline
} from 'function-order'


interface Type<T> extends Function {
    new(...args: any[]): T;
}

type IProps<T> = {
    action: Type<T>
}
type StateInfo<T> = {
    [props: string]: T
}
const useActionState = (props: IProps<TObj>) => {
    const [actionState, set] = useState<StateInfo<any>>({})
    let cachedFoIns = useRef<FunctionPipeline | null>(null)
    let foIns
    if (cachedFoIns.current) {
        foIns = cachedFoIns.current
    } else {
        foIns = createFunctionPipelineByClass(props.action, set)
        cachedFoIns.current = foIns
    }

    return {actionState, foIns}
}

export default useActionState
