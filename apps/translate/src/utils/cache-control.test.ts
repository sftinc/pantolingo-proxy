import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getCacheControl, parseMaxAge, MIN_CACHE_SECONDS, isDataFileExtension, isDataContentType } from './cache-control.js'

describe('isDataFileExtension', () => {
	it('returns true for .json files', () => {
		expect(isDataFileExtension('/api/data.json')).toBe(true)
		expect(isDataFileExtension('/config.JSON')).toBe(true)
	})

	it('returns true for .xml files', () => {
		expect(isDataFileExtension('/feed.xml')).toBe(true)
		expect(isDataFileExtension('/sitemap.XML')).toBe(true)
	})

	it('returns true for files with query strings', () => {
		expect(isDataFileExtension('/api/data.json?v=123')).toBe(true)
		expect(isDataFileExtension('/feed.xml?format=rss')).toBe(true)
	})

	it('returns false for static assets', () => {
		expect(isDataFileExtension('/styles.css')).toBe(false)
		expect(isDataFileExtension('/app.js')).toBe(false)
		expect(isDataFileExtension('/logo.png')).toBe(false)
		expect(isDataFileExtension('/font.woff2')).toBe(false)
	})

	it('returns false for paths without extensions', () => {
		expect(isDataFileExtension('/api/users')).toBe(false)
		expect(isDataFileExtension('/')).toBe(false)
	})
})

describe('isDataContentType', () => {
	it('returns true for application/json', () => {
		expect(isDataContentType('application/json')).toBe(true)
		expect(isDataContentType('application/json; charset=utf-8')).toBe(true)
	})

	it('returns true for application/xml', () => {
		expect(isDataContentType('application/xml')).toBe(true)
		expect(isDataContentType('application/xml; charset=utf-8')).toBe(true)
	})

	it('returns true for text/xml', () => {
		expect(isDataContentType('text/xml')).toBe(true)
	})

	it('returns false for static content types', () => {
		expect(isDataContentType('image/png')).toBe(false)
		expect(isDataContentType('text/css')).toBe(false)
		expect(isDataContentType('application/javascript')).toBe(false)
		expect(isDataContentType('font/woff2')).toBe(false)
	})

	it('returns false for HTML', () => {
		expect(isDataContentType('text/html')).toBe(false)
		expect(isDataContentType('text/html; charset=utf-8')).toBe(false)
	})
})

describe('parseMaxAge', () => {
	it('returns null for null input', () => {
		expect(parseMaxAge(null)).toBe(null)
	})

	it('returns null for empty string', () => {
		expect(parseMaxAge('')).toBe(null)
	})

	it('returns null for Cache-Control without max-age', () => {
		expect(parseMaxAge('no-cache')).toBe(null)
		expect(parseMaxAge('private')).toBe(null)
	})

	it('parses max-age from simple header', () => {
		expect(parseMaxAge('max-age=3600')).toBe(3600)
	})

	it('parses max-age from complex header', () => {
		expect(parseMaxAge('public, max-age=86400')).toBe(86400)
		expect(parseMaxAge('private, max-age=300, must-revalidate')).toBe(300)
	})

	it('parses max-age=0', () => {
		expect(parseMaxAge('max-age=0')).toBe(0)
	})
})

describe('getCacheControl', () => {
	// Use fixed time for testing
	const now = new Date('2025-01-15T12:00:00Z')
	const futureDate = new Date('2025-01-15T13:00:00Z') // 1 hour in future
	const pastDate = new Date('2025-01-15T11:00:00Z') // 1 hour in past

	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(now)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	function createHeaders(cacheControl?: string): Headers {
		const headers = new Headers()
		if (cacheControl) {
			headers.set('cache-control', cacheControl)
		}
		return headers
	}

	describe('dev override', () => {
		it('returns no-cache when cacheDisabledUntil is in future', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('public, max-age=86400'),
				cacheDisabledUntil: futureDate,
				applyMinimumCache: true,
			})
			expect(result).toBe('no-cache')
		})

		it('returns no-cache for HTML when cacheDisabledUntil is in future', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('public, max-age=86400'),
				cacheDisabledUntil: futureDate,
				applyMinimumCache: false,
			})
			expect(result).toBe('no-cache')
		})

		it('ignores expired cacheDisabledUntil', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('public, max-age=86400'),
				cacheDisabledUntil: pastDate,
				applyMinimumCache: true,
			})
			expect(result).toBe('public, max-age=86400')
		})

		it('ignores null cacheDisabledUntil', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('public, max-age=86400'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe('public, max-age=86400')
		})
	})

	describe('static assets (applyMinimumCache: true)', () => {
		it('passes through origin header when max-age >= 5 minutes', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('public, max-age=600'), // 10 minutes
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe('public, max-age=600')
		})

		it('passes through origin header when exactly 5 minutes', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('max-age=300'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe('max-age=300')
		})

		it('preserves immutable directive when passing through', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('public, max-age=86400, immutable'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe('public, max-age=86400, immutable')
		})

		it('preserves stale-while-revalidate when passing through', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('public, max-age=600, stale-while-revalidate=60'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe('public, max-age=600, stale-while-revalidate=60')
		})

		it('preserves private when passing through', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('private, max-age=600'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe('private, max-age=600')
		})

		it('enforces 5-min minimum when origin max-age < 5 minutes', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('max-age=60'), // 1 minute
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe(`public, max-age=${MIN_CACHE_SECONDS}`)
		})

		it('enforces 5-min minimum when origin has no Cache-Control', () => {
			const result = getCacheControl({
				originHeaders: createHeaders(),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe(`public, max-age=${MIN_CACHE_SECONDS}`)
		})

		it('overrides origin no-cache to 5 minutes', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('no-cache'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe(`public, max-age=${MIN_CACHE_SECONDS}`)
		})

		it('overrides origin max-age=0 to 5 minutes', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('max-age=0'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe(`public, max-age=${MIN_CACHE_SECONDS}`)
		})

		it('overrides origin no-store to 5 minutes', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('no-store'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe(`public, max-age=${MIN_CACHE_SECONDS}`)
		})

		it('preserves private when enforcing minimum', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('private, max-age=60'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe(`private, max-age=${MIN_CACHE_SECONDS}`)
		})

		it('preserves no-transform when enforcing minimum', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('public, max-age=60, no-transform'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe(`public, max-age=${MIN_CACHE_SECONDS}, no-transform`)
		})

		it('preserves both private and no-transform when enforcing minimum', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('private, no-transform'),
				cacheDisabledUntil: null,
				applyMinimumCache: true,
			})
			expect(result).toBe(`private, max-age=${MIN_CACHE_SECONDS}, no-transform`)
		})
	})

	describe('HTML (applyMinimumCache: false)', () => {
		it('passes through origin Cache-Control', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('private, max-age=60'),
				cacheDisabledUntil: null,
				applyMinimumCache: false,
			})
			expect(result).toBe('private, max-age=60')
		})

		it('passes through origin no-cache', () => {
			const result = getCacheControl({
				originHeaders: createHeaders('no-cache'),
				cacheDisabledUntil: null,
				applyMinimumCache: false,
			})
			expect(result).toBe('no-cache')
		})

		it('returns no-cache when origin has no Cache-Control', () => {
			const result = getCacheControl({
				originHeaders: createHeaders(),
				cacheDisabledUntil: null,
				applyMinimumCache: false,
			})
			expect(result).toBe('no-cache')
		})
	})
})
