/**
 * Queue Data Structure Implementation
 * Used for: Request queue management, AI rate limiting, event processing
 * Time Complexity: O(1) for enqueue/dequeue operations
 */

export class QueueNode<T> {
  public value: T;
  public next: QueueNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private length: number = 0;

  /**
   * Add element to the end of the queue
   */
  enqueue(value: T): void {
    const newNode = new QueueNode(value);
    
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
        this.tail = newNode;
      }
    }
    
    this.length++;
  }

  /**
   * Remove and return element from the front of the queue
   */
  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const value = this.head!.value;
    this.head = this.head!.next;
    
    if (this.head === null) {
      this.tail = null;
    }
    
    this.length--;
    return value;
  }

  /**
   * Get the front element without removing it
   */
  peek(): T | null {
    return this.head?.value ?? null;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Get the size of the queue
   */
  size(): number {
    return this.length;
  }

  /**
   * Clear all elements from the queue
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * Convert queue to array
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
   * Check if queue contains a specific value
   */
  contains(value: T): boolean {
    let current = this.head;
    
    while (current !== null) {
      if (current.value === value) {
        return true;
      }
      current = current.next;
    }
    
    return false;
  }
}

/**
 * Priority Queue Implementation
 * Used for: Request prioritization, urgent notifications
 */
export interface PriorityQueueItem<T> {
  value: T;
  priority: number;
}

export class PriorityQueue<T> {
  private items: PriorityQueueItem<T>[] = [];

  /**
   * Add element with priority (lower number = higher priority)
   */
  enqueue(value: T, priority: number): void {
    const newItem: PriorityQueueItem<T> = { value, priority };
    
    if (this.isEmpty()) {
      this.items.push(newItem);
      return;
    }

    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (newItem.priority < this.items[i].priority) {
        this.items.splice(i, 0, newItem);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(newItem);
    }
  }

  /**
   * Remove and return highest priority element
   */
  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift()!.value;
  }

  /**
   * Get highest priority element without removing
   */
  peek(): T | null {
    return this.items[0]?.value ?? null;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.items = [];
  }
}
