# Security Policy

## Supported versions

Only the latest `main` branch is currently supported with security fixes. This project is an early-stage Version 1 system and does not make a claim of formal security certification or compliance.

## Reporting a vulnerability

Do not open a public GitHub issue for a suspected vulnerability. Use GitHub's private security advisory flow for this repository, or contact the project maintainer privately through the repository profile.

Please include:

- A clear description of the issue and its impact.
- The affected route, component, or workflow.
- Reproduction steps or a minimal proof of concept.
- Any relevant logs with attendee emails, coupon codes, credentials, and tokens removed.
- Your preferred disclosure contact, if you want acknowledgement.

Please do not include real attendee data, production CSVs, coupon codes, API keys, session cookies, or other secrets.

## Response process

Maintainers will acknowledge a report as soon as practical, validate the issue, assess its impact, and coordinate a fix or mitigation. Disclosure timing will be coordinated with the reporter when the issue affects users or deployed systems.

## Security design commitments

- The public QR code identifies only an event.
- Coupon codes are delivered privately by email and are not exposed through organizer-facing APIs.
- Invalid attendee emails receive a non-enumerating error.
- Final attendance reports are delivered only to the stored organizer email.
- Event data is deleted on the configured deletion date.
- Logs and documentation must not contain attendee data or coupon codes.