/**
 * Utility functions for the www app
 */

/**
 * Concatenate class names, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ')
}

/**
 * Format a number with locale-appropriate separators
 */
export function formatNumber(num: number): string {
	return num.toLocaleString()
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text
	return text.slice(0, maxLength - 1) + '\u2026'
}
