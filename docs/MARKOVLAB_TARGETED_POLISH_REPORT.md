# MARKOVLAB targeted polish report — 5.2.0

## Baseline

- Baseline `main` HEAD: `f974ba773f50ad5ecc181610a769d165a10f9870`
- Baseline tests: 107 passing.
- Architecture: vanilla ES modules, local-first state, all 86 calculator registry.

## Defects reproduced

1. Overlay components mixed legacy surface tokens with v5 tokens; muted copy and borders became hard to read on dark and midnight surfaces.
2. Pro sensitivity controls relied on label-wrapped radio inputs and lacked a reliable driver-change path.
3. Body had no calculator for the supplied energy-surplus / fat-equivalent workbook model.
4. Several labels used abstract or generator-like language (“axes”, “hidden AI”, “transparent first-order rules”).

## Corrective work

- Added a shared overlay/theme token contract and explicit focus, hover, pressed, backdrop and select rules.
- Replaced Pro scenario label/radio controls with semantic buttons, `aria-pressed` / `aria-checked`, keyboard focus and a single selection state.
- Added `fat-gain-surplus` as calculator 86, with exact workbook arithmetic, explicit daily-gram units, evidence/provenance and safety copy.
- Added regression vectors and static interaction assertions.
- Made registry-derived counts and completeness matrices dynamic (86/86).
- Bumped release to 5.2.0 and rotated the service-worker cache.

## Verification

- `npm test`: 110 passing.
- Formula vectors: zero surplus, positive surplus, high carbohydrate, active activity and depleted glycogen.
- Static source QA: no placeholder assets, all calculator IDs unique, all calculator pages finite with defaults, RU/EN dictionaries remain key-parity.

## Browser limitation

The local server was started at `http://127.0.0.1:8080`. Playwright was available, but this environment did not contain a Chromium executable (`chrome-headless-shell` was missing), so pixel screenshots and live browser clicks could not be captured here. The semantic controls, event paths and route renderers are covered by static regression tests; production browser verification remains required after deployment.

## Remaining limitations

- The workbook’s F8/F9/F10 labels omit units; the web UI makes the chosen grams/day interpretation explicit and documents it as a clarification.
- The supplied workbook image has no confirmed commercial licence and was not published.
- GitHub push/PR creation is blocked in this environment because no HTTPS git credentials are available.
