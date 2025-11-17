/**
 * Tree Data Structures Implementation
 * Used for: Role-based menu navigation, category hierarchies, decision trees
 * Time Complexity: O(log n) for balanced trees, O(n) for search in general tree
 */

/**
 * Generic Tree Node
 */
export class TreeNode<T> {
  public value: T;
  public children: TreeNode<T>[] = [];
  public parent: TreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }

  /**
   * Add child node
   */
  addChild(child: TreeNode<T>): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Remove child node
   */
  removeChild(child: TreeNode<T>): boolean {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
      return true;
    }
    return false;
  }

  /**
   * Check if node is leaf
   */
  isLeaf(): boolean {
    return this.children.length === 0;
  }

  /**
   * Check if node is root
   */
  isRoot(): boolean {
    return this.parent === null;
  }

  /**
   * Get depth of node
   */
  getDepth(): number {
    let depth = 0;
    let current: TreeNode<T> | null = this;

    while (current.parent !== null) {
      depth++;
      current = current.parent;
    }

    return depth;
  }
}

/**
 * Generic Tree
 * Used for hierarchical data structures
 */
export class Tree<T> {
  public root: TreeNode<T> | null = null;

  constructor(rootValue?: T) {
    if (rootValue !== undefined) {
      this.root = new TreeNode(rootValue);
    }
  }

  /**
   * Traverse tree using Depth-First Search (Pre-order)
   */
  traverseDFS(callback: (node: TreeNode<T>) => void): void {
    if (this.root === null) {
      return;
    }

    const traverse = (node: TreeNode<T>): void => {
      callback(node);
      node.children.forEach((child) => traverse(child));
    };

    traverse(this.root);
  }

  /**
   * Traverse tree using Breadth-First Search
   */
  traverseBFS(callback: (node: TreeNode<T>) => void): void {
    if (this.root === null) {
      return;
    }

    const queue: TreeNode<T>[] = [this.root];

    while (queue.length > 0) {
      const node = queue.shift()!;
      callback(node);
      queue.push(...node.children);
    }
  }

  /**
   * Find node by value
   */
  find(value: T): TreeNode<T> | null {
    if (this.root === null) {
      return null;
    }

    let result: TreeNode<T> | null = null;

    this.traverseDFS((node) => {
      if (node.value === value && result === null) {
        result = node;
      }
    });

    return result;
  }

  /**
   * Find node by predicate function
   */
  findBy(predicate: (value: T) => boolean): TreeNode<T> | null {
    if (this.root === null) {
      return null;
    }

    let result: TreeNode<T> | null = null;

    this.traverseDFS((node) => {
      if (predicate(node.value) && result === null) {
        result = node;
      }
    });

    return result;
  }

  /**
   * Get all leaf nodes
   */
  getLeaves(): TreeNode<T>[] {
    const leaves: TreeNode<T>[] = [];

    this.traverseDFS((node) => {
      if (node.isLeaf()) {
        leaves.push(node);
      }
    });

    return leaves;
  }

  /**
   * Get height of tree
   */
  getHeight(): number {
    if (this.root === null) {
      return 0;
    }

    const calculateHeight = (node: TreeNode<T>): number => {
      if (node.isLeaf()) {
        return 1;
      }

      let maxHeight = 0;
      node.children.forEach((child) => {
        const childHeight = calculateHeight(child);
        maxHeight = Math.max(maxHeight, childHeight);
      });

      return maxHeight + 1;
    };

    return calculateHeight(this.root);
  }

  /**
   * Get total number of nodes
   */
  size(): number {
    let count = 0;
    this.traverseDFS(() => count++);
    return count;
  }

  /**
   * Convert tree to array (BFS order)
   */
  toArray(): T[] {
    const result: T[] = [];
    this.traverseBFS((node) => result.push(node.value));
    return result;
  }
}

/**
 * Binary Tree Node
 */
export class BinaryTreeNode<T> {
  public value: T;
  public left: BinaryTreeNode<T> | null = null;
  public right: BinaryTreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Binary Search Tree
 * Used for: Efficient searching and sorting
 * Time Complexity: O(log n) average, O(n) worst case
 */
export class BinarySearchTree<T> {
  public root: BinaryTreeNode<T> | null = null;
  private compareFn: (a: T, b: T) => number;

