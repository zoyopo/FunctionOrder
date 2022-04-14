type FnGroups = Function[][]
type RootPromise = (value?: any) => Promise<any>
type PromiseItem = { promise: RootPromise | Promise<any>, type?: string }

class FunctionPipeline {
    private results: any[] = []
    private fns: Function[] = []
    private fnsGroup: FnGroups = []
    private promises: PromiseItem[] = []
    private promisesCount = 0

    private isPromise(obj: any): boolean {
        return obj && obj instanceof Promise
    }

    private isObject(obj: PromiseItem): boolean {
        return obj && Object.prototype.toString.call(obj) === '[object Object]' && Boolean(obj.promise)
    }

    public next(fn: Promise<any> | Function | PromiseItem) {
        if (this.isPromise(fn) || this.isObject(fn as PromiseItem)) {
            if (this.promises.length && this.fns.length) {
                this.fnsGroup[this.promisesCount++] = this.fns
                this.fns = []
            }
            this.promises.push(this.isPromise(fn) ? {promise: fn as Promise<any>} : fn as PromiseItem)
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

    public run(params?: any) {
        if (this.fns.length) {
            this.fnsGroup.push(this.fns)
        }
        this.promises = this.promises.map(item => ({promise: item.type === 'root' ? (item.promise as RootPromise)(params) : item.promise}))
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
            this.fnExecute(this.fns, params)
            // cb(result)
        }
    }
}

export default FunctionPipeline
