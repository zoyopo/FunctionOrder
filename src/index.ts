// import  EventEmitter from "EventEmitter"
class FunctionPipeline {

    constructor() {
        // this.em = new EventEmitter()
    }

    private fns: Function[] = []
    private fnsGroup: Function[][] = []
    private promises: Promise<any>[] = []
    private promisesCount = 0

    private isPromise(obj: any): boolean {
        return obj && obj instanceof Promise
    }

    public next(fn: Promise<any> | Function) {
        if (this.isPromise(fn)) {
            if (this.promises.length) {
                this.fnsGroup[this.promisesCount++] = this.fns
                this.fns = []
            }
            this.promises.push(fn as Promise<any>)
        } else {
            this.fns.push(fn as Function)
        }
        return this
    }

    public after(){

    }

    public run() {
        if(this.promises.length) {
            this.promises.forEach((item, index) => {
                item.then(res => {
                    this.fnsGroup[index].reduce((prev, curr) => prev ? curr(prev(res)) : curr(res))
                })
            })
        }else {
            this.fns.reduce((prev, curr) => prev ? curr(prev()) : curr())
        }
    }
}

export default FunctionPipeline
