/**
 * Language-region lookup utilities.
 * Provides functions for RTL detection and region-to-language mapping.
 */

import { LANGUAGE_DATA } from './data.js'
import { getLanguageInfo, normalizeLangCode, type LanguageInfo } from './info.js'

export interface CountryInfo {
	code: string // ISO 3166-1 alpha-2 (e.g., "MX")
	name: string // Localized country name (e.g., "Mexico" in English)
}

// Build RTL set for O(1) lookup
const rtlLanguages = new Set(LANGUAGE_DATA.filter((lang) => lang.rtl).map((lang) => lang.code))

// Build reverse lookup: region -> language codes
const regionToLanguages = new Map<string, string[]>()
for (const lang of LANGUAGE_DATA) {
	const parts = lang.code.split('-')
	const region = parts[parts.length - 1]
	// Region codes are 2 letters (not 4-letter script codes like 'hans')
	if (region.length === 2) {
		const existing = regionToLanguages.get(region.toUpperCase()) || []
		existing.push(lang.code)
		regionToLanguages.set(region.toUpperCase(), existing)
	}
}

/**
 * Check if a language is right-to-left.
 * Handles both regional codes (ar-sa) and legacy codes (ar).
 *
 * @param code - Language code (e.g., 'ar-sa', 'he-il', or legacy 'ar')
 * @returns true if the language is RTL
 */
export function isRtlLanguage(code: string): boolean {
	const normalized = normalizeLangCode(code)

	// Direct lookup
	if (rtlLanguages.has(normalized)) {
		return true
	}

	// Check base language (e.g., 'ar' from 'ar-sa')
	const baseLang = normalized.split('-')[0]
	for (const rtlCode of rtlLanguages) {
		if (rtlCode.startsWith(baseLang + '-')) {
			return true
		}
	}

	return false
}

/**
 * Get all language variants available for a region/country.
 *
 * @param regionCode - ISO 3166-1 alpha-2 (e.g., 'MX', 'CA', 'CH')
 * @param displayLocale - Locale for language names (default: 'en')
 * @returns Array of LanguageInfo for that region
 *
 * @example
 * getLanguagesForRegion('CH') // Returns German, French, Italian (Switzerland)
 * getLanguagesForRegion('CA') // Returns English, French (Canada)
 */
export function getLanguagesForRegion(regionCode: string, displayLocale: string = 'en'): LanguageInfo[] {
	const codes = regionToLanguages.get(regionCode.toUpperCase())
	if (!codes) return []

	return codes.map((code) => getLanguageInfo(code, displayLocale)).filter((info): info is LanguageInfo => info !== undefined)
}

/**
 * @deprecated Countries are now embedded in regional codes.
 * Use getLanguagesForRegion() instead.
 */
export function getLanguagesForCountry(countryCode: string, displayLocale: string = 'en'): LanguageInfo[] {
	console.warn('getLanguagesForCountry is deprecated. Use getLanguagesForRegion() instead.')
	return getLanguagesForRegion(countryCode, displayLocale)
}

/**
 * @deprecated Countries are now embedded in regional codes.
 * This function no longer returns useful data.
 */
export function getCountriesForLanguage(_langCode: string, _displayLocale: string = 'en'): CountryInfo[] {
	console.warn('getCountriesForLanguage is deprecated. Countries are now embedded in regional codes.')
	return []
}
