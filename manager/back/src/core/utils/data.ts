abstract class Collection<T> {
    public storage: T[] = [];

    size(): number {
        return this.storage.length;
    }

    abstract isFull(): boolean;

    isEmpty() {
        return this.size() === 0;
    }
}

interface IQueue<T> {
    enqueue(item: T): void;

    dequeue(): T;

    size(): number;
}

interface IStack<T> {
    push(item: T): void;

    pop(): T | undefined;

    peek(): T | undefined;

    size(): number;
}

export class Stack<T> extends Collection<T> implements IStack<T> {
    constructor(private capacity: number = 1e3) {
        super();
    }

    push(item: T) {
        if (this.isFull()) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        // In the derived class, we can access protected properties of the abstract class
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    // Implementation of the abstract method
    isFull(): boolean {
        return this.capacity === this.size();
    }
}

export class Queue<T> extends Collection<T> implements IQueue<T> {
    constructor(private capacity: number = 1e3) {
        super();
    }

    enqueue(item: T): void {
        if (this.isFull()) {
            throw Error("Queue has reached max capacity, you cannot add more items");
        }
        // In the derived class, we can access protected properties of the abstract class
        this.storage.push(item);
    }

    // @ts-ignore
    dequeue(): T | undefined {
        return this.storage.shift();
    }

    // Implementation of the abstract method
    isFull(): boolean {
        return this.capacity === this.size();
    }
}


let mutex = {
    locked: false
}

export interface Comparable<T> {
    equal(obj: T): boolean
}

export class CustomSet<T extends Comparable<T>> {
    private content: Array<T>

    constructor(private options?: { data?: Iterable<T>, lock?: boolean }) {
        this.content = new Array<T>(...(this.options?.data ?? []));
    }

    add(obj: T) {
        if (this.options?.lock) {
            mutex.locked = true;
            while (mutex.locked) {
            }
        }

        if (!this.contains(obj)) {
            this.content.push(obj)
        }

        if (this.options?.lock) {
            mutex.locked = false;
        }
    }

    contains(obj: T): boolean {
        if (this.options?.lock) {
            mutex.locked = true;
            while (mutex.locked) {
            }
        }

        const found = this.content.find(x => x.equal(obj)) !== undefined;

        if (this.options?.lock) {
            mutex.locked = false;
        }

        return found;
    }

    toArray() {
        return [...this.content]
    }

    remove(obj: T) {
        if (this.options?.lock) {
            mutex.locked = true;
            while (mutex.locked) {
            }
        }

        this.content = this.content.filter(f => f.equal(obj));

        if (this.options?.lock) {
            mutex.locked = false;
        }
    }


}
