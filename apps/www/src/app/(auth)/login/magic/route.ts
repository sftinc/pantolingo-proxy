import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

/**
 * Redirect clean magic link URL to NextAuth callback
 * /login/magic?token=...&email=... -> /api/auth/callback/smtp?token=...&email=...
 */
export function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams.toString()
	redirect(`/api/auth/callback/smtp?${searchParams}`)
}