  constructor(compareFn?: (a: T, b: T) => number) {
    this.compareFn = compareFn || ((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }

  /**
   * Insert value into BST
   */
  insert(value: T): void {
    const newNode = new BinaryTreeNode(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    const insertNode = (node: BinaryTreeNode<T>, newNode: BinaryTreeNode<T>): void => {
      if (this.compareFn(newNode.value, node.value) < 0) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    };

    insertNode(this.root, newNode);
  }

  /**
   * Search for value in BST
   */
  search(value: T): boolean {
    const searchNode = (node: BinaryTreeNode<T> | null, value: T): boolean => {
      if (node === null) {
        return false;
      }

      const comparison = this.compareFn(value, node.value);

      if (comparison === 0) {
        return true;
      } else if (comparison < 0) {
        return searchNode(node.left, value);
      } else {
        return searchNode(node.right, value);
      }
    };

    return searchNode(this.root, value);
  }

  /**
   * Find minimum value
   */
  findMin(): T | null {
    if (this.root === null) {
      return null;
    }

    let current = this.root;
    while (current.left !== null) {
      current = current.left;
    }

    return current.value;
  }

  /**
   * Find maximum value
   */
  findMax(): T | null {
    if (this.root === null) {
      return null;
    }

    let current = this.root;
    while (current.right !== null) {
      current = current.right;
    }

    return current.value;
  }

  /**
   * In-order traversal (sorted order)
   */
  inOrder(callback: (value: T) => void): void {
    const traverse = (node: BinaryTreeNode<T> | null): void => {
      if (node !== null) {
        traverse(node.left);
        callback(node.value);
        traverse(node.right);
      }
    };

    traverse(this.root);
  }

  /**
   * Pre-order traversal
   */
  preOrder(callback: (value: T) => void): void {
    const traverse = (node: BinaryTreeNode<T> | null): void => {
      if (node !== null) {
        callback(node.value);
        traverse(node.left);
        traverse(node.right);
      }
    };

    traverse(this.root);
  }

  /**
   * Post-order traversal
   */
  postOrder(callback: (value: T) => void): void {
    const traverse = (node: BinaryTreeNode<T> | null): void => {
      if (node !== null) {
        traverse(node.left);
        traverse(node.right);
        callback(node.value);
      }
    };

    traverse(this.root);
  }

  /**
   * Convert to sorted array
   */
  toSortedArray(): T[] {
    const result: T[] = [];
    this.inOrder((value) => result.push(value));
    return result;
  }

  /**
   * Get tree size
   */
  size(): number {
    let count = 0;
    this.inOrder(() => count++);
    return count;
  }
}

/**
 * Menu Tree Structure for Role-Based Navigation
 * Specialized tree for menu items with permissions
 */
export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  roles: string[];
  children?: MenuItem[];
}

export class MenuTree {
  private tree: Tree<MenuItem>;

  constructor(rootMenuItem: MenuItem) {
    this.tree = new Tree<MenuItem>(rootMenuItem);
  }

  /**
   * Add menu item as child of parent
   */
  addMenuItem(parentId: string, menuItem: MenuItem): boolean {
    const parentNode = this.tree.findBy((item) => item.id === parentId);

    if (parentNode) {
      const newNode = new TreeNode(menuItem);
      parentNode.addChild(newNode);
      return true;
    }

    return false;
  }

  /**
   * Get filtered menu for specific role
   */
  getMenuForRole(role: string): MenuItem[] {
    const result: MenuItem[] = [];

    if (this.tree.root === null) {
      return result;
    }

    const filterByRole = (node: TreeNode<MenuItem>): MenuItem | null => {
      if (!node.value.roles.includes(role)) {
        return null;
      }

      const filteredItem: MenuItem = {
        ...node.value,
        children: [],
      };

      node.children.forEach((child) => {
        const filteredChild = filterByRole(child);
        if (filteredChild) {
          filteredItem.children!.push(filteredChild);
        }
      });

      return filteredItem;
    };

    const rootMenu = filterByRole(this.tree.root);
    if (rootMenu) {
      return rootMenu.children || [];
    }

    return result;
  }

  /**
   * Find menu item by path
   */
  findByPath(path: string): MenuItem | null {
    const node = this.tree.findBy((item) => item.path === path);
    return node?.value ?? null;
  }
}
