# Event Coupon Check-in

A self-check-in app that verifies registered event emails, sends private coupon codes, and shows organizers attendance status without exposing coupons.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Optional env: `RESEND_FROM_EMAIL` — verified sender address; development falls back to Resend's onboarding sender

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract
- `artifacts/api-server/src/routes/events.ts` — event and check-in endpoints
- `artifacts/api-server/src/lib/event-store.ts` — CSV-backed event storage and cleanup
- `artifacts/event-coupon-checkin/` — organizer and attendee web app

## Architecture decisions

- Event attendee data remains CSV-backed instead of using PostgreSQL.
- Coupon codes are never returned by organizer-facing APIs.
- A check-in is committed only after the coupon email is accepted by Resend, so attendees can retry transient delivery failures.
- Event data is deleted after `dataDeleteDate`.

## Product

- Organizers create an event, upload a CSV with `email`, `coupon_code`, and optional `name`, then share a check-in link or QR code.
- Attendees enter only their registration email to check in.
- Successful check-in sends the assigned coupon by email.
- Organizers see total and per-attendee check-in and email status without seeing coupon codes.

## User preferences

- Keep Version 1 focused: no attendee accounts, passwords, resends, redemption tracking, or elaborate email HTML.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
