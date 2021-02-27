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

    dequeue(): T | undefined {
        return this.storage.shift();
    }

    // Implementation of the abstract method
    isFull(): boolean {
        return this.capacity === this.size();
    }
}
