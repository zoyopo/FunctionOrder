//@ts-ignore
import React, {useState, useEffect} from 'react'
import createFunctionPipelineByClass, {TObj} from "./transformClassToFunctionPipeline";

interface Type<T> extends Function {
    new(...args: any[]): T;
}

type IProps<T> = {
    action: Type<T>
}
const useActionState = (props: IProps<TObj>) => {
    const [actionState, set] = useState({})
    const fplIns = createFunctionPipelineByClass(props.action, set)

    return {actionState, fplIns}
}

export default useActionState
