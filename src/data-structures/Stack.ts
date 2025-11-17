/**
 * Stack Data Structure Implementation
 * Used for: Navigation history, Undo/Redo operations, State management
 * Time Complexity: O(1) for push/pop operations
 */

export class StackNode<T> {
  public value: T;
  public next: StackNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class Stack<T> {
  private top: StackNode<T> | null = null;
  private length: number = 0;
  private maxSize: number | null = null;

  constructor(maxSize?: number) {
    this.maxSize = maxSize ?? null;
  }

  /**
   * Add element to the top of the stack
   */
  push(value: T): boolean {
    if (this.maxSize !== null && this.length >= this.maxSize) {
      return false; // Stack is full
    }

    const newNode = new StackNode(value);
    newNode.next = this.top;
    this.top = newNode;
    this.length++;
    return true;
  }

  /**
   * Remove and return element from the top
   */
  pop(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const value = this.top!.value;
    this.top = this.top!.next;
    this.length--;
    return value;
  }

  /**
   * Get the top element without removing it
   */
  peek(): T | null {
    return this.top?.value ?? null;
  }

  /**
   * Check if stack is empty
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Get the size of the stack
   */
  size(): number {
    return this.length;
  }

  /**
   * Check if stack is full (if max size is set)
   */
  isFull(): boolean {
    if (this.maxSize === null) {
      return false;
    }
    return this.length >= this.maxSize;
  }

  /**
   * Clear all elements from the stack
   */
  clear(): void {
    this.top = null;
    this.length = 0;
  }

  /**
   * Convert stack to array (top to bottom)
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.top;
    
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    
    return result;
  }

  /**
   * Search for a value in the stack
   */
  contains(value: T): boolean {
    let current = this.top;
    
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
 * UndoRedo Manager using two stacks
 * Used for: Form state management, reversible operations
 */
export class UndoRedoManager<T> {
  private undoStack: Stack<T>;
  private redoStack: Stack<T>;

  constructor(maxHistory: number = 50) {
    this.undoStack = new Stack<T>(maxHistory);
    this.redoStack = new Stack<T>(maxHistory);
  }

  /**
   * Execute a new action
   */
  execute(state: T): void {
    this.undoStack.push(state);
    this.redoStack.clear(); // Clear redo history on new action
  }

  /**
   * Undo the last action
   */
  undo(): T | null {
    const state = this.undoStack.pop();
    if (state !== null) {
      this.redoStack.push(state);
      return state;
    }
    return null;
  }

  /**
   * Redo the last undone action
   */
  redo(): T | null {
    const state = this.redoStack.pop();
    if (state !== null) {
      this.undoStack.push(state);
      return state;
    }
    return null;
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return !this.undoStack.isEmpty();
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return !this.redoStack.isEmpty();
  }

  /**
   * Get current state
   */
  getCurrentState(): T | null {
    return this.undoStack.peek();
  }

  /**
   * Clear history
   */
  clear(): void {
    this.undoStack.clear();
    this.redoStack.clear();
  }
}
