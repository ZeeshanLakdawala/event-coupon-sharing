---
name: GitHub connector publishing
description: Replit-specific fallback for publishing when an authorized GitHub connection is not injected into Git or gh.
---

When Git and `gh` reject an HTTPS push despite an authorized GitHub connection, use the standard GitHub OAuth connector through its authenticated repository API rather than requesting a token.

**Why:** GitHub App and OAuth authorizations can be active while the workspace Git credential helper remains unavailable. GitHub's Git Data API also returns `409` for blob and ref operations on a completely empty repository, and Replit's connector proxy enforces a 10 requests-per-second limit.

**How to apply:** Initialize an empty repository with one Contents API commit, then create blobs, a tree, and a child commit through the Git Data API. Throttle below 10 requests per second, retry `429` responses using `Retry-After`, and update the branch ref without force.