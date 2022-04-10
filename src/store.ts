// /**
//  * @title: index
//  * @projectName frontend-framework-simulation
//  * @description: TODO
//  * @author zhangyunpeng0126
//  * @date 2022/4/710:54
//  */
//
// type CreateStore = (reducer: Function, initialState: {}, enhancer?: Function) => { dispatch: Function, getState: GetState }
//
// type Action = (dispatch:Dispatch,getState:GetState) => void | {
//     type: string,
//     payload?: any
// }
// type GetState = () => object
//
// type Dispatch = (action: Action) => Action
//
// type TmiddleWareParams = { dispatch: Dispatch, getState: GetState }
//
// type TmiddleWare = (params: TmiddleWareParams) => object | void
//
// const compose = (...funcs:Function[]) => {
//     // if (funcs.length === 0) {
//     //     return arg => arg
//     // }
//     if (funcs && funcs.length === 1) {
//         return funcs[0]
//     }
//     return funcs.reduce((a, b) => (...args: []) => a(b(...args)))
// }
//
// const applyMiddleware = (middleWares: []) => {
//
//     return (createStore: CreateStore) => (reducer: Function, initialState: {}) => {
//         const store = createStore(reducer, initialState)
//         let dispatch = store.dispatch
//         const middleWaresAPI :TmiddleWareParams = {
//             dispatch: (action: {}) => dispatch(action),
//             getState: store.getState
//         }
//         const chains = middleWares.map((middleWare:TmiddleWare) => middleWare(middleWaresAPI))
//         dispatch = compose(...chains)(dispatch)
//         return {
//             ...store,
//             dispatch
//         }
//     }
//
// }
//
// const createStore: CreateStore = (reducer: Function, initialState: {}, enhancer: Function) => {
//     if (typeof enhancer === 'function') {
//         enhancer(createStore)(reducer, initialState)
//     }
//     let currentState = initialState
//     let currentReducer = reducer
//
//     const dispatch = (action: Action) => {
//         currentState = currentReducer(action)
//         return action
//     }
//     const getState = () => {
//         return currentState
//     }
//     return {
//         dispatch,
//         getState
//     }
// }
//
// const createThunkMiddleWare = () => {
//     return ({dispatch, getState}: TmiddleWareParams) => (next: Dispatch) => (action: Action) => {
//         if (typeof action === 'function') {
//             return action(dispatch, getState)
//         }
//         return next(action)
//     }
// }
