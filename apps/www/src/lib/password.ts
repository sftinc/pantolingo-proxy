import bcrypt from 'bcryptjs'

const BCRYPT_COST = 12
const MIN_LENGTH = 8
const MAX_LENGTH = 50

/**
 * Password validation rules:
 * - 8-50 characters
 * - At least 1 lowercase letter
 * - At least 1 uppercase letter
 * - At least 1 number
 * - At least 1 special character
 * - No spaces allowed
 */
export function validatePassword(password: string): string | null {
	if (password.length < MIN_LENGTH) {
		return `Password must be at least ${MIN_LENGTH} characters`
	}

	if (password.length > MAX_LENGTH) {
		return `Password must be at most ${MAX_LENGTH} characters`
	}

	if (/\s/.test(password)) {
		return 'Password cannot contain spaces'
	}

	if (!/[a-z]/.test(password)) {
		return 'Password must contain at least one lowercase letter'
	}

	if (!/[A-Z]/.test(password)) {
		return 'Password must contain at least one uppercase letter'
	}

	if (!/[0-9]/.test(password)) {
		return 'Password must contain at least one number'
	}

	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		return 'Password must contain at least one special character'
	}

	return null
}

/**
 * Password rules status for live validation UI
 */
export interface PasswordRules {
	minLength: boolean
	maxLength: boolean
	hasLowercase: boolean
	hasUppercase: boolean
	hasNumber: boolean
	hasSpecial: boolean
	noSpaces: boolean
}

/**
 * Get individual password rule statuses for live validation display
 */
export function getPasswordRules(password: string): PasswordRules {
	return {
		minLength: password.length >= MIN_LENGTH,
		maxLength: password.length <= MAX_LENGTH,
		hasLowercase: /[a-z]/.test(password),
		hasUppercase: /[A-Z]/.test(password),
		hasNumber: /[0-9]/.test(password),
		hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		noSpaces: !/\s/.test(password),
	}
}

/**
 * Check if all password rules pass
 */
export function isPasswordValid(password: string): boolean {
	const rules = getPasswordRules(password)
	return Object.values(rules).every(Boolean)
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, BCRYPT_COST)
}

/**
 * Verify a password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash)
}
