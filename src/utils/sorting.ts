/**
 * Sorting Algorithms
 * Used for: Table sorting, price comparison, data organization
 */

/**
 * Quick Sort - O(n log n) average
 */
export function quickSort<T>(
  arr: T[],
  compareFn?: (a: T, b: T) => number
): T[] {
  const compare = compareFn || ((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((item) => compare(item, pivot) < 0);
  const middle = arr.filter((item) => compare(item, pivot) === 0);
  const right = arr.filter((item) => compare(item, pivot) > 0);

  return [...quickSort(left, compare), ...middle, ...quickSort(right, compare)];
}

/**
 * Merge Sort - O(n log n) guaranteed
 */
export function mergeSort<T>(
  arr: T[],
  compareFn?: (a: T, b: T) => number
): T[] {
  const compare = compareFn || ((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);

  return merge(left, right, compare);
}

function merge<T>(
  left: T[],
  right: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  const result: T[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}

/**
 * Sort by object key
 */
export function sortByKey<T>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    let comparison = 0;
    if (aVal < bVal) comparison = -1;
    else if (aVal > bVal) comparison = 1;

    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Multi-key sorting
 */
export interface SortConfig<T> {
  key: keyof T;
  order: 'asc' | 'desc';
}

export function multiKeySort<T>(
  arr: T[],
  configs: SortConfig<T>[]
): T[] {
  return [...arr].sort((a, b) => {
    for (const config of configs) {
      const aVal = a[config.key];
      const bVal = b[config.key];

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      else if (aVal > bVal) comparison = 1;

      if (comparison !== 0) {
        return config.order === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}

/**
 * Stable sort with custom comparator
 */
export function stableSort<T>(
  arr: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  const indexed = arr.map((item, index) => ({ item, index }));

  indexed.sort((a, b) => {
    const comparison = compareFn(a.item, b.item);
    return comparison !== 0 ? comparison : a.index - b.index;
  });

  return indexed.map((entry) => entry.item);
}

/**
 * Insertion sort (good for small arrays)
 */
export function insertionSort<T>(
  arr: T[],
  compareFn?: (a: T, b: T) => number
): T[] {
  const compare = compareFn || ((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  const result = [...arr];

  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    let j = i - 1;

    while (j >= 0 && compare(result[j], key) > 0) {
      result[j + 1] = result[j];
      j--;
    }

    result[j + 1] = key;
  }

  return result;
}
