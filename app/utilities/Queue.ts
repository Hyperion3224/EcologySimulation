export class Queue<T> {
    private readonly list = new Set<T>()

    constructor(){}

    hasNext(): boolean{
        return this.list.size > 0
    }

    next(): T | null {
        if(this.hasNext()){
            const ret = ([...this.list.values()][0])
            !this.list.delete(ret) ? 
                () => {throw new Error("queue failed to delete :" + ret)} : null;
            return ret;
        }
        return null;
    }

    push(obj: T): void{
        this.list.add(obj);
    } 
}