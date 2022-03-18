
type FnGroups = Function[][]
type PromiseItem = { fn: Promise<any> }

class FunctionPipeline {

    private fns: Function[] = []
    private fnsGroup: FnGroups = []
    private promises: PromiseItem[] = []
    private promisesCount = 0

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
            this.promises.push({fn: fn as Promise<any>})
        } else {
            this.fns.push(fn as Function)
        }
        return this
    }


    private fnExcute(arr: Function[], promiseRes: any) {
        arr.reduce((prev, curr, index) => {
            if (index === 0) {
                return curr(promiseRes)
            } else {
                if (this.isPromise(prev)) {
                    const restFns = arr.slice(index, arr.length)
                    arr = []
                    //@ts-ignore
                    prev.then(prevRes => {
                        this.fnExcute(restFns, prevRes)
                    })
                } else {
                    return curr(prev)
                }
            }

        }, [])
    }

    public run() {
        if (this.fns.length) {
            this.fnsGroup.push(this.fns)
        }
        if (this.promises.length) {
            this.promises.forEach((item, index) => {
                item.fn.then((res: any) => {
                    index + 1 <= this.fnsGroup.length && this.fnExcute(this.fnsGroup[index], res)

                })
            })
        } else {
            this.fns.reduce((prev, curr, index) => {
                if (index === 0) {
                    return curr()
                } else {
                    return curr(prev)
                }

            }, [])
        }
    }
}

export default FunctionPipeline
