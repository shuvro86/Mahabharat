# Security review

This review covered authentication, verification challenges, request validation, search-history rendering, and installed dependencies. It identifies vulnerabilities; it does not establish that an intrusion occurred or constitute a full penetration test.

## Fixed

- Protected routes now check that the account still exists and use its current role. Deleting an account or changing its role takes effect for existing tokens.
- Password resets increment a session version, invalidating earlier sessions. Legacy tokens remain valid only for accounts still at version zero.
- Verification challenges are consumed atomically and checked against their version, expiry, and attempt budget. Optimistic concurrency prevents stale challenge updates. Email sends are reserved before provider calls to prevent simultaneous resends bypassing limits. If an operation fails after consuming a challenge, the user must start a new verification.
- Search history now uses text nodes and event listeners instead of interpolating stored queries into HTML and inline JavaScript.
- Login failures no longer disclose account existence through different error messages. Login no longer matches non-unique full names. Regex search characters are escaped literally.
- Passwords are bounded to bcrypt's 72-byte limit; malformed review and quiz identifiers and oversized inputs are rejected. Pagination is bounded.
- API errors no longer return raw database/driver messages. Response headers protect against framing and content-type sniffing.
- Development JWT signing no longer uses a public, hard-coded fallback secret. Without an explicit secret, restarting development invalidates its sessions.
- Rate-limiter storage is bounded. Compatible dependency patches remove the advisories reported by npm at review time.

## Validation

Build passed. Thirteen unit/regression checks and one real-MongoDB integration test passed. Integration uses a separate `security_test_` database and removes that database afterward; it does not mutate application or production records. Coverage includes concurrent reset requests, replayed codes, exhausted code attempts, revoked sessions, stale roles, invalid identifiers, and stored search payloads. npm reported zero known vulnerabilities after the updates.

Run `npm run test:security`. To include the MongoDB integration test, set `SECURITY_TEST_MONGODB_URI` to a local URI whose database name starts with `security_test_`; the test uses port 4320 and drops that test database.

## Remaining boundaries

- Rate limiting is per process, so it does not provide a shared brute-force budget across Vercel instances. A shared limiter or platform firewall rules are still recommended before broad public access.
- The frontend still uses localStorage tokens and many inline scripts/handlers. This review fixes the identified search-history injection; it does not certify every rendering path or implement a strict Content Security Policy.
- Resend's test sender restriction is an external configuration issue, not a code vulnerability. A verified sender domain is needed for recipients other than the Resend account owner.
- Signup conflict responses identify the conflicting field and focus it in the form; uniqueness rules are preserved. Regression tests cover each duplicate field and a successful second account with different details.
