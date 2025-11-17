/**
 * Search Algorithms
 * Used for: Marketplace search, filtering, data lookup
 */

/**
 * Binary Search - O(log n)
 * Requires sorted array
 */
export function binarySearch<T>(
  arr: T[],
  target: T,
  compareFn?: (a: T, b: T) => number
): number {
  const compare = compareFn || ((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = compare(target, arr[mid]);

    if (comparison === 0) {
      return mid;
    } else if (comparison < 0) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1;
}

/**
 * Binary Search for objects by key
 */
export function binarySearchByKey<T>(
  arr: T[],
  key: keyof T,
  target: any
): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = arr[mid][key];

    if (midValue === target) {
      return mid;
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

/**
 * Linear Search with predicate
 */
export function linearSearch<T>(
  arr: T[],
  predicate: (item: T) => boolean
): T | null {
  for (const item of arr) {
    if (predicate(item)) {
      return item;
    }
  }
  return null;
}

/**
 * Find all matches with predicate
 */
export function findAll<T>(
  arr: T[],
  predicate: (item: T) => boolean
): T[] {
  return arr.filter(predicate);
}

/**
 * Fuzzy search for strings
 */
export function fuzzySearch(
  query: string,
  target: string
): number {
  query = query.toLowerCase();
  target = target.toLowerCase();

  let score = 0;
  let queryIndex = 0;

  for (let i = 0; i < target.length && queryIndex < query.length; i++) {
    if (target[i] === query[queryIndex]) {
      score++;
      queryIndex++;
    }
  }

  return queryIndex === query.length ? score / query.length : 0;
}

/**
 * Multi-field search
 */
export function multiFieldSearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  const lowerQuery = query.toLowerCase();

  return items.filter((item) => {
    return fields.some((field) => {
      const value = String(item[field]).toLowerCase();
      return value.includes(lowerQuery);
    });
  });
}

/**
 * Advanced search with scoring
 */
export interface SearchResult<T> {
  item: T;
  score: number;
}

export function advancedSearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: (keyof T)[],
  weights?: Partial<Record<keyof T, number>>
): SearchResult<T>[] {
  const results: SearchResult<T>[] = [];

  items.forEach((item) => {
    let score = 0;

    fields.forEach((field) => {
      const value = String(item[field]);
      const weight = weights?.[field] ?? 1;
      const fieldScore = fuzzySearch(query, value);

      score += fieldScore * weight;
    });

    if (score > 0) {
      results.push({ item, score });
    }
  });

  return results.sort((a, b) => b.score - a.score);
}
