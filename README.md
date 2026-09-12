# Event Coupon Check-in

[![CI](https://github.com/ZeeshanLakdawala/event-coupon-sharing/actions/workflows/ci.yml/badge.svg)](https://github.com/ZeeshanLakdawala/event-coupon-sharing/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js 24](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAPI](https://img.shields.io/badge/API-OpenAPI%203.0-6BA539?logo=openapiinitiative&logoColor=white)](lib/api-spec/openapi.yaml)

A secure, CSV-backed event check-in system that verifies registered attendees, privately emails each attendee their assigned coupon, and gives organizers a complete attendance report without exposing coupon codes in the dashboard.

> A privacy-first event operations system: one shared QR code, email-only attendee verification, private coupon delivery, and an organizer-safe attendance record.

## Project signals

This repository uses verifiable engineering controls instead of unsupported certification claims:

- **Continuous integration:** GitHub Actions runs formatting checks, workspace typechecking, builds, and slide validation for pushes and pull requests.
- **Dependency maintenance:** Dependabot opens weekly pnpm dependency update pull requests.
- **API contract:** OpenAPI is the source of truth for generated client and validation code.
- **Security process:** Vulnerability reporting and privacy expectations are documented in [SECURITY.md](SECURITY.md).
- **Review ownership:** Sensitive API, storage, and policy paths are covered by [CODEOWNERS](.github/CODEOWNERS).
- **License:** Released under the [MIT License](LICENSE).

This project has not undergone an external security certification or compliance audit. The signals above describe repository controls, not a certification.

## The exact problem it solves

Event organizers often distribute attendee-specific coupons, vouchers, meal codes, access codes, or other private resources during check-in. Common approaches create avoidable risks:

- Printing coupons exposes codes and makes distribution difficult to audit.
- Putting attendee or coupon information inside a QR code allows anyone who sees it to retrieve private data.
- Asking attendees to create accounts adds friction at the busiest point of the event.
- Sharing a searchable attendee list can expose registration information.
- Tracking attendance separately from coupon delivery creates incomplete or inconsistent records.

Event Coupon Check-in replaces those processes with one event QR code and an email-only attendee check-in:

1. The organizer uploads the registration list once.
2. Every attendee uses the same event link or QR code.
3. An attendee enters the email used during registration.
4. The system privately emails only that attendee's assigned coupon.
5. The organizer sees attendance status and totals, but never coupon codes.
6. After the event, the organizer receives the complete attendance record by email.

## Core privacy and security model

- The public QR code identifies only the event. It contains no attendee or coupon data.
- Attendees provide only their registration email and do not create an account.
- An attendee can receive only the coupon assigned to the matching email address.
- Invalid emails receive a private error without revealing whether other attendees are registered.
- Coupon codes are never returned by organizer-facing summary or attendee-status APIs.
- A check-in is recorded only after the email provider accepts the coupon email. A temporary delivery failure can therefore be retried safely.
- Final reports are sent only to the organizer email stored when the event was created.
- There is no public report-download route based on the event ID.
- Event files are automatically removed on the configured deletion date, which defaults to one calendar day after the event.

## Organizer workflow

### 1. Create an event

Open the organizer dashboard and enter:

- Event name
- Event date
- Organizer email
- Data deletion date

The organizer email receives the final report. The deletion date defaults to one day after the event.

### 2. Upload the attendee CSV

Upload one CSV containing these columns:

| Column | Required | Description |
| --- | --- | --- |
| `name` | No | Attendee name used in the coupon email |
| `email` | Yes | Registration email used to verify check-in |
| `coupon_code` | Yes | Private coupon assigned to that attendee |

Example:

```csv
name,email,coupon_code
Alex Morgan,alex@example.com,WELCOME-101
Sam Lee,sam@example.com,WELCOME-102
```

### 3. Share the event link or QR code

The dashboard generates one event-specific link and a printable QR code. Use the same link or QR code for every attendee.

### 4. Monitor attendance

The organizer dashboard shows:

- Total registrations
- Checked-in count
- Remaining attendee count
- Per-attendee check-in and email status

The dashboard does not display coupon codes.

### 5. Receive the final report

After the event, the system emails the organizer:

- Total registrations
- Checked-in count
- Did-not-show count
- An attached CSV with `name`, `email`, `coupon_code`, and `status`

Final status values are:

- `Checked in`
- `Did not show`

The **Email Final CSV** dashboard button can send the report immediately for testing. Automatic report processing runs before expired event data is deleted.

## Attendee workflow

1. Scan the event QR code or open the shared event link.
2. Enter the email address used during registration.
3. If the email is valid, the assigned coupon is sent privately by email.
4. The attendee is marked checked in only after the email provider accepts the message.
5. If the email is not registered, the page displays a private error and exposes no attendee data.

## Architecture

This repository is a pnpm workspace containing:

- `artifacts/event-coupon-checkin` — React and Vite organizer/attendee web application
- `artifacts/api-server` — Express API, CSV-backed event storage, email delivery, reporting, and cleanup
- `artifacts/event-coupon-checkin-deck` — five-slide product overview deck
- `lib/api-spec` — OpenAPI contract
- `lib/api-client-react` — generated React Query API client
- `lib/api-zod` — generated request and response validation

### Technology

- React
- Vite
- TypeScript
- Express 5
- TanStack Query
- Zod
- Orval OpenAPI code generation
- Resend through Replit Connectors
- pnpm workspaces

### Storage

Event records and attendee rosters are stored as local CSV-backed files rather than in PostgreSQL. This keeps the attendee data model simple, but it means production deployment requires persistent, always-on compute. On Replit, use a Reserved VM deployment rather than an autoscaling or serverless deployment.

## Run locally

### Requirements

- Node.js 24
- pnpm
- A Replit Resend integration for email delivery

### Install dependencies

```bash
pnpm install
```

### Start the API

The API requires a `PORT` environment variable:

```bash
PORT=5000 pnpm --filter @workspace/api-server run dev
```

### Start the web application

In another terminal:

```bash
pnpm --filter @workspace/event-coupon-checkin run dev
```

### Optional email sender

Set `RESEND_FROM_EMAIL` to a sender verified in Resend:

```bash
RESEND_FROM_EMAIL="Event Check-in <events@yourdomain.com>"
```

If it is not configured, the application uses Resend's onboarding sender for development.

## Validation and builds

Run the full workspace type check:

```bash
pnpm run typecheck
```

Build all packages:

```bash
pnpm run build
```

Regenerate the React Query client and Zod validators after changing the OpenAPI specification:

```bash
pnpm --filter @workspace/api-spec run codegen
```

Validate the slide deck:

```bash
pnpm --filter @workspace/event-coupon-checkin-deck run validate-slides
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Community participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md), and security issues should be reported privately using [SECURITY.md](SECURITY.md).

## API overview

The OpenAPI contract in `lib/api-spec/openapi.yaml` defines operations for:

- Creating events
- Importing attendee records
- Reading organizer-safe event summaries
- Reading organizer-safe attendee statuses
- Checking in an attendee
- Sending the final organizer report

## Deliberate Version 1 limits

Version 1 intentionally does not include:

- Attendee accounts or passwords
- Coupon resend controls
- Coupon redemption tracking
- A public attendee directory
- A public final-report download
- Coupon codes in organizer-facing APIs

These limits keep event-day check-in fast and reduce the amount of sensitive data exposed through the interface.

## License

MIT