/**
 * Linked List Data Structures Implementation
 * Used for: Efficient list rendering, marketplace navigation, circular banners
 * Time Complexity: O(1) for insertions/deletions at known positions
 */

/**
 * Singly Linked List Node
 */
export class ListNode<T> {
  public value: T;
  public next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Singly Linked List
 */
export class LinkedList<T> {
  protected head: ListNode<T> | null = null;
  protected tail: ListNode<T> | null = null;
  protected length: number = 0;

  /**
   * Add element to the end of the list
   */
  append(value: T): void {
    const newNode = new ListNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  /**
   * Add element to the beginning of the list
   */
  prepend(value: T): void {
    const newNode = new ListNode(value);
    
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.length++;
  }

  /**
   * Insert element at specific index
   */
  insertAt(index: number, value: T): boolean {
    if (index < 0 || index > this.length) {
      return false;
    }

    if (index === 0) {
      this.prepend(value);
      return true;
    }

    if (index === this.length) {
      this.append(value);
      return true;
    }

    const newNode = new ListNode(value);
    const prev = this.getNodeAt(index - 1);

    if (prev) {
      newNode.next = prev.next;
      prev.next = newNode;
      this.length++;
      return true;
    }

    return false;
  }

  /**
   * Remove first occurrence of value
   */
  remove(value: T): boolean {
    if (this.isEmpty()) {
      return false;
    }

    if (this.head!.value === value) {
      this.head = this.head!.next;
      if (this.head === null) {
        this.tail = null;
      }
      this.length--;
      return true;
    }

    let current = this.head;
    while (current?.next !== null) {
      if (current?.next?.value === value) {
        current.next = current.next.next;
        if (current.next === null) {
          this.tail = current;
        }
        this.length--;
        return true;
      }
      current = current?.next ?? null;
    }

    return false;
  }

  /**
   * Remove element at specific index
   */
  removeAt(index: number): T | null {
    if (index < 0 || index >= this.length) {
      return null;
    }

    if (index === 0) {
      const value = this.head!.value;
      this.head = this.head!.next;
      if (this.head === null) {
        this.tail = null;
      }
      this.length--;
      return value;
    }

    const prev = this.getNodeAt(index - 1);
    if (prev && prev.next) {
      const value = prev.next.value;
      prev.next = prev.next.next;
      if (prev.next === null) {
        this.tail = prev;
      }
      this.length--;
      return value;
    }

    return null;
  }

  /**
   * Get element at specific index
   */
  get(index: number): T | null {
    const node = this.getNodeAt(index);
    return node?.value ?? null;
  }

  /**
   * Get node at specific index
   */
  protected getNodeAt(index: number): ListNode<T> | null {
    if (index < 0 || index >= this.length) {
      return null;
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    return current;
  }

  /**
   * Find index of first occurrence of value
   */
  indexOf(value: T): number {
    let current = this.head;
    let index = 0;

    while (current !== null) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  /**
   * Check if list contains value
   */
  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * Check if list is empty
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Get size of list
   */
  size(): number {
    return this.length;
  }

  /**
   * Clear all elements
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * Convert to array
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  /**
   * Reverse the list
   */
  reverse(): void {
    if (this.length <= 1) {
      return;
    }

    let prev = null;
    let current = this.head;
    this.tail = this.head;

    while (current !== null) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;
  }
}

/**
 * Doubly Linked List Node
 */
export class DoublyListNode<T> {
  public value: T;
  public next: DoublyListNode<T> | null = null;
  public prev: DoublyListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Doubly Linked List
 * Better for bidirectional navigation
 */
export class DoublyLinkedList<T> {
  private head: DoublyListNode<T> | null = null;
  private tail: DoublyListNode<T> | null = null;
  private length: number = 0;

  /**
   * Add element to the end
   */
  append(value: T): void {
    const newNode = new DoublyListNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  /**
   * Add element to the beginning
   */
  prepend(value: T): void {
    const newNode = new DoublyListNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.head = newNode;
    }

    this.length++;
  }

  /**
   * Remove first element
   */
  removeFirst(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const value = this.head!.value;
    this.head = this.head!.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    this.length--;
    return value;
  }

  /**
   * Remove last element
   */
  removeLast(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const value = this.tail!.value;
    this.tail = this.tail!.prev;

    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }

    this.length--;
    return value;
  }

  /**
   * Get element at index
   */
  get(index: number): T | null {
    const node = this.getNodeAt(index);
    return node?.value ?? null;
  }

  /**
   * Get node at index (optimized for doubly linked list)
   */
  private getNodeAt(index: number): DoublyListNode<T> | null {
    if (index < 0 || index >= this.length) {
      return null;
    }

    let current: DoublyListNode<T> | null;

    // Optimize by starting from the closer end
    if (index < this.length / 2) {
      current = this.head;
      for (let i = 0; i < index; i++) {
        current = current!.next;
      }
    } else {
      current = this.tail;
      for (let i = this.length - 1; i > index; i--) {
        current = current!.prev;
      }
    }

    return current;
  }

  /**
   * Check if empty
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Get size
   */
  size(): number {
    return this.length;
  }

  /**
   * Clear list
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * Convert to array
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }
}

/**
 * Circular Linked List
 * Used for: Rotating banners, carousel implementations
 */
export class CircularLinkedList<T> extends LinkedList<T> {
  /**
   * Override append to make it circular
   */
  append(value: T): void {
    super.append(value);
    if (this.tail) {
      this.tail.next = this.head;
    }
  }

  /**
   * Override prepend to maintain circular structure
   */
  prepend(value: T): void {
    super.prepend(value);
    if (this.tail) {
      this.tail.next = this.head;
    }
  }

  /**
   * Get next element in circular manner
   */
  getNext(current: T): T | null {
    const index = this.indexOf(current);
    if (index === -1) {
      return null;
    }

    const nextIndex = (index + 1) % this.size();
    return this.get(nextIndex);
  }

  /**
   * Get previous element in circular manner
   */
  getPrev(current: T): T | null {
    const index = this.indexOf(current);
    if (index === -1) {
      return null;
    }

    const prevIndex = index === 0 ? this.size() - 1 : index - 1;
    return this.get(prevIndex);
  }
}
