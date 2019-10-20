
export class MagicQueue<T> {
    private data: T[] = [];
    public left: number = 0;
    public right: number = 0;

    public enqueue = (item: T): void => {
        if (this.left === 0 && this.right === 0) {
            this.data[0] = item;
            ++this.right;
        } else {
            this.data[this.right++] = item;
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
