// @flow

class Node<T> {
  elem: T;
  next: ?Node<T>;

  constructor(elem: T) {
    this.elem = elem;
    this.next = null;
  }

  put(elem: T) {
    if (this.next === null || this.next === undefined)
      this.next = new Node(elem);
    else this.next.put(elem);
  }
}

export default class LinkedQueue<T> {
  head: ?Node<T>;
  count: number;
  typeT: T;

  constructor(typeT: T) {
    this.typeT = typeT;
    this.head = null;
    this.count = 0;
  }

  put(elem: T): void {
    if (this.head !== null && this.head !== undefined) this.head.put(elem);
    else this.head = new Node(elem);
    this.count += 1;
  }

  pop(): T {
    if (this.head === null || this.head === undefined)
      throw new Error('Tried to pop from empty queue!');
    const { elem } = this.head;
    this.head = this.head.next;
    this.count -= 1;
    return elem;
  }

  size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.head === null;
  }
}
