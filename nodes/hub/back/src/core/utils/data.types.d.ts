export interface ICollection<T> {
	storage: T[];

	size(): number;
}


export interface IQueue<T> extends ICollection<T> {
	storage: T[];

	enqueue(item: T): void;

	dequeue(): T | undefined;

	size(): number;

	isEmpty(): boolean;
}

export interface IStack<T> extends ICollection<T> {
	push(item: T): void;

	pop(): T | undefined;

	peek(): T | undefined;

	size(): number;
}

export interface Comparable<T> {
	equal(obj: T): boolean;
}
