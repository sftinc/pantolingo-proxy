import { pool } from './pool.js'

/**
 * Get or create an origin_path and return its ID.
 * Used for page view tracking where we need the ID even if path exists.
 */
export async function getOrCreateOriginPathId(
	originId: number,
	path: string
): Promise<number | null> {
	try {
		// Insert if not exists, then select
		await pool.query(
			`INSERT INTO origin_path (origin_id, path)
			 VALUES ($1, $2)
			 ON CONFLICT (origin_id, path) DO NOTHING`,
			[originId, path]
		)

		const result = await pool.query<{ id: number }>(
			`SELECT id FROM origin_path WHERE origin_id = $1 AND path = $2`,
			[originId, path]
		)

		return result.rows[0]?.id ?? null
	} catch (error) {
		console.error('Failed to get/create origin_path:', error)
		return null
	}
}

/**
 * Record a page view for an origin path + language combination.
 * Increments hit_count if already exists for today, otherwise inserts.
 * Non-blocking - errors are logged but don't throw.
 */
export async function recordPageView(
	originPathId: number,
	lang: string
): Promise<void> {
	try {
		await pool.query(
			`INSERT INTO origin_path_view (origin_path_id, lang, view_date, hit_count)
			 VALUES ($1, $2, CURRENT_DATE, 1)
			 ON CONFLICT (origin_path_id, lang, view_date)
			 DO UPDATE SET hit_count = origin_path_view.hit_count + 1`,
			[originPathId, lang]
		)
	} catch (error) {
		console.error('Failed to record page view:', error)
	}
}

/**
 * Update last_used_at for translated segments that were fetched from cache.
 * Only updates if the current date is different (to minimize writes).
 * Non-blocking - errors are logged but don't throw.
 *
 * @param originId - Origin ID
 * @param lang - Target language code
 * @param textHashes - Array of text hashes for segments that were used
 */
export async function updateSegmentLastUsed(
	originId: number,
	lang: string,
	textHashes: string[]
): Promise<void> {
	if (textHashes.length === 0) return

	try {
		await pool.query(
			`UPDATE translated_segment ts
			 SET last_used_at = CURRENT_DATE
			 FROM origin_segment os
			 WHERE ts.origin_segment_id = os.id
			   AND os.origin_id = $1
			   AND ts.lang = $2
			   AND os.text_hash = ANY($3::text[])
			   AND (ts.last_used_at IS NULL OR ts.last_used_at < CURRENT_DATE)`,
			[originId, lang, textHashes]
		)
	} catch (error) {
		console.error('Failed to update segment last_used_at:', error)
	}
}

/**
 * Update last_used_at for translated paths that were fetched from cache.
 * Only updates if the current date is different (to minimize writes).
 * Non-blocking - errors are logged but don't throw.
 *
 * @param originId - Origin ID
 * @param lang - Target language code
 * @param paths - Array of original paths that were used
 */
export async function updatePathLastUsed(
	originId: number,
	lang: string,
	paths: string[]
): Promise<void> {
	if (paths.length === 0) return

	try {
		await pool.query(
			`UPDATE translated_path tp
			 SET last_used_at = CURRENT_DATE
			 FROM origin_path op
			 WHERE tp.origin_path_id = op.id
			   AND op.origin_id = $1
			   AND tp.lang = $2
			   AND op.path = ANY($3::text[])
			   AND (tp.last_used_at IS NULL OR tp.last_used_at < CURRENT_DATE)`,
			[originId, lang, paths]
		)
	} catch (error) {
		console.error('Failed to update path last_used_at:', error)
	}
}
