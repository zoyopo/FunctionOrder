// import  EventEmitter from "EventEmitter"
// enum Tag {
//     next = 'next',
//     after = 'after'
// }

type FnGroups = Function[][]
type PromiseItem = { fn: Promise<any> }

class FunctionPipeline {

    constructor() {
        // this.em = new EventEmitter()
        console.log('FunctionPipeline is newing')
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
            console.log('this.fns,', this.fns)
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

    // public after(fn: Promise<any>) {
    //     // if(this.fns)
    //     if (!this.isPromise(fn)) {
    //         throw new Error('promise expected')
    //         return this
    //     }
    //     this.promises.push({fn: fn as Promise<any>, tag: Tag.after})
    //     return this
    // }

    // private isExistCommonFunction(fnsGroup: FnGroups) {
    //     return fnsGroup.length > 0
    // }

    // private isLastPromise(index: number) {
    //     return index === this.promises.length - 1
    // }

    private fnExcute(arr: Function[], promiseRes: any) {
       // console.log('arr', arr)
        arr.reduce((prev, curr, index) => {
            console.log('prev', prev)
            console.log('curr', curr)

            if (index === 0) {
                return curr(promiseRes)
            } else {
                if (this.isPromise(prev)) {
                    console.log('index + 1',index + 1)
                    const restFns = arr.slice(index, arr.length)
                    console.log('arr',arr)
                    console.log('restFns',restFns)
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
        if (this.fns.length && !this.fnsGroup.length) {
            this.fnsGroup[0] = this.fns
        }
        // console.log('this.promises', this.promises)
        // console.log('this.fnsGroup', this.fnsGroup)
        if (this.promises.length) {
            this.promises.forEach((item, index) => {
                item.fn.then((res: any) => {
                    console.log('this.fnsGroup.length', this.fnsGroup.length)
                    // this.isExistCommonFunction(this.fnsGroup) && this.fnExcute(this.fnsGroup[index], res)
                    index + 1 <= this.fnsGroup.length && this.fnExcute(this.fnsGroup[index], res)
                    // this.fnsGroup[index].reduce((prev, curr, i) => {
                    //     // console.log('prev',prev)
                    //     console.log('i', i)
                    //     console.log('prev', prev)
                    //     if (i === 0) {
                    //         return curr(res)
                    //     } else {
                    //         if (this.isPromise(prev)) {
                    //             //@ts-ignore
                    //             prev.then(prevRes => {
                    //
                    //             })
                    //         }
                    //         return curr(prev)
                    //     }
                    //     // return prev ? prev(res) :
                    // }, [])
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
