# MARKOVLAB 5X Report

## Baseline

Baseline SHA `809f337d48f136766e64b9abdb7c9041a607435a`; version 4.0.0; 89/89 tests passed. Fresh production screenshots are in `assets/screenshots/v5-before/`. Detailed findings: `MARKOVLAB_5X_BASELINE.md`.

## Real problems in v4

The fixed sidebar produced a generic admin silhouette; the Home hero was oversized and image-led; the library looked sparse; calculator output became a tall dark text tower; first visit was blocked by onboarding; mobile had five competing bottom destinations; `⌘K` was displayed on every platform.

## Decisions

Retained formulas, calculator IDs, storage, search, evidence and PWA. Rebuilt the shell, Home, library hierarchy, result styling, brand silhouette, imagery rules and release cache. No framework migration and no remote runtime dependency were added.

## Product architecture

Primary navigation is now Home, Laboratory, Progress and Profile. Evidence, About and Data remain immediately available as secondary utilities. Mobile exposes three primary destinations plus More.

## Result system

The first result context contains the primary metric, unit, meaning, confidence, limitation, action and save controls. Formula and sources remain progressive disclosure. Metric, interval, composition, comparison, delta and scenario semantics continue to use the existing result schema.

## Brand and logo

The orbit/axis mark was replaced with a simpler M, calibrated baseline and brass personal reference point. SVG lockups, mark, favicon, social avatar and regenerated raster app icons ship locally.

## Imagery

Home uses an exact code-native product preview. Evidence uses a selected physical interval metaphor. Domain visuals remain a coherent mineral/forest/brass series and are paired with a practical question rather than used as random decoration.

## RU/EN and themes

Both locales share the same semantic structure and 86-tool content registry. Light, Paper, Dark, Midnight and the System resolver retain early application and persistence; v5 components use semantic tokens rather than inversion.

## Accessibility

See `ACCESSIBILITY_REPORT.md`. The compact shell, native form controls, result focus, reduced motion and four-item mobile navigation reduce cognitive and motor load.

## Performance

See `PERFORMANCE_REPORT.md`. Home no longer has a decorative hero-image dependency. All runtime assets remain local; the complete asset directory is 4.17 MB and the new Evidence visual is 69.7 KB.

## Testing

95 automated tests pass, including six new v5 product gates for shell hierarchy, first-use search, real library entry points, result density, non-blocking onboarding and platform shortcuts.

## Browser QA and before/after

Baseline production was inspected in Chromium. Final production screenshots, deployment status and production smoke-test results are appended after merge. Local Chrome DevTools tracing was externally unavailable, so synthetic metrics are not fabricated.

## Remaining limitations

Only external execution constraints may remain: permission to merge/release and availability of native Firefox, WebKit, assistive technology and Chrome DevTools performance tracing.
