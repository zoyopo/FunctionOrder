//@ts-ignore
import React, {useState} from 'react'
import createFunctionPipelineByClass from "./transformClassToFunctionPipeline";

interface Type<T> extends Function {
    new(...args: any[]): T;
}

type IProps<T> = {
    action: Type<T>
}
const useActionState = (props: IProps<{ [props: string]: any }>) => {
    const [actionState, set] = useState({})
    const fplIns = createFunctionPipelineByClass(props.action, set)
    return {actionState, fplIns}
}

export default useActionState
