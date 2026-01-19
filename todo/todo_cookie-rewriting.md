# Todo: Cookie Rewriting for Translation Proxy

## Summary

Rewrite `Set-Cookie` headers from origin responses to work correctly on translated domains. Currently, cookies with explicit `Domain` attributes are rejected by browsers when the domain doesn't match the translated domain.

## Why

| Current Behavior | Problem | Proposed |
|------------------|---------|----------|
| `Set-Cookie: session=abc; Domain=example.com` passed through | Browser rejects - domain mismatch with `es.example.com` | Rewrite to `Domain=es.example.com` |
| `Set-Cookie: cart=xyz; Path=/checkout` passed through | Cookie not sent if path translated to `/pago` | Rewrite `Path` using pathname map |
| `SameSite=Strict` passed through | May block cookies on different translated domain | Consider relaxing to `Lax` |

**Impact**: Users on translated sites may lose sessions, shopping carts, preferences, or other cookie-dependent functionality.

## Phase 1: Domain Attribute Rewriting

**Goal:** Ensure cookies with explicit `Domain` attributes work on translated domains.

- [ ] Create `rewriteSetCookie()` function in `filter-headers.ts`
- [ ] Strip or rewrite `Domain=` attribute to translated host
- [ ] Handle edge cases (no domain, subdomain wildcards)
- [ ] Update `prepareResponseHeaders()` to use new function
- [ ] Add unit tests

### Details

1. **File: `apps/translate/src/fetch/filter-headers.ts`**
   - Add `rewriteSetCookie(cookie: string, translatedHost: string): string`
   - Parse cookie string, find `Domain=` attribute
   - Replace with translated host or strip entirely (browser defaults to current domain)
   - Handle case variations (`Domain`, `domain`, `DOMAIN`)

2. **Update `prepareResponseHeaders()`**
   - Add `translatedHost` parameter
   - Call `rewriteSetCookie()` for each cookie before accumulating

3. **File: `apps/translate/src/index.ts`**
   - Pass `host` to `prepareResponseHeaders()` calls

## Phase 2: Path Attribute Rewriting

**Goal:** Ensure cookies with `Path` attributes work when URL paths are translated.

- [ ] Extend `rewriteSetCookie()` to accept optional pathname map
- [ ] Rewrite `Path=` attribute using reverse pathname lookup
- [ ] Only apply when `translatePath` is enabled
- [ ] Add unit tests for path rewriting

### Details

1. **File: `apps/translate/src/fetch/filter-headers.ts`**
   - Extend signature: `rewriteSetCookie(cookie, host, pathMap?)`
   - Find `Path=` attribute, look up in pathname map
   - If found, replace with translated path

2. **File: `apps/translate/src/index.ts`**
   - For HTML responses, pass `pathnameMap` to `prepareResponseHeaders()`
   - Static/non-HTML don't need path rewriting (no pathname context)

## Phase 3: SameSite Handling (Optional)

**Goal:** Address potential SameSite issues for cross-origin scenarios.

- [ ] Research SameSite behavior across translated domains
- [ ] Determine if rewriting is needed (depends on domain structure)
- [ ] Implement conditional SameSite adjustment if required

### Details

- If translated domains are subdomains (e.g., `es.example.com`), `SameSite=Strict` should work
- If translated domains are different TLDs (e.g., `example.es`), may need adjustment
- Consider making this configurable per-site

## Open Questions

1. **Strip vs Rewrite Domain**: Should we strip `Domain=` entirely (let browser default to current domain) or explicitly rewrite it? Stripping is simpler but more restrictive.

2. **Subdomain cookies**: If origin sets `Domain=.example.com` for subdomain sharing, should we preserve this pattern for `Domain=.es.example.com`?

3. **Secure attribute**: Should we strip `Secure` if translated domain doesn't use HTTPS? Or enforce HTTPS requirement?

4. **Cookie consent**: Some cookies may be consent-related. Should we preserve these exactly as-is?
