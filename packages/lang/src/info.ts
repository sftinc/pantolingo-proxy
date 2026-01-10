/**
 * Language info functions using Intl.DisplayNames for localized display names.
 * Falls back to englishName from LANGUAGE_DATA when Intl returns code unchanged.
 */

import { LANGUAGE_DATA, LEGACY_CODE_MAP, type LanguageData } from './data.js'

export interface LanguageInfo {
	code: string
	name: string // In displayLocale (e.g., "Spanish (Mexico)" in English)
	nativeName: string // In its own language (e.g., "español (México)")
	flag: string // Emoji flag (e.g., "🇲🇽")
	rtl: boolean
}

// Build lookup map for O(1) access
const languageMap = new Map<string, LanguageData>(LANGUAGE_DATA.map((lang) => [lang.code, lang]))

/**
 * Normalize a language code to BCP 47 format.
 * Handles legacy ISO 639-1 codes via LEGACY_CODE_MAP.
 *
 * @param code - Any supported language code
 * @returns Normalized BCP 47 code (lowercase)
 */
export function normalizeLangCode(code: string): string {
	const lower = code.toLowerCase()
	return LEGACY_CODE_MAP[lower] ?? lower
}

/**
 * Check if a code is a legacy (deprecated) format.
 *
 * @param code - Language code to check
 * @returns true if code is in LEGACY_CODE_MAP
 */
export function isLegacyCode(code: string): boolean {
	return code.toLowerCase() in LEGACY_CODE_MAP
}

/**
 * Convert a 2-letter country code to flag emoji.
 * Uses Unicode Regional Indicator Symbol pairs.
 *
 * @param countryCode - ISO 3166-1 alpha-2 (e.g., 'mx', 'us')
 * @returns Flag emoji (e.g., '🇲🇽', '🇺🇸')
 */
export function countryCodeToFlag(countryCode: string): string {
	const upper = countryCode.toUpperCase()
	if (upper.length !== 2) return ''

	// Regional Indicator Symbol Letter A = U+1F1E6
	const base = 0x1f1e6 - 65 // 'A'.charCodeAt(0) = 65
	return String.fromCodePoint(base + upper.charCodeAt(0)) + String.fromCodePoint(base + upper.charCodeAt(1))
}

/**
 * Get flag emoji for a BCP 47 language code.
 * Extracts region from code suffix (e.g., 'es-mx' -> '🇲🇽')
 * For script codes (zh-hans, zh-hant), returns flag from data.
 *
 * @param code - BCP 47 code (e.g., 'es-mx', 'fr-ca') or legacy code
 * @returns Flag emoji or empty string if no region
 */
export function getFlag(code: string): string {
	const normalized = normalizeLangCode(code)

	// For script codes (zh-hans, zh-hant), return flag from data
	const langData = languageMap.get(normalized)
	if (langData?.flag) return langData.flag

	// For regional codes, derive from suffix
	const parts = normalized.split('-')
	const region = parts[parts.length - 1]
	return region.length === 2 ? countryCodeToFlag(region) : ''
}

/**
 * Get display name for a language code using Intl.DisplayNames.
 * Uses separate calls for language and region to ensure consistent "Language (Country)" format.
 * Falls back to englishName if Intl returns the code unchanged (missing ICU data).
 */
function getDisplayName(code: string, displayLocale: string, fallbackName: string): string {
	try {
		const parts = code.split('-')
		const baseLang = parts[0]
		const regionOrScript = parts[1]

		// Get base language name
		const langDisplayNames = new Intl.DisplayNames([displayLocale], { type: 'language' })
		const langName = langDisplayNames.of(baseLang)

		if (!langName || langName === baseLang) {
			return fallbackName
		}

		// If no region/script part, return just the language name
		if (!regionOrScript) {
			return langName
		}

		// Script codes (like 'hans', 'hant') are 4+ characters
		// Region codes are 2 characters
		if (regionOrScript.length === 2) {
			// Regional code - get region name
			const regionDisplayNames = new Intl.DisplayNames([displayLocale], { type: 'region' })
			const regionName = regionDisplayNames.of(regionOrScript.toUpperCase())

			if (regionName && regionName !== regionOrScript.toUpperCase()) {
				return `${langName} (${regionName})`
			}
		}

		// For script codes or unknown formats, fall back to Intl's combined format
		const fullDisplayNames = new Intl.DisplayNames([displayLocale], { type: 'language' })
		const fullName = fullDisplayNames.of(code)
		return fullName && fullName !== code ? fullName : fallbackName
	} catch {
		return fallbackName
	}
}

/**
 * Get language info for a single language code.
 * Returns localized name and native name using Intl.DisplayNames.
 * Normalizes legacy codes (es, fr) to regional codes (es-mx, fr-fr).
 *
 * @param code - Language code (e.g., 'es-mx', 'zh-hans', or legacy 'es')
 * @param displayLocale - Locale for the display name (default: 'en')
 * @returns LanguageInfo object or undefined if code not found
 */
export function getLanguageInfo(code: string, displayLocale: string = 'en'): LanguageInfo | undefined {
	const normalized = normalizeLangCode(code)
	const langData = languageMap.get(normalized)

	if (!langData) {
		return undefined
	}

	return {
		code: normalized,
		name: getDisplayName(normalized, displayLocale, langData.englishName),
		nativeName: getDisplayName(normalized, normalized, langData.englishName),
		flag: langData.flag,
		rtl: langData.rtl,
	}
}

/**
 * Get language info for multiple language codes.
 * Useful for building language selector dropdowns.
 *
 * @param codes - Array of language codes
 * @param displayLocale - Locale for display names (default: 'en')
 * @returns Array of LanguageInfo objects (skips invalid codes)
 */
export function getLanguageOptions(codes: string[], displayLocale: string = 'en'): LanguageInfo[] {
	return codes.map((code) => getLanguageInfo(code, displayLocale)).filter((info): info is LanguageInfo => info !== undefined)
}

/**
 * Get display name for a language code with fallback.
 * Convenience wrapper around getLanguageInfo for simple name lookups.
 *
 * @param code - Language code (e.g., 'es-mx', 'zh-hans', or legacy 'es')
 * @param displayLocale - Locale for the display name (default: 'en')
 * @returns Localized language name, or the code itself if not found
 */
export function getLanguageName(code: string, displayLocale: string = 'en'): string {
	return getLanguageInfo(code, displayLocale)?.name ?? code
}

/**
 * Get language label with flag (no country).
 * Returns format: "Spanish 🇲🇽" instead of "Spanish (Mexico)"
 *
 * @param code - Language code (e.g., 'es-mx', 'zh-hans', or legacy 'es')
 * @param displayLocale - Locale for the display name (default: 'en')
 * @returns Language name with flag, e.g., "Spanish 🇲🇽"
 */
export function getLanguageLabel(code: string, displayLocale: string = 'en'): string {
	const name = getLanguageName(code, displayLocale).split(' (')[0]
	const flag = getFlag(code)
	return flag ? `${name} ${flag}` : name
}
