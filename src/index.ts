// import  EventEmitter from "EventEmitter"
enum Tag {
    next = 'next',
    after = 'after'
}

type FnGroups = Function[][]
type PromiseItem = { fn: Promise<any>, tag: string }

class FunctionPipeline {

    constructor() {
        // this.em = new EventEmitter()
    }

    private fns: Function[] = []
    private fnsGroup: FnGroups = []
    private promises: PromiseItem[] = []
    private promisesCount = 0

    private isPromise(obj: any): boolean {
        return obj && obj instanceof Promise
    }

    public next(fn: Promise<any> | Function) {
        if (this.isPromise(fn)) {
            if (this.promises.length && this.fns.length) {
                this.fnsGroup[this.promisesCount++] = this.fns
                this.fns = []
            }
            this.promises.push({fn: fn as Promise<any>, tag: Tag.next})
        } else {
            this.fns.push(fn as Function)
        }
        return this
    }

    // public after(fn: Promise<any>) {
    //     // if(this.fns)
    //     if (!this.isPromise(fn)) {
    //         throw new Error('promise expected')
    //         return this
    //     }
    //     this.promises.push({fn: fn as Promise<any>, tag: Tag.after})
    //     return this
    // }

    private isExistCommonFunction(fnsGroup: FnGroups) {
        return fnsGroup.length > 0
    }

    private isLastPromise(index: number) {
        return index === this.promises.length - 1
    }

    private fnExcute(arr: Function[], promiseRes: any) {
        arr.reduce((prev, curr, index) => {
            if (prev && this.isPromise(prev)) {
                prev.then((prevRes: any) => {
                    // curr(prevRes)
                    if (index + 1 < arr.length) {
                        this.fnExcute(arr.slice(index + 1, arr.length), promiseRes)
                    } else {
                        curr(prevRes)
                    }
                })
            } else {
                return prev ? curr(prev) : curr(promiseRes)
            }
        })
    }

    public run() {
        if (this.promises.length) {
            this.promises.forEach((item, index) => {
                if (item.tag === Tag.next) {
                    item.fn.then(res => {
                        if (!this.isLastPromise(index) && this.promises[index + 1].tag === Tag.after) {

                        }
                        this.isExistCommonFunction(this.fnsGroup) && this.fnExcute(this.fnsGroup[index])


                    })
                }
            })
        } else {
            this.fns.reduce((prev, curr) => prev ? curr(prev()) : curr())
        }
    }
}

export default FunctionPipeline
