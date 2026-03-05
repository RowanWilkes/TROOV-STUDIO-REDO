/**
 * Singleton in-memory cache for Supabase query results.
 * Persists across component mounts/unmounts and client-side navigation.
 * TTL defaults to 60 seconds.
 */

type CacheEntry<T> = {
  data: T
  expiresAt: number
}

class QueryCache {
  private store = new Map<string, CacheEntry<unknown>>()
  private readonly ttlMs: number

  constructor(ttlMs = 60_000) {
    this.ttlMs = ttlMs
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.data
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, expiresAt: Date.now() + this.ttlMs })
  }

  invalidate(key: string): void {
    this.store.delete(key)
  }

  /** Invalidate all keys with a given prefix, e.g. all cache for a project. */
  invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key)
    }
  }
}

// Single instance — shared across all hooks and components
export const queryCache = new QueryCache(60_000)
