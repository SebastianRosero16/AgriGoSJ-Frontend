/**
 * Graph Data Structure Implementation
 * Used for: Price comparison visualization, relationship mapping, distribution flow
 * Time Complexity: BFS/DFS O(V + E) where V = vertices, E = edges
 */

/**
 * Graph Edge
 */
export interface GraphEdge<T> {
  from: T;
  to: T;
  weight?: number;
}

/**
 * Graph Vertex with metadata
 */
export interface Vertex<T> {
  value: T;
  metadata?: Record<string, any>;
}

/**
 * Graph implementation using adjacency list
 * Supports both directed and undirected graphs
 */
export class Graph<T> {
  private adjacencyList: Map<T, Set<T>> = new Map();
  private edgeWeights: Map<string, number> = new Map();
  private directed: boolean;

  constructor(directed: boolean = false) {
    this.directed = directed;
  }

  /**
   * Add vertex to graph
   */
  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, new Set());
    }
  }

  /**
   * Add edge between vertices
   */
  addEdge(from: T, to: T, weight: number = 1): void {
    this.addVertex(from);
    this.addVertex(to);

    this.adjacencyList.get(from)!.add(to);
    this.edgeWeights.set(this.getEdgeKey(from, to), weight);

    if (!this.directed) {
      this.adjacencyList.get(to)!.add(from);
      this.edgeWeights.set(this.getEdgeKey(to, from), weight);
    }
  }

  /**
   * Remove vertex and all its edges
   */
  removeVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      return;
    }

    // Remove edges to this vertex
    this.adjacencyList.forEach((neighbors, v) => {
      neighbors.delete(vertex);
      this.edgeWeights.delete(this.getEdgeKey(v, vertex));
      this.edgeWeights.delete(this.getEdgeKey(vertex, v));
    });

    // Remove vertex
    this.adjacencyList.delete(vertex);
  }

  /**
   * Remove edge between vertices
   */
  removeEdge(from: T, to: T): void {
    if (this.adjacencyList.has(from)) {
      this.adjacencyList.get(from)!.delete(to);
      this.edgeWeights.delete(this.getEdgeKey(from, to));
    }

    if (!this.directed && this.adjacencyList.has(to)) {
      this.adjacencyList.get(to)!.delete(from);
      this.edgeWeights.delete(this.getEdgeKey(to, from));
    }
  }

  /**
   * Get neighbors of a vertex
   */
  getNeighbors(vertex: T): T[] {
    return Array.from(this.adjacencyList.get(vertex) || []);
  }

  /**
   * Get edge weight
   */
  getEdgeWeight(from: T, to: T): number | null {
    return this.edgeWeights.get(this.getEdgeKey(from, to)) ?? null;
  }

  /**
   * Check if edge exists
   */
  hasEdge(from: T, to: T): boolean {
    return this.adjacencyList.get(from)?.has(to) ?? false;
  }

  /**
   * Get all vertices
   */
  getVertices(): T[] {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Get all edges
   */
  getEdges(): GraphEdge<T>[] {
    const edges: GraphEdge<T>[] = [];

    this.adjacencyList.forEach((neighbors, from) => {
      neighbors.forEach((to) => {
        const weight = this.getEdgeWeight(from, to);
        edges.push({
          from,
          to,
          weight: weight ?? undefined,
        });
      });
    });

    return edges;
  }

  /**
   * Breadth-First Search traversal
   */
  bfs(start: T, callback: (vertex: T, depth: number) => void): void {
    if (!this.adjacencyList.has(start)) {
      return;
    }

    const visited = new Set<T>();
    const queue: Array<{ vertex: T; depth: number }> = [{ vertex: start, depth: 0 }];

    while (queue.length > 0) {
      const { vertex, depth } = queue.shift()!;

      if (visited.has(vertex)) {
        continue;
      }

      visited.add(vertex);
      callback(vertex, depth);

      const neighbors = this.getNeighbors(vertex);
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          queue.push({ vertex: neighbor, depth: depth + 1 });
        }
      });
    }
  }

  /**
   * Depth-First Search traversal
   */
  dfs(start: T, callback: (vertex: T, depth: number) => void): void {
    if (!this.adjacencyList.has(start)) {
      return;
    }

    const visited = new Set<T>();

    const traverse = (vertex: T, depth: number): void => {
      if (visited.has(vertex)) {
        return;
      }

      visited.add(vertex);
      callback(vertex, depth);

      const neighbors = this.getNeighbors(vertex);
      neighbors.forEach((neighbor) => {
        traverse(neighbor, depth + 1);
      });
    };

    traverse(start, 0);
  }

  /**
   * Find shortest path using BFS (unweighted)
   */
  findShortestPath(start: T, end: T): T[] | null {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
      return null;
    }

    const visited = new Set<T>();
    const queue: Array<{ vertex: T; path: T[] }> = [{ vertex: start, path: [start] }];

    while (queue.length > 0) {
      const { vertex, path } = queue.shift()!;

      if (vertex === end) {
        return path;
      }

      if (visited.has(vertex)) {
        continue;
      }

      visited.add(vertex);

      const neighbors = this.getNeighbors(vertex);
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          queue.push({ vertex: neighbor, path: [...path, neighbor] });
        }
      });
    }

    return null;
  }

  /**
   * Find all paths between two vertices
   */
  findAllPaths(start: T, end: T, maxDepth: number = 10): T[][] {
    const paths: T[][] = [];

    const traverse = (current: T, target: T, visited: Set<T>, path: T[], depth: number): void => {
      if (depth > maxDepth) {
        return;
      }

      if (current === target) {
        paths.push([...path]);
        return;
      }

      visited.add(current);

      const neighbors = this.getNeighbors(current);
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          path.push(neighbor);
          traverse(neighbor, target, visited, path, depth + 1);
          path.pop();
        }
      });

      visited.delete(current);
    };

    traverse(start, end, new Set(), [start], 0);
    return paths;
  }

  /**
   * Check if graph has cycle (for directed graphs)
   */
  hasCycle(): boolean {
    const visited = new Set<T>();
    const recStack = new Set<T>();

    const hasCycleUtil = (vertex: T): boolean => {
      visited.add(vertex);
      recStack.add(vertex);

      const neighbors = this.getNeighbors(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycleUtil(neighbor)) {
            return true;
          }
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }

      recStack.delete(vertex);
      return false;
    };

    for (const vertex of this.getVertices()) {
      if (!visited.has(vertex)) {
        if (hasCycleUtil(vertex)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get connected components (for undirected graphs)
   */
  getConnectedComponents(): T[][] {
    const visited = new Set<T>();
    const components: T[][] = [];

    this.getVertices().forEach((vertex) => {
      if (!visited.has(vertex)) {
        const component: T[] = [];
        this.bfs(vertex, (v) => {
          if (!visited.has(v)) {
            visited.add(v);
            component.push(v);
          }
        });
        components.push(component);
      }
    });

    return components;
  }

  /**
   * Get graph size (number of vertices)
   */
  size(): number {
    return this.adjacencyList.size;
  }

  /**
   * Get edge key for weight storage
   */
  private getEdgeKey(from: T, to: T): string {
    return `${String(from)}->${String(to)}`;
  }

  /**
   * Clear graph
   */
  clear(): void {
    this.adjacencyList.clear();
    this.edgeWeights.clear();
  }

  /**
   * Convert to adjacency matrix representation
   */
  toAdjacencyMatrix(): number[][] {
    const vertices = this.getVertices();
    const size = vertices.length;
    const matrix: number[][] = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));

    vertices.forEach((from, i) => {
      vertices.forEach((to, j) => {
        if (this.hasEdge(from, to)) {
          matrix[i][j] = this.getEdgeWeight(from, to) ?? 1;
        }
      });
    });

    return matrix;
  }
}

