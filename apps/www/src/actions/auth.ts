'use server'

import { redirect } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { pool } from '@pantolingo/db/pool'

export type AuthActionState = { error?: string } | null

/**
 * Check if an email exists in the database
 * Used by login flow to verify account exists before showing password field
 */
export async function checkEmailExists(email: string): Promise<boolean> {
	const trimmed = email.trim()
	if (!trimmed) return false

	const result = await pool.query(`SELECT 1 FROM account WHERE email = $1 LIMIT 1`, [trimmed])
	return result.rows.length > 0
}

/**
 * Validate callback URL to prevent open redirects
 * Only allows relative paths starting with / (but not protocol-relative //)
 */
function getSafeCallbackUrl(url: string | null): string {
	if (!url) return '/dashboard'
	if (url.startsWith('/') && !url.startsWith('//')) {
		return url
	}
	return '/dashboard'
}

/**
 * Send magic link to email
 * Magic links always redirect to /dashboard (no callbackUrl support)
 */
export async function sendMagicLink(
	_prevState: AuthActionState,
	formData: FormData
): Promise<AuthActionState> {
	const email = formData.get('email')
	if (typeof email !== 'string' || !email) {
		return { error: 'Email is required' }
	}
	const trimmedEmail = email.trim()
	if (!trimmedEmail) {
		return { error: 'Email is required' }
	}

	try {
		await signIn('smtp', {
			email: trimmedEmail,
			redirect: false,
			redirectTo: '/dashboard',
		})
	} catch (error) {
		if (error instanceof AuthError) {
			return { error: 'Failed to send magic link. Please try again.' }
		}
		throw error
	}

	redirect(`/login/check-email?email=${encodeURIComponent(trimmedEmail)}`)
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(
	_prevState: AuthActionState,
	formData: FormData
): Promise<AuthActionState> {
	const email = formData.get('email')
	const password = formData.get('password')
	if (typeof email !== 'string' || !email) {
		return { error: 'Email is required' }
	}
	if (typeof password !== 'string' || !password) {
		return { error: 'Password is required' }
	}
	const callbackUrl = getSafeCallbackUrl(formData.get('callbackUrl') as string | null)

	try {
		await signIn('credentials', {
			email,
			password,
			redirect: false,
		})
	} catch (error) {
		if (error instanceof AuthError) {
			return { error: 'Invalid credentials' }
		}
		throw error
	}

	redirect(callbackUrl)
}
