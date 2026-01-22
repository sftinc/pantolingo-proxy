/**
 * Cache-Control header logic
 * Respects origin Cache-Control with minimum enforcement for static assets
 * and dev override capability via cacheDisabledUntil
 */

/** Minimum cache time for static assets (5 minutes in seconds) */
export const MIN_CACHE_SECONDS = 300

export interface CacheControlOptions {
	originHeaders: Headers
	cacheDisabledUntil: Date | null
	applyMinimumCache: boolean // true for static assets, false for HTML
}

/**
 * Determine the Cache-Control header value for a proxied response
 *
 * Logic:
 * 1. If cacheDisabledUntil is set and in the future, return 'no-cache' (dev override)
 * 2. For static assets (applyMinimumCache: true):
 *    - If origin max-age >= 5 minutes, use origin value
 *    - Otherwise enforce 5-minute minimum (treats no-cache/max-age=0 as misconfiguration)
 * 3. For HTML (applyMinimumCache: false):
 *    - Pass through origin Cache-Control
 *    - Default to 'no-cache' if origin has none
 */
export function getCacheControl(options: CacheControlOptions): string {
	const { originHeaders, cacheDisabledUntil, applyMinimumCache } = options

	// Dev override: force no-cache for all content
	if (cacheDisabledUntil && cacheDisabledUntil > new Date()) {
		return 'no-cache'
	}

	// Parse origin's Cache-Control
	const originCC = originHeaders.get('cache-control')
	const originMaxAge = parseMaxAge(originCC)

	if (applyMinimumCache) {
		// Static assets: enforce 5-min minimum
		// Override max-age=0, no-cache, no-store as misconfiguration
		if (originMaxAge !== null && originMaxAge >= MIN_CACHE_SECONDS) {
			// Pass through origin header as-is (preserves immutable, stale-while-revalidate, private, etc.)
			return originCC!
		}
		// Enforce minimum, but preserve private and no-transform directives
		const isPrivate = originCC?.toLowerCase().includes('private')
		const noTransform = originCC?.toLowerCase().includes('no-transform')
		const directives = [isPrivate ? 'private' : 'public', `max-age=${MIN_CACHE_SECONDS}`]
		if (noTransform) directives.push('no-transform')
		return directives.join(', ')
	} else {
		// HTML: respect origin or default to no-cache
		if (originCC) {
			return originCC
		}
		return 'no-cache'
	}
}

/**
 * Parse max-age value from Cache-Control header
 * @returns max-age in seconds, or null if not present
 */
export function parseMaxAge(cacheControl: string | null): number | null {
	if (!cacheControl) return null
	const match = cacheControl.match(/max-age=(\d+)/)
	return match ? parseInt(match[1], 10) : null
}

/** File extensions that are data files (should respect origin cache, not enforce minimum) */
const DATA_FILE_EXTENSIONS = ['.json', '.xml']

/**
 * Check if a pathname has a data file extension
 * Data files (JSON, XML) should respect origin Cache-Control rather than
 * having a minimum cache time enforced, since they may be dynamic API responses.
 */
export function isDataFileExtension(pathname: string): boolean {
	const lowerPath = pathname.toLowerCase()
	return DATA_FILE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext) || lowerPath.includes(ext + '?'))
}

/** Content types that are data formats (should respect origin cache, not enforce minimum) */
const DATA_CONTENT_TYPES = ['application/json', 'application/xml', 'text/xml']

/**
 * Check if a Content-Type header indicates a data format
 * Data formats (JSON, XML) should respect origin Cache-Control rather than
 * having a minimum cache time enforced, since they may be dynamic API responses.
 */
export function isDataContentType(contentType: string): boolean {
	const lowerType = contentType.toLowerCase()
	return DATA_CONTENT_TYPES.some((type) => lowerType.includes(type))
}