/**
 * Specialized graph for price comparison
 */
export interface PriceNode {
  storeId: string;
  storeName: string;
  inputId: string;
  price: number;
}

export class PriceComparisonGraph extends Graph<string> {
  private priceData: Map<string, PriceNode> = new Map();

  /**
   * Add store with price
   */
  addStore(node: PriceNode): void {
    const key = `${node.storeId}-${node.inputId}`;
    this.priceData.set(key, node);
    this.addVertex(key);
  }

  /**
   * Connect stores selling same input
   */
  connectStoresBySameInput(inputId: string): void {
    const storesWithInput: string[] = [];

    this.priceData.forEach((node, key) => {
      if (node.inputId === inputId) {
        storesWithInput.push(key);
      }
    });

    // Connect all stores selling same input
    for (let i = 0; i < storesWithInput.length; i++) {
      for (let j = i + 1; j < storesWithInput.length; j++) {
        const price1 = this.priceData.get(storesWithInput[i])!.price;
        const price2 = this.priceData.get(storesWithInput[j])!.price;
        const priceDiff = Math.abs(price1 - price2);

        this.addEdge(storesWithInput[i], storesWithInput[j], priceDiff);
      }
    }
  }

  /**
   * Find stores with best prices for input
   */
  findBestPrices(inputId: string, limit: number = 5): PriceNode[] {
    const stores: PriceNode[] = [];

    this.priceData.forEach((node) => {
      if (node.inputId === inputId) {
        stores.push(node);
      }
    });

    return stores.sort((a, b) => a.price - b.price).slice(0, limit);
  }

  /**
   * Get price data for key
   */
  getPriceNode(key: string): PriceNode | null {
    return this.priceData.get(key) ?? null;
  }
}
