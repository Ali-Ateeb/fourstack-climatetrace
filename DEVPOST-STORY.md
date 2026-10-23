## Track and problem

Climate Data & Environmental Monitoring. Small community and student projects need a way to notice when an observation log changes during sharing and review. Without a separately retained reference, an edited file can silently become the new copy. ClimateTrace explores one small part of that trust problem: integrity against a previously saved fingerprint.

## What it does

Enter up to 1,000 observations with an ID, UTC timestamp, site, supported metric, nonnegative numeric value, matching unit and provenance note. Seal the ordered log into a SHA-256 hash chain, download its JSON evidence and retain the root fingerprint separately. Paste evidence into the verifier and compare it against that independently supplied root. A simulation changes a reading without updating its hash so reviewers can see an integrity failure.

The provided example has two solar-generation readings and one rainfall reading. All values and sites are invented. No live environmental measurements, carbon credits or emissions reductions are claimed. A fourth reading invalidates the prior seal and export. Duplicate IDs, invalid dates, mismatched units and unsupported metrics are rejected.

## Architecture and trust boundaries

JavaScript, HTML, CSS and the browser Web Crypto SHA-256 implementation. Each record hashes its canonical observation, sequence and preceding hash. The final record hash is the root. The same normalized log produces the same root. Data processing is local; no account, wallet, paid service or data upload is required. Exports include the user's entered values and notes. Reloading clears the log.

This is a data-integrity proof of concept, not a public blockchain. There is no network consensus, public anchoring, immutable timestamp or author authentication. Someone who replaces the whole bundle can recompute all hashes. An independently trusted original root is needed to detect that rewrite. Hashes do not prove measurements are true, sensors are calibrated, or environmental claims are valid. The prefilled root is a demo convenience, not independent trust.

## Verification

Seven core tests cover deterministic and anchored verification, changed values, record reordering/truncation, complete rewrites, numeric/date/unit validation, duplicate IDs, malformed formats and changed previous pointers. Actual browser flows verify sample sealing, matching-root verification, tamper detection, missing-root warnings, root mismatch, adding readings and stale-seal hiding. The real downloaded JSON was inspected for three expected invented readings and its root. Public GitHub Pages sealing and verification also work. These checks are narrow prototype validation, not a security audit.

## Original work, assistance and next steps

New application work began October 23, 2026 for this event. No application code from the team's earlier hackathon products was reused. Codex assisted with design, implementation, tests, documentation and demo preparation; standard MIT license text and common video-encoding utilities are reused. No AI model is integrated into the app. Personal contribution or learning stories are not invented.

The demo uses edited actual browser captures, invented data and synthetic Windows text-to-speech narration; it is not a continuous recording. Transcript and timed captions accompany it. Future work could evaluate authenticated authors, trusted external root publication and real field workflows. None is implemented or claimed today. The project does not currently establish production readiness, verified adoption, scalability or measured climate impact.
