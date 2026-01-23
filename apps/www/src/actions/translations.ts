'use server'

import { requireAccountId } from '@/lib/auth'
import {
	canAccessWebsite,
	updateSegmentTranslation,
	updatePathTranslation,
	markSegmentReviewed,
	markPathReviewed,
} from '@pantolingo/db'

export async function saveSegmentTranslation(
	websiteId: number,
	websiteSegmentId: number,
	lang: string,
	text: string,
	reviewed?: boolean | null
): Promise<{ success: boolean; error?: string }> {
	try {
		const accountId = await requireAccountId()

		if (!(await canAccessWebsite(accountId, websiteId))) {
			return { success: true } // Silent success - don't leak existence
		}

		return updateSegmentTranslation(websiteId, websiteSegmentId, lang, text, reviewed)
	} catch {
		return { success: false, error: 'An error occurred' }
	}
}

export async function savePathTranslation(
	websiteId: number,
	websitePathId: number,
	lang: string,
	text: string,
	reviewed?: boolean | null
): Promise<{ success: boolean; error?: string }> {
	try {
		const accountId = await requireAccountId()

		if (!(await canAccessWebsite(accountId, websiteId))) {
			return { success: true } // Silent success - don't leak existence
		}

		return updatePathTranslation(websiteId, websitePathId, lang, text, reviewed)
	} catch {
		return { success: false, error: 'An error occurred' }
	}
}

export async function reviewSegment(
	websiteId: number,
	websiteSegmentId: number,
	lang: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const accountId = await requireAccountId()

		if (!(await canAccessWebsite(accountId, websiteId))) {
			return { success: true } // Silent success - don't leak existence
		}

		return markSegmentReviewed(websiteId, websiteSegmentId, lang)
	} catch {
		return { success: false, error: 'An error occurred' }
	}
}

export async function reviewPath(
	websiteId: number,
	websitePathId: number,
	lang: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const accountId = await requireAccountId()

		if (!(await canAccessWebsite(accountId, websiteId))) {
			return { success: true } // Silent success - don't leak existence
		}

		return markPathReviewed(websiteId, websitePathId, lang)
	} catch {
		return { success: false, error: 'An error occurred' }
	}
}
