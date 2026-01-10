/**
 * Regional language data using BCP 47 codes (lowercase).
 * Sorted alphabetically by code.
 */

export interface LanguageData {
	code: string // BCP 47 regional code (e.g., 'es-mx', 'fr-fr')
	englishName: string // e.g., 'Spanish (Mexico)'
	flag: string // Emoji flag (e.g., '🇲🇽')
	rtl: boolean
}

/**
 * @deprecated Legacy codes mapped to default regional codes.
 * Used for display normalization only - does not affect database queries.
 * TODO: Remove after database migration.
 */
export const LEGACY_CODE_MAP: Record<string, string> = {
	en: 'en-us',
	es: 'es-mx',
	fr: 'fr-fr',
}

/**
 * All supported languages with regional BCP 47 codes.
 * Sorted alphabetically by code.
 */
export const LANGUAGE_DATA: LanguageData[] = [
	// Arabic (RTL)
	{ code: 'ar-ae', englishName: 'Arabic (UAE)', flag: '🇦🇪', rtl: true },
	{ code: 'ar-bh', englishName: 'Arabic (Bahrain)', flag: '🇧🇭', rtl: true },
	{ code: 'ar-dz', englishName: 'Arabic (Algeria)', flag: '🇩🇿', rtl: true },
	{ code: 'ar-eg', englishName: 'Arabic (Egypt)', flag: '🇪🇬', rtl: true },
	{ code: 'ar-iq', englishName: 'Arabic (Iraq)', flag: '🇮🇶', rtl: true },
	{ code: 'ar-jo', englishName: 'Arabic (Jordan)', flag: '🇯🇴', rtl: true },
	{ code: 'ar-kw', englishName: 'Arabic (Kuwait)', flag: '🇰🇼', rtl: true },
	{ code: 'ar-lb', englishName: 'Arabic (Lebanon)', flag: '🇱🇧', rtl: true },
	{ code: 'ar-ly', englishName: 'Arabic (Libya)', flag: '🇱🇾', rtl: true },
	{ code: 'ar-ma', englishName: 'Arabic (Morocco)', flag: '🇲🇦', rtl: true },
	{ code: 'ar-om', englishName: 'Arabic (Oman)', flag: '🇴🇲', rtl: true },
	{ code: 'ar-qa', englishName: 'Arabic (Qatar)', flag: '🇶🇦', rtl: true },
	{ code: 'ar-sa', englishName: 'Arabic (Saudi Arabia)', flag: '🇸🇦', rtl: true },
	{ code: 'ar-sd', englishName: 'Arabic (Sudan)', flag: '🇸🇩', rtl: true },
	{ code: 'ar-sy', englishName: 'Arabic (Syria)', flag: '🇸🇾', rtl: true },
	{ code: 'ar-tn', englishName: 'Arabic (Tunisia)', flag: '🇹🇳', rtl: true },
	{ code: 'ar-ye', englishName: 'Arabic (Yemen)', flag: '🇾🇪', rtl: true },

	// Bengali
	{ code: 'bn-bd', englishName: 'Bengali (Bangladesh)', flag: '🇧🇩', rtl: false },
	{ code: 'bn-in', englishName: 'Bengali (India)', flag: '🇮🇳', rtl: false },

	// Bulgarian
	{ code: 'bg-bg', englishName: 'Bulgarian (Bulgaria)', flag: '🇧🇬', rtl: false },

	// Croatian
	{ code: 'hr-ba', englishName: 'Croatian (Bosnia)', flag: '🇧🇦', rtl: false },
	{ code: 'hr-hr', englishName: 'Croatian (Croatia)', flag: '🇭🇷', rtl: false },

	// Czech
	{ code: 'cs-cz', englishName: 'Czech (Czechia)', flag: '🇨🇿', rtl: false },

	// Danish
	{ code: 'da-dk', englishName: 'Danish (Denmark)', flag: '🇩🇰', rtl: false },
	{ code: 'da-fo', englishName: 'Danish (Faroe Islands)', flag: '🇫🇴', rtl: false },
	{ code: 'da-gl', englishName: 'Danish (Greenland)', flag: '🇬🇱', rtl: false },

	// German
	{ code: 'de-at', englishName: 'German (Austria)', flag: '🇦🇹', rtl: false },
	{ code: 'de-ch', englishName: 'German (Switzerland)', flag: '🇨🇭', rtl: false },
	{ code: 'de-de', englishName: 'German (Germany)', flag: '🇩🇪', rtl: false },
	{ code: 'de-li', englishName: 'German (Liechtenstein)', flag: '🇱🇮', rtl: false },
	{ code: 'de-lu', englishName: 'German (Luxembourg)', flag: '🇱🇺', rtl: false },

	// Greek
	{ code: 'el-cy', englishName: 'Greek (Cyprus)', flag: '🇨🇾', rtl: false },
	{ code: 'el-gr', englishName: 'Greek (Greece)', flag: '🇬🇷', rtl: false },

	// English
	{ code: 'en-au', englishName: 'English (Australia)', flag: '🇦🇺', rtl: false },
	{ code: 'en-ca', englishName: 'English (Canada)', flag: '🇨🇦', rtl: false },
	{ code: 'en-gb', englishName: 'English (United Kingdom)', flag: '🇬🇧', rtl: false },
	{ code: 'en-ie', englishName: 'English (Ireland)', flag: '🇮🇪', rtl: false },
	{ code: 'en-nz', englishName: 'English (New Zealand)', flag: '🇳🇿', rtl: false },
	{ code: 'en-us', englishName: 'English (United States)', flag: '🇺🇸', rtl: false },
	{ code: 'en-za', englishName: 'English (South Africa)', flag: '🇿🇦', rtl: false },

	// Spanish
	{ code: 'es-ar', englishName: 'Spanish (Argentina)', flag: '🇦🇷', rtl: false },
	{ code: 'es-cl', englishName: 'Spanish (Chile)', flag: '🇨🇱', rtl: false },
	{ code: 'es-co', englishName: 'Spanish (Colombia)', flag: '🇨🇴', rtl: false },
	{ code: 'es-cu', englishName: 'Spanish (Cuba)', flag: '🇨🇺', rtl: false },
	{ code: 'es-ec', englishName: 'Spanish (Ecuador)', flag: '🇪🇨', rtl: false },
	{ code: 'es-es', englishName: 'Spanish (Spain)', flag: '🇪🇸', rtl: false },
	{ code: 'es-gt', englishName: 'Spanish (Guatemala)', flag: '🇬🇹', rtl: false },
	{ code: 'es-mx', englishName: 'Spanish (Mexico)', flag: '🇲🇽', rtl: false },
	{ code: 'es-pe', englishName: 'Spanish (Peru)', flag: '🇵🇪', rtl: false },
	{ code: 'es-ve', englishName: 'Spanish (Venezuela)', flag: '🇻🇪', rtl: false },

	// Persian (RTL)
	{ code: 'fa-af', englishName: 'Persian (Afghanistan)', flag: '🇦🇫', rtl: true },
	{ code: 'fa-ir', englishName: 'Persian (Iran)', flag: '🇮🇷', rtl: true },
	{ code: 'fa-tj', englishName: 'Persian (Tajikistan)', flag: '🇹🇯', rtl: true },

	// Finnish
	{ code: 'fi-fi', englishName: 'Finnish (Finland)', flag: '🇫🇮', rtl: false },

	// Filipino
	{ code: 'fil-ph', englishName: 'Filipino (Philippines)', flag: '🇵🇭', rtl: false },

	// French
	{ code: 'fr-be', englishName: 'French (Belgium)', flag: '🇧🇪', rtl: false },
	{ code: 'fr-ca', englishName: 'French (Canada)', flag: '🇨🇦', rtl: false },
	{ code: 'fr-ch', englishName: 'French (Switzerland)', flag: '🇨🇭', rtl: false },
	{ code: 'fr-ci', englishName: 'French (Ivory Coast)', flag: '🇨🇮', rtl: false },
	{ code: 'fr-cm', englishName: 'French (Cameroon)', flag: '🇨🇲', rtl: false },
	{ code: 'fr-fr', englishName: 'French (France)', flag: '🇫🇷', rtl: false },
	{ code: 'fr-mg', englishName: 'French (Madagascar)', flag: '🇲🇬', rtl: false },
	{ code: 'fr-ml', englishName: 'French (Mali)', flag: '🇲🇱', rtl: false },
	{ code: 'fr-sn', englishName: 'French (Senegal)', flag: '🇸🇳', rtl: false },

	// Hebrew (RTL)
	{ code: 'he-il', englishName: 'Hebrew (Israel)', flag: '🇮🇱', rtl: true },

	// Hindi
	{ code: 'hi-in', englishName: 'Hindi (India)', flag: '🇮🇳', rtl: false },

	// Hungarian
	{ code: 'hu-hu', englishName: 'Hungarian (Hungary)', flag: '🇭🇺', rtl: false },

	// Indonesian
	{ code: 'id-id', englishName: 'Indonesian (Indonesia)', flag: '🇮🇩', rtl: false },

	// Italian
	{ code: 'it-ch', englishName: 'Italian (Switzerland)', flag: '🇨🇭', rtl: false },
	{ code: 'it-it', englishName: 'Italian (Italy)', flag: '🇮🇹', rtl: false },
	{ code: 'it-sm', englishName: 'Italian (San Marino)', flag: '🇸🇲', rtl: false },
	{ code: 'it-va', englishName: 'Italian (Vatican City)', flag: '🇻🇦', rtl: false },

	// Japanese
	{ code: 'ja-jp', englishName: 'Japanese (Japan)', flag: '🇯🇵', rtl: false },

	// Korean
	{ code: 'ko-kp', englishName: 'Korean (North Korea)', flag: '🇰🇵', rtl: false },
	{ code: 'ko-kr', englishName: 'Korean (South Korea)', flag: '🇰🇷', rtl: false },

	// Lithuanian
	{ code: 'lt-lt', englishName: 'Lithuanian (Lithuania)', flag: '🇱🇹', rtl: false },

	// Latvian
	{ code: 'lv-lv', englishName: 'Latvian (Latvia)', flag: '🇱🇻', rtl: false },

	// Malay
	{ code: 'ms-bn', englishName: 'Malay (Brunei)', flag: '🇧🇳', rtl: false },
	{ code: 'ms-my', englishName: 'Malay (Malaysia)', flag: '🇲🇾', rtl: false },
	{ code: 'ms-sg', englishName: 'Malay (Singapore)', flag: '🇸🇬', rtl: false },

	// Norwegian Bokmal
	{ code: 'nb-no', englishName: 'Norwegian Bokmål (Norway)', flag: '🇳🇴', rtl: false },

	// Dutch
	{ code: 'nl-be', englishName: 'Dutch (Belgium)', flag: '🇧🇪', rtl: false },
	{ code: 'nl-nl', englishName: 'Dutch (Netherlands)', flag: '🇳🇱', rtl: false },
	{ code: 'nl-sr', englishName: 'Dutch (Suriname)', flag: '🇸🇷', rtl: false },

	// Norwegian Nynorsk
	{ code: 'nn-no', englishName: 'Norwegian Nynorsk (Norway)', flag: '🇳🇴', rtl: false },

	// Polish
	{ code: 'pl-pl', englishName: 'Polish (Poland)', flag: '🇵🇱', rtl: false },

	// Portuguese
	{ code: 'pt-ao', englishName: 'Portuguese (Angola)', flag: '🇦🇴', rtl: false },
	{ code: 'pt-br', englishName: 'Portuguese (Brazil)', flag: '🇧🇷', rtl: false },
	{ code: 'pt-cv', englishName: 'Portuguese (Cape Verde)', flag: '🇨🇻', rtl: false },
	{ code: 'pt-gw', englishName: 'Portuguese (Guinea-Bissau)', flag: '🇬🇼', rtl: false },
	{ code: 'pt-mz', englishName: 'Portuguese (Mozambique)', flag: '🇲🇿', rtl: false },
	{ code: 'pt-pt', englishName: 'Portuguese (Portugal)', flag: '🇵🇹', rtl: false },

	// Romanian
	{ code: 'ro-md', englishName: 'Romanian (Moldova)', flag: '🇲🇩', rtl: false },
	{ code: 'ro-ro', englishName: 'Romanian (Romania)', flag: '🇷🇴', rtl: false },

	// Russian
	{ code: 'ru-by', englishName: 'Russian (Belarus)', flag: '🇧🇾', rtl: false },
	{ code: 'ru-kg', englishName: 'Russian (Kyrgyzstan)', flag: '🇰🇬', rtl: false },
	{ code: 'ru-kz', englishName: 'Russian (Kazakhstan)', flag: '🇰🇿', rtl: false },
	{ code: 'ru-ru', englishName: 'Russian (Russia)', flag: '🇷🇺', rtl: false },

	// Slovak
	{ code: 'sk-sk', englishName: 'Slovak (Slovakia)', flag: '🇸🇰', rtl: false },

	// Slovenian
	{ code: 'sl-si', englishName: 'Slovenian (Slovenia)', flag: '🇸🇮', rtl: false },

	// Swedish
	{ code: 'sv-fi', englishName: 'Swedish (Finland)', flag: '🇫🇮', rtl: false },
	{ code: 'sv-se', englishName: 'Swedish (Sweden)', flag: '🇸🇪', rtl: false },

	// Thai
	{ code: 'th-th', englishName: 'Thai (Thailand)', flag: '🇹🇭', rtl: false },

	// Turkish
	{ code: 'tr-cy', englishName: 'Turkish (Cyprus)', flag: '🇨🇾', rtl: false },
	{ code: 'tr-tr', englishName: 'Turkish (Turkey)', flag: '🇹🇷', rtl: false },

	// Ukrainian
	{ code: 'uk-ua', englishName: 'Ukrainian (Ukraine)', flag: '🇺🇦', rtl: false },

	// Urdu (RTL)
	{ code: 'ur-in', englishName: 'Urdu (India)', flag: '🇮🇳', rtl: true },
	{ code: 'ur-pk', englishName: 'Urdu (Pakistan)', flag: '🇵🇰', rtl: true },

	// Vietnamese
	{ code: 'vi-vn', englishName: 'Vietnamese (Vietnam)', flag: '🇻🇳', rtl: false },

	// Chinese (script codes - exception)
	{ code: 'zh-hans', englishName: 'Chinese (Simplified)', flag: '🇨🇳', rtl: false },
	{ code: 'zh-hant', englishName: 'Chinese (Traditional)', flag: '🇹🇼', rtl: false },
]
