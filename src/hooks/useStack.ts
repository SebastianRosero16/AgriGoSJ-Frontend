/**
 * useStack Hook
 * Hook for using Stack data structure in components
 */

import { useState, useCallback, useMemo } from 'react';
import { Stack } from '@/data-structures';

export function useStack<T>(maxSize?: number) {
  const [stack] = useState(() => new Stack<T>(maxSize));
  const [, forceUpdate] = useState({});

  const refresh = useCallback(() => {
    forceUpdate({});
  }, []);

  const push = useCallback((value: T): boolean => {
    const result = stack.push(value);
    refresh();
    return result;
  }, [stack, refresh]);

  const pop = useCallback((): T | null => {
    const value = stack.pop();
    refresh();
    return value;
  }, [stack, refresh]);

  const peek = useCallback((): T | null => {
    return stack.peek();
  }, [stack]);

  const clear = useCallback(() => {
    stack.clear();
    refresh();
  }, [stack, refresh]);

  const toArray = useCallback((): T[] => {
    return stack.toArray();
  }, [stack]);

  const size = useMemo(() => stack.size(), [stack, forceUpdate]);
  const isEmpty = useMemo(() => stack.isEmpty(), [stack, forceUpdate]);
  const isFull = useMemo(() => stack.isFull(), [stack, forceUpdate]);

  return {
    push,
    pop,
    peek,
    clear,
    toArray,
    size,
    isEmpty,
    isFull,
  };
}
