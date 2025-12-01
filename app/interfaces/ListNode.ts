export default class ListNode<T> {
    data: T;
    next: ListNode<T> | null;

    constructor(data: T, next: ListNode<T> | null = null){
        this.data = data;
        this.next = next;
    }

    hasNext(): boolean {
        return (this.next != null);
    }
}