'use client'

import { Suspense, useActionState } from 'react'
import { useSearchParams, redirect } from 'next/navigation'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { sendMagicLink, type AuthActionState } from '@/actions/auth'

export default function CheckEmailPage() {
	return (
		<Suspense fallback={<CheckEmailSkeleton />}>
			<CheckEmailContent />
		</Suspense>
	)
}

function CheckEmailSkeleton() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-6">
			<div className="text-center max-w-md bg-[var(--card-bg)] p-10 rounded-lg shadow-[0_2px_8px_var(--shadow-color)]">
				<div className="animate-pulse">
					<div className="h-12 w-12 bg-[var(--border)] rounded-full mx-auto mb-4" />
					<div className="h-6 bg-[var(--border)] rounded mb-4 mx-auto w-3/4" />
					<div className="h-4 bg-[var(--border)] rounded mb-2 mx-auto w-full" />
				</div>
			</div>
		</main>
	)
}

function CheckEmailContent() {
	const searchParams = useSearchParams()
	const email = searchParams.get('email')

	// Redirect to home if no email param
	if (!email) {
		redirect('/')
	}

	const decodedEmail = decodeURIComponent(email)

	const [state, formAction] = useActionState<AuthActionState, FormData>(sendMagicLink, null)

	return (
		<main className="flex min-h-screen flex-col">
			<div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-end">
				<ThemeToggle />
			</div>
			<div className="flex flex-1 flex-col items-center justify-center p-6">
			<div className="text-center max-w-md bg-[var(--card-bg)] p-10 rounded-lg shadow-[0_2px_8px_var(--shadow-color)]">
				<div className="mb-4 text-5xl">📧</div>
				<h1 className="text-2xl font-semibold mb-4 text-[var(--text-heading)]">
					Check your email
				</h1>
				<p className="text-base leading-relaxed text-[var(--text-muted)]">
					A sign-in link has been sent to{' '}
					<strong className="text-[var(--text-body)]">{decodedEmail}</strong>
				</p>
				<p className="mt-2 text-sm text-[var(--text-muted)]">
					Click the link in the email to sign in. The link expires in 30 minutes.
				</p>

				{state?.error && (
					<div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
						{state.error}
					</div>
				)}

				<form action={formAction} className="mt-6">
					<input type="hidden" name="email" value={decodedEmail} />
					<SubmitButton variant="secondary">Resend email</SubmitButton>
				</form>
			</div>
			</div>
		</main>
	)
}
