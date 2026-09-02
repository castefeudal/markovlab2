# QA report — MARKOVLAB 5.2.1-r3 production

Date: 30 August 2026.

## Executed

- Automated regression: 120 passed, 0 failed.
- Registry/data/docs build gates, JavaScript syntax and whitespace check: passed.
- Production Chromium baseline: `#calc/bmi` and `#calc/fat-gain-surplus` pointer activation reproduced as failed while Enter succeeded. Locator click and Chromium coordinate click both left `aria-pressed=false`; hit testing returned the actual scenario button.
- Production cache diagnosis: the failing baseline loaded `app.js?v=5.2.1-r1`. Page-global visibility was not treated as conclusive because the runner evaluates in an isolated world; the corrective releases therefore advanced every runtime request and the service-worker cache identity, then verified behavior from observable DOM state on deployed `r3`.
- Catalogue integrity: all-library renderer exposes 86/86 tool rows; every Home `#calc/*` route resolves to an existing registry ID.
- Plate-loader vector: target 101 kg, bar 20 kg and standard one-pair inventory reports 100 kg as nearest lower and 102.5 kg as nearest upper; it never presents 100 kg as the requested 101 kg.
- History locale vector: a canonical `US fl oz` result renders `жидк. унц. США` in RU and `US fl oz` in EN.
- Deployed main: `08c694e4ed178eff9e6e9713c4f6a6e51e801b6d`; production serves `app.js?v=5.2.1-r3`.
- Production Pro matrix: 84/84 numeric calculators passed pointer activation. The first automated pass produced 81 direct passes; `target-waist`, `observed-tdee` and `calorie-target` were runner timing/visibility failures and passed on stabilized retry.
- Manual Chromium DOM/coordinate pointer checks on `bmi` and `fat-gain-surplus` recorded `pointerdown → pointerup → click`, set `aria-pressed=true` and `aria-checked=true`, retained source `pointer`, and rendered Scenario A/B.
- Production catalogue: explicit `All 86` renders 86 tool rows and no `#calc/training-load` link.
- Production plate-loader: target 101 kg reports 100 kg achieved, −1 kg delta and 102.5 kg nearest upper; no `NaN` or silent exact claim.
- Production RU Body text contains no visible `male`, `female`, `intermediate` or `sedentary` enum values.

## Code-reviewed

- The Pro control now uses a target-level pointer transaction. Capture and bubble listeners at window, document, app, form, group and button record event metadata; the button's `pointerup` applies one scenario transaction and its following click is deduplicated.
- History v4 stores canonical structured results and localizes only at render time. v1–v3 records migrate without loss; legacy summaries remain as a fallback when old records contain no structured result.
- PWA runtime cache identity is `5.2.1-r3`.

## Blocked / not available

- Physical iOS/Android touch devices, offline reload with network forcibly disabled, installed-client update UX, 200%/400% zoom, NVDA/VoiceOver/TalkBack and the full responsive screenshot matrix were not available in this execution environment and are not marked passed.

## Release rule

The Pro pointer release gate is browser-confirmed on deployed `r3`. The unavailable device, offline and assistive-technology checks above remain separate release-hardening work and are not represented as executed.
