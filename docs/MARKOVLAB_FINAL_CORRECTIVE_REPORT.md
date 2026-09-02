# MARKOVLAB 5.2.1-r3 — final corrective report

Date: 30 August 2026.

## Scope and source of truth

- Baseline: `origin/main` at `1d557be52011595411ed53d3353558370c293b4c`.
- Deployed corrective main: `08c694e4ed178eff9e6e9713c4f6a6e51e801b6d`.
- Working branch: `work/markovlab-production-completion`.
- Registry preserved: 86 calculator IDs, 9 laboratories, local-first storage and vanilla ES modules.

## Reproduced production defect

On production `#calc/bmi`, Chromium showed the `+5%` control as the hit-tested element. A real pointer path did not change `aria-pressed` or Scenario B, while `Enter` did. This is classified as a site defect: it was reproduced on the same visible element, not inferred from DOM presence.

## Corrective changes

- Replaced the stale delegated-only Pro path with a single direct target-level pointer transaction. Capture and bubble instrumentation stays diagnostic-only; `pointerup` performs the state mutation and the following click is deduplicated.
- The inspectable runtime trace includes event type, target/current target, phase, `isTrusted`, `defaultPrevented`, pointer type/id and coordinates. The active form exposes its compact `pointerdown → pointerup → click` trace in `data-pro-event-trace`.
- A pointer transaction updates selected state, Scenario A/B output and source attribution together. Runtime failures log to the console, populate a visible error, and are retained in `window.__MARKOVLAB_PRO_LAST_ERROR__`.
- Made the scenario data value explicit (`data-pro-delta="5"`) and retained native button/radio semantics plus Enter, Space, arrows, Home and End.
- Localized select values in Russian worked examples and print inputs, including `male`, `intermediate` and `sedentary`.
- Reworked inverse-surface foreground tokens. Author, About and Trust eyebrow/link foreground now resolve through an inverse-safe accent token; overlays use one semantic surface contract.
- Repaired the Home editorial route from absent `training-load` to existing `volume-load` and added a renderer-level route integrity test.
- Added explicit Recommended / All 86 / Favorites catalogue states. All 86 literally renders all 86 tool rows.
- Reworked plate loading from greedy silent rounding to an inventory-aware exact/nearest-lower/nearest-upper plan with achieved total and delta.
- Migrated state to v4 so new history records preserve canonical structured results and localize on render.
- Advanced the runtime cache identity to `5.2.1-r3` and service-worker cache to `markovlab-v5.2.1-r3`.

## Executed checks

- `npm test`: 120 passed, 0 failed.
- `npm run build:data`: passed.
- `npm run docs:matrix`: passed.
- JavaScript syntax and `git diff --check`: passed.

## Browser evidence status

| Check | Status | Evidence |
| --- | --- | --- |
| Production pre-fix pointer failure | executed | Chromium pointer path: no selected state or Scenario B; keyboard succeeds. |
| Local post-fix browser e2e | not available | The browser sandbox cannot reach the local preview. |
| Published post-fix pointer trace | executed | Deployed r3 records `pointerdown → pointerup → click`, `aria-pressed=true`, source `pointer` and Scenario B. |
| Numeric Pro production matrix | executed | 84/84 pass; three browser-runner timing failures passed after stabilized retry. |
| Catalogue and plate-loader | executed | All 86 renders 86 rows; 101 kg target reports 100 lower, −1 delta and 102.5 upper. |
| Contrast measurements on rendered surfaces | code-reviewed | Semantic foreground/surface contract is in place; final computed-style ratios remain a deployment gate. |

No browser scenario above is represented as executed unless stated in this table.
