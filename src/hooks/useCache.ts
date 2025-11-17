/**
 * useCache Hook
 * Cache management using Map
 */

import { useState, useCallback } from 'react';
import { CACHE_CONFIG } from '@/utils/constants';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function useCache<T>() {
  const [cache] = useState(() => new Map<string, CacheEntry<T>>());

  const set = useCallback((key: string, data: T, ttl: number = CACHE_CONFIG.DEFAULT_TTL) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Cleanup old entries if cache is too large
    if (cache.size > CACHE_CONFIG.MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }
  }, [cache]);

  const get = useCallback((key: string): T | null => {
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  }, [cache]);

  const has = useCallback((key: string): boolean => {
    const entry = cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.delete(key);
      return false;
    }

    return true;
  }, [cache]);

  const remove = useCallback((key: string) => {
    cache.delete(key);
  }, [cache]);

  const clear = useCallback(() => {
    cache.clear();
  }, [cache]);

  return {
    set,
    get,
    has,
    remove,
    clear,
  };
}
