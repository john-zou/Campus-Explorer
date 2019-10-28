
export class MagicQueue<T> {
    private data: T[];
    public left: number;
    public right: number; // unnecessary now but wait until this becomes a MagicDeque magically

    public constructor(initial: T[] = []) {
        this.data = [];
        this.left = 0;
        this.right = 0;
        for (const e of initial) {
            this.enqueue(e);
        }
    }

    public enqueue = (item: T): void => {
        if (this.left === 0 && this.right === 0) {
            this.data[0] = item;
            ++this.right;
        } else {
            this.data[this.right++] = item;
        }
    }

    public enqueueAll = (items: T[]): void => {
        for (const item of items)  {
            this.enqueue(item);
        }
    }

    public EnQ = (item: T): void => {
        this.enqueue(item);
    }

    public dequeue = (): T => {
        if (this.left === this.right) {
            return null;
        } else {
            return this.data[this.left++];
        }
    }

    public DQ = (): T => {
        return this.dequeue();
    }

    public StillHasStuff = (): boolean => {
        return !this.empty();
    }

    public size = (): number => {
        return this.right - this.left;
    }

    public empty = (): boolean => {
        return this.right === this.left;
    }
}
