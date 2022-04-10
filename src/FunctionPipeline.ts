type FnGroups = Function[][]
type PromiseItem = { promise: Promise<any>, type?: string }

class FunctionPipeline {
    private results: any[] = []
    private fns: Function[] = []
    private fnsGroup: FnGroups = []
    private promises: PromiseItem[] = []
    private promisesCount = 0
    // @ts-ignore
    public rootParams: {} = {}

    private isPromise(obj: any): boolean {
        return obj && obj instanceof Promise
    }


    public next(fn: Promise<any> | Function) {
        if (this.isPromise(fn)) {
            // console.log('this.fns,', this.fns)
            if (this.promises.length && this.fns.length) {
                this.fnsGroup[this.promisesCount++] = this.fns
                this.fns = []
            }
            this.promises.push({promise: fn as Promise<any>})
        } else {
            this.fns.push(fn as Function)
        }
        return this
    }


    private fnExecute(arr: Function[], promiseRes: any) {

        return arr.reduce((prev, curr, index) => {
            if (!arr.length) {
                return
            }
            if (index === 0) {
                //console.log('promiseRes',promiseRes)
                return curr(promiseRes)
            } else {
                if (this.isPromise(prev)) {
                    const restFns = arr.slice(index, arr.length)
                    arr = []
                    //@ts-ignore
                    prev.then(prevRes => {
                        this.fnExecute(restFns, prevRes)
                    })
                } else if (Array.isArray(prev) && prev.every(item => this.isPromise(item))) {
                    //  console.log('Array.isArray(prev) && prev.every(item => this.isPromise(item))')
                    const restFns = arr.slice(index, arr.length)
                    arr = []
                    //@ts-ignore
                    Promise.all(prev).then(prevRes => {
                        this.fnExecute(restFns, prevRes)
                    })
                } else {
                    return curr(prev)
                }
            }

        }, [])
    }

    public run(params: any) {

        this.rootParams = params
        if (this.fns.length) {
            // const isFirstFnResultPromise = this.isPromise(this.fns[0]())
            // if (isFirstFnResultPromise) {
            //     this.promises.unshift({promise: this.fns[0](params)})
            //     this.fns = this.fns.slice(1)
            // }
            this.fnsGroup.push(this.fns)
        }

        if (this.promises.length) {
            Promise.all(this.promises.map(promiseItem => promiseItem.promise)).then((resArray: any[]) => {
                for (let index in resArray) {
                    const res = resArray[index]

                    if (Number(index) + 1 <= this.fnsGroup.length) {

                        this.results[index] = this.fnExecute(this.fnsGroup[index], res)
                    } else {
                        this.results[index] = res
                    }
                }
            })
        } else {
            this.fnExecute(this.fns, this.rootParams)
            // cb(result)
        }
    }
}

export default FunctionPipeline
