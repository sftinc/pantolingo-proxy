import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Comma-separated list of allowed IPs in env var
// Example: DASHBOARD_ALLOWED_IPS=123.45.67.89,98.76.54.32
const ALLOWED_IPS = (process.env.DASHBOARD_ALLOWED_IPS || '').split(',').filter(Boolean)

export function proxy(request: NextRequest) {
	// Only protect dashboard routes
	if (!request.nextUrl.pathname.startsWith('/dashboard')) {
		return NextResponse.next()
	}

	// Get client IP from x-forwarded-for (set by proxies like Render)
	const forwardedFor = request.headers.get('x-forwarded-for')
	const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown'

	// Allow if no IPs configured (dev mode) or IP is in whitelist
	if (ALLOWED_IPS.length === 0 || ALLOWED_IPS.includes(clientIp)) {
		return NextResponse.next()
	}

	// Redirect unauthorized IPs to homepage
	return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
	matcher: '/dashboard/:path*',
}
