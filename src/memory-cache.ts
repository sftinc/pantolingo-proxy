/**
 * In-memory cache implementation
 * Drop-in replacement for Cloudflare KV with same async interface
 */

interface CacheEntry {
	value: string
	expiresAt: number
}

export class MemoryCache {
	private store = new Map<string, CacheEntry>()

	/**
	 * Get a value from the cache
	 * @param key - Cache key
	 * @param type - Return type: 'json' parses as JSON, 'text' returns raw string
	 * @returns Cached value or null if not found/expired
	 */
	async get(key: string, type?: 'json' | 'text'): Promise<any> {
		const entry = this.store.get(key)

		if (!entry) {
			return null
		}

		// Check expiration
		if (Date.now() > entry.expiresAt) {
			this.store.delete(key)
			return null
		}

		if (type === 'json') {
			try {
				return JSON.parse(entry.value)
			} catch {
				return null
			}
		}

		return entry.value
	}

	/**
	 * Store a value in the cache
	 * @param key - Cache key
	 * @param value - Value to store (will be stored as string)
	 * @param options - Optional settings including TTL
	 */
	async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
		const ttl = options?.expirationTtl || 60 * 60 * 24 * 30 // 30 days default
		this.store.set(key, {
			value,
			expiresAt: Date.now() + ttl * 1000,
		})
	}

	/**
	 * Delete a key from the cache
	 * @param key - Cache key to delete
	 */
	async delete(key: string): Promise<void> {
		this.store.delete(key)
	}

	/**
	 * Get cache statistics
	 * @returns Object with entry count and approximate size
	 */
	getStats(): { entries: number; sizeBytes: number } {
		let sizeBytes = 0
		for (const [key, entry] of this.store) {
			sizeBytes += key.length + entry.value.length
		}
		return {
			entries: this.store.size,
			sizeBytes,
		}
	}

	/**
	 * Clear all expired entries from the cache
	 * Call periodically to free memory
	 */
	cleanup(): number {
		const now = Date.now()
		let removed = 0
		for (const [key, entry] of this.store) {
			if (now > entry.expiresAt) {
				this.store.delete(key)
				removed++
			}
		}
		return removed
	}

	/**
	 * Clear all entries from the cache
	 */
	clear(): void {
		this.store.clear()
	}
}
