// Simple in-memory cache for API responses with request deduplication
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    // Clear pending request once data is cached
    this.pendingRequests.delete(key);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  // Get or create a pending request promise for deduplication
  getPendingRequest<T>(key: string): Promise<T> | null {
    return this.pendingRequests.get(key) || null;
  }

  // Set a pending request promise for deduplication
  setPendingRequest<T>(key: string, promise: Promise<T>): void {
    this.pendingRequests.set(key, promise);
    // Clean up promise after it resolves/rejects
    promise.finally(() => {
      // Only delete if it's still the same promise (in case it was replaced)
      if (this.pendingRequests.get(key) === promise) {
        this.pendingRequests.delete(key);
      }
    });
  }

  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const apiCache = new APICache();
