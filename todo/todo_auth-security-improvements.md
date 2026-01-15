# Auth Security Improvements

## Summary

Additional security improvements for the authentication system identified during code review of the password login feature.

## Why

| Current State | Proposed State |
|--------------|----------------|
| JWT sessions cannot be invalidated server-side | Consider hybrid approach or token blacklist |
| No rate limiting on login | Prevent brute force attacks |
| Basic password requirements | Stronger requirements with common password check |

## Phase 1: JWT Session Management

**Goal:** Allow server-side session invalidation when needed

- [ ] Evaluate tradeoffs of current JWT-only approach vs hybrid (database sessions for credentials)
- [ ] Consider adding a token blacklist table for immediate invalidation
- [ ] Document the security tradeoffs of the chosen approach

### Details

1. Current implementation uses JWT with 1-day expiry (`apps/www/src/lib/auth.ts:49-51`)
2. If an account is compromised or deleted, the JWT remains valid until expiry
3. Options:
   - Keep current approach (acceptable for most use cases with 1-day expiry)
   - Add `token_blacklist` table and check on each request
   - Use database sessions for credentials provider only

## Phase 2: Rate Limiting

**Goal:** Prevent brute force password attacks

- [ ] Add rate limiting middleware for `/api/auth` routes
- [ ] Track failed login attempts per email/IP
- [ ] Consider account lockout after N failed attempts

### Details

1. Implement at API/middleware level in `apps/www/src/middleware.ts`
2. Options:
   - Use in-memory rate limiter (simple, resets on deploy)
   - Use Redis-based rate limiter (persistent across deploys)
   - Use database table to track attempts (works without Redis)
3. Suggested limits:
   - 5 failed attempts per email per 15 minutes
   - 20 failed attempts per IP per 15 minutes

## Phase 3: Stronger Password Requirements (Optional)

**Goal:** Prevent weak passwords that meet basic requirements

- [ ] Add check against common passwords list (top 10k)
- [ ] Consider requiring special characters

### Details

1. Current validation in `apps/www/src/lib/password.ts` checks:
   - Min 8 chars, max 128 chars
   - At least 1 lowercase, 1 uppercase, 1 number
2. Passwords like "Password1" pass validation but are weak
3. Add common password check using a bundled list or API

## Open Questions

- Is 1-day JWT expiry acceptable, or do we need immediate invalidation capability?
- Should we use Redis for rate limiting or keep it simple with in-memory/database?
- Is the common password check worth the added complexity?
