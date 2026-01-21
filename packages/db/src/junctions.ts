/**
 * Junction table operations
 * Links paths to segments for tracking which translations appear on which pages
 *
 * Tables:
 * - website_path_segment: links website_path to website_segment (language-independent)
 */

import { pool } from './pool.js'

/**
 * Link a website path to multiple website segments
 * Uses ON CONFLICT DO NOTHING for idempotency
 *
 * @param websitePathId - Website path ID from batchUpsertPathnames
 * @param websiteSegmentIds - Array of website segment IDs to link
 *
 * SQL: 1 query with UNNEST
 */
export async function linkPathSegments(
	websitePathId: number,
	websiteSegmentIds: number[]
): Promise<void> {
	if (websiteSegmentIds.length === 0) {
		return
	}

	try {
		await pool.query(
			`INSERT INTO website_path_segment (website_path_id, website_segment_id)
			SELECT $1, unnest($2::int[])
			ON CONFLICT (website_path_id, website_segment_id) DO NOTHING`,
			[websitePathId, websiteSegmentIds]
		)
	} catch (error) {
		console.error('Failed to link path segments:', error)
		// Non-blocking - don't throw
	}
}

