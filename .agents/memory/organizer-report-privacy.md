---
name: Organizer report privacy
description: Why final attendance CSVs are emailed rather than exposed through a download endpoint.
---

Final attendance CSVs must be sent only to the organizer email stored when the event is created. Do not expose a public report download endpoint keyed only by event ID.

**Why:** The attendee-facing QR contains the event ID. A public CSV route could let attendees retrieve the full roster and every coupon code.

**How to apply:** Add organizer authentication before offering dashboard downloads. Until then, automatic or manually triggered delivery may send only to the stored organizer address.