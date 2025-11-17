/**
 * useQueue Hook
 * Hook for using Queue data structure in components
 */

import { useState, useCallback, useMemo } from 'react';
import { Queue } from '@/data-structures';

export function useQueue<T>() {
  const [queue] = useState(() => new Queue<T>());
  const [, forceUpdate] = useState({});

  const refresh = useCallback(() => {
    forceUpdate({});
  }, []);

  const enqueue = useCallback((value: T) => {
    queue.enqueue(value);
    refresh();
  }, [queue, refresh]);

  const dequeue = useCallback((): T | null => {
    const value = queue.dequeue();
    refresh();
    return value;
  }, [queue, refresh]);

  const peek = useCallback((): T | null => {
    return queue.peek();
  }, [queue]);

  const clear = useCallback(() => {
    queue.clear();
    refresh();
  }, [queue, refresh]);

  const toArray = useCallback((): T[] => {
    return queue.toArray();
  }, [queue]);

  const size = useMemo(() => queue.size(), [queue, forceUpdate]);
  const isEmpty = useMemo(() => queue.isEmpty(), [queue, forceUpdate]);

  return {
    enqueue,
    dequeue,
    peek,
    clear,
    toArray,
    size,
    isEmpty,
  };
}
