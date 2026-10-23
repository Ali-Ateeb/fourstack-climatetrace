# ClimateTrace

New October 23, 2026 prototype for IEEE ClimateChain's Climate Data & Environmental Monitoring track. Submitted October 23, 2026 after explicit final agreement approval. Codex assisted with design, code and tests; no personal contribution or learning stories are invented.

Create a small environmental observation log, seal it using a SHA-256 hash chain, download the JSON and retain the root separately. Verify evidence against that root. A tamper simulation changes a value without updating hashes.

This is a local tamper-evidence proof of concept, **not a public blockchain**. Someone able to replace the whole bundle can recompute all hashes. An independently trusted root is needed to detect such a rewrite. There is no consensus, immutable external timestamp, author authentication, integrated AI, live sensor, carbon accounting or verified emissions reduction. Hashes do not prove observations are true. All provided readings are invented. User-entered notes appear in exported files. No network data transfer or persistence.

Run `python -m http.server 8770` in this directory and visit http://localhost:8770 (Web Crypto needs localhost or HTTPS). Run `npm test` with Node 24. No dependencies. Limits: 1,000 readings, three supported metrics and fixed matching units. Seven core tests passed. Actual localhost browser verified sample sealing, anchored verification, altered-value detection, adding readings, duplicate rejection and stale-seal hiding. Actual JSON download inspected for three invented records and expected root. Public GitHub Pages sealing and verification also passed: https://ali-ateeb.github.io/fourstack-climatetrace/ . Source: https://github.com/Ali-Ateeb/fourstack-climatetrace .

Official requirements reviewed October 23: https://ieee-climatechain-hack.devpost.com/rules and https://ieee-climatechain-hack.devpost.com/ . Team 2–5; international students and cross-university teams allowed. Displayed exclusion is North Korea, not Pakistan. Published schedule accepts submissions Oct 5–25; no separate coding-start restriction or AI-coding prohibition found in those pages. That is not an organizer guarantee. New work is being created during the open submission period; assistance will be disclosed.

Deadline October 25, 2026 at 19:00 Pakistan time. Needs real 3–5 minute demo, public source, track explanation, working prototype and final submission. Draft 1255866-climatetrace / software 1501425 exists after the user completed the CAPTCHA. Ali Ateeb and Ali Zulfikar are joined. Title, pitch, story, links, JavaScript tag, two screenshots, video and required ZIP are saved. Devpost confirmed Project submitted! October 23, 2026. Both Ali members are included; Anas and Obaidullah are not joined. Edits remain possible until October 25 at 19:00 PKT.

Demo: https://youtu.be/RtdXDq2rDpk — Unlisted, 4:16, actual playback verified. Full H.264/AAC decoding passed. Edited actual captures, synthetic narration and Codex production help are disclosed.
