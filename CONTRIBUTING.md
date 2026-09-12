# Contributing to Event Coupon Check-in

Thank you for helping improve Event Coupon Check-in. Contributions should preserve the project's privacy-first behavior and keep the event-day workflow simple.

## Before you start

1. Read the [README](README.md) to understand the product and architecture.
2. Check existing issues and pull requests before opening new work.
3. For security vulnerabilities, do not open a public issue. Follow [SECURITY.md](SECURITY.md).
4. Keep changes focused. Separate unrelated refactors from feature work.

## Development setup

### Requirements

- Node.js 24
- pnpm
- A Replit Resend integration for testing email delivery

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

Run the API and web app in separate terminals:

```bash
PORT=5000 pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/event-coupon-checkin run dev
```

## Engineering standards

- Use TypeScript and keep types explicit at system boundaries.
- Prefer small, focused modules over broad rewrites.
- Preserve generated-code boundaries. Change the OpenAPI source first, then regenerate clients and validators.
- Do not log attendee emails, coupon codes, uploaded CSV contents, or email bodies.
- Never return coupon codes from organizer-facing APIs.
- Do not add public event-ID routes that expose attendee or coupon data.
- Treat email delivery acceptance as the check-in commit point.
- Keep event data deletion behavior intact unless the change includes a documented privacy review.
- Use accessible labels, keyboard support, and clear error states in user-facing flows.
- Do not add credentials, personal attendee data, or production exports to the repository.

## Pull requests

Every pull request should:

- Explain the user problem and the chosen solution.
- Describe privacy or security impact, especially for event and attendee data.
- Include screenshots or a short recording for visual changes.
- Include API contract changes and regeneration steps when applicable.
- Include tests or validation evidence.
- Update documentation when behavior, setup, or operational requirements change.

Keep pull requests reviewable. A reviewer should be able to understand the change without reconstructing unrelated history.

## Required checks

Run these commands before opening a pull request:

```bash
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/event-coupon-checkin-deck run validate-slides
```

Pull requests should include the output of these checks in their validation notes.

## Commit guidance

Use short, imperative commit subjects. Conventional Commit prefixes are encouraged:

- `feat:` — user-visible capability
- `fix:` — bug fix
- `docs:` — documentation-only change
- `refactor:` — behavior-preserving code change
- `test:` — test or validation change
- `chore:` — tooling or maintenance

Example:

```text
feat: keep coupon codes out of attendee status responses
```

## Review principles

Reviewers prioritize:

1. Privacy and data minimization
2. Correct check-in and email-delivery semantics
3. Explicit failure handling
4. Backward-compatible API behavior
5. Accessible, understandable user experience
6. Maintainable implementation

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).