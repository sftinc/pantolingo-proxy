'use server'

import { requireAccountId } from '@/lib/auth'
import { canAccessWebsite, updateWebsiteSettings as dbUpdateWebsiteSettings } from '@pantolingo/db'

export async function saveWebsiteSettings(
	websiteId: number,
	settings: {
		skipWords: string[]
		skipPath: string[]
		translatePath: boolean
	}
): Promise<{ success: boolean; error?: string }> {
	try {
		if (settings.skipWords.length > 50) {
			return { success: false, error: 'Too many skip words (max 50)' }
		}
		if (settings.skipPath.length > 25) {
			return { success: false, error: 'Too many skip paths (max 25)' }
		}

		const accountId = await requireAccountId()

		if (!(await canAccessWebsite(accountId, websiteId))) {
			return { success: true } // Silent success - don't leak existence
		}

		return dbUpdateWebsiteSettings(websiteId, settings)
	} catch {
		return { success: false, error: 'An error occurred' }
	}
}
