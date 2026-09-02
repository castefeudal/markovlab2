# Forensic Audit — MARKOVLAB baseline

Audit date: 22 August 2026. Baseline `main`: `be64df389605762b8ab58966c151ef9127b311e7` (v3.1.0). Baseline automated gate: 71 passed, 0 failed.

## Preserved core

- 86 calculator IDs and their formula functions;
- 9 laboratory categories and curated workflows;
- profile, favourites, history, snapshots, recents and deterministic insights;
- local-first storage, versioned import/export and migration;
- evidence metadata, references, method/evidence separation and health disclaimers;
- hash routing, GitHub Pages compatibility, PWA/offline shell and print report;
- vanilla ES modules with no framework or remote runtime dependencies.

## Baseline findings and release changes

| Finding | 4.0 response |
| --- | --- |
| Useful but visually familiar v3 hero | Original precision-instrument hero and stronger brand composition |
| 86-tool discovery still leaned toward a card catalogue | Recent/high-utility/domain hierarchy plus human-query examples |
| Search depended heavily on registry words | Dedicated RU/EN intent aliases, stopwords, weighted fields and fuzzy matching |
| Language was not an explicit premium shell control | Persistent RU/EN segmented control and localized manifests/metadata |
| Profile value over-emphasized completion | ROI-first copy: enter once, reuse where relevant |
| Home was primarily editorial | Local activity turns Home into a compact continuation dashboard |
| Theme application could flash on load | Early validated bootstrap before stylesheets |
| Screenshot evidence predated release candidate | New before/after desktop/mobile matrix captured in Chromium |
| PR quality checks were coupled to Pages deployment | Separate pull-request quality workflow |

## Runtime defects found during browser QA

1. The first v4 inline bootstrap missed the final IIFE invocation and raised `Unexpected end of input`. Fixed and covered by a VM syntax regression test.
2. Theme/data popovers used an unreliable async delegated branch. Menu toggling moved to a synchronous delegated path.
3. Browser touch/click activation did not reliably reach native calculator submit in the QA runtime. The primary button now has an explicit click path while native submit remains for keyboard behaviour.
4. The Russian hero heading was too wide at 320–390 px. Mobile type scale and overflow containment were corrected after screenshot review.
5. A real Pages session with an existing service worker could retain old module responses. Runtime module/CSS requests are now versioned and the v4 cache revision was advanced.

## Removed or avoided

- No formulas or stable IDs were changed for visual reasons.
- No remote font, analytics, tracking, framework, backend or opaque API was introduced.
- No fake score, gauge, smoothing, testimonial, medical endorsement or placeholder content was added.
- Legacy files were retained only where the runtime imports them; the v4 layer is additive and bounded to reduce migration risk.

## Evidence files

- `assets/screenshots/before/`
- `assets/screenshots/after/`
- `CONTENT_COMPLETENESS_MATRIX.md`
- `VISUAL_QA_MATRIX.md`
- `QA_REPORT.md`
