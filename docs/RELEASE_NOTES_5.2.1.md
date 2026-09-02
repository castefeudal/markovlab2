# MARKOVLAB 5.2.1 — production corrective pass

- Fixed the Pro pointer activation architecture and added an event trace for browser QA.
- Localized option enums in worked examples and print reports.
- Unified inverse/overlay theme tokens and cache-busted all runtime modules for existing PWA clients.
- Added regression tests for Pro activation structure, all rendered Pro surfaces, localization and inverse-theme token coverage.

Deployment acceptance remains conditional on production Chromium evidence: a manual pointer click must record `pointerdown → pointerup → click`, set `aria-pressed="true"` and render Scenario B.
