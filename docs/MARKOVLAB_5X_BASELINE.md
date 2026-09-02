# MARKOVLAB 5.0 — baseline

**Captured:** 2026-08-24  
**Production:** https://castefeudal.github.io/markovlab/  
**Baseline SHA:** `809f337d48f136766e64b9abdb7c9041a607435a`  
**Baseline version:** `4.0.0`  
**Automated baseline:** 89/89 tests passed

## Evidence reviewed

The production application, DOM and active CSS were reviewed in Chromium at desktop and mobile sizes. Screenshots are stored in `assets/screenshots/v5-before/`.

## Confirmed problems

1. **The shell reads as a generic dashboard.** A fixed 252 px sidebar, familiar outline controls and six equally weighted navigation destinations make an otherwise distinctive tool feel like an admin template.
2. **Whitespace is frequently accidental.** The desktop hero reserves 610–780 px, calculator result reserves a large dark column and library sections leave much of the first viewport without a useful next action.
3. **The result is not a decision surface.** Meaning, uncertainty, limitation, action, sources and controls form a tall text stack. The number is prominent, but the user must scan vertically to decide what it means or save it.
4. **The hero visual is atmospheric rather than explanatory.** It does not clearly demonstrate the product loop from a human question to a result, decision and saved trend.
5. **Typography lacks role separation.** Very large, heavy display headings dominate useful controls; UI, editorial copy and numeric data rely on nearly the same voice.
6. **Cards and pills are overused.** Independent cards, nested bordered blocks, badges and rounded filters reduce hierarchy and make the product feel assembled from a wellness UI kit.
7. **The palette is competent but not ownable.** Beige/forest/mint is calm, yet the particular surfaces and gradients are common and not recognizable without the wordmark.
8. **The small brand mark is too intricate.** Orbit, axes and the M compete at favicon size; the silhouette is not sufficiently immediate.
9. **The 86-tool library can appear sparse.** Large cards and section gaps produce the visual impression of partial loading despite a complete registry.
10. **Mobile prioritization is weak.** Five destinations with small captions compete in the bottom bar. The meaningful hero visual largely disappears while the display heading still consumes substantial height.
11. **Trust is reduced by small inconsistencies.** Production shows `⌘K` regardless of platform, the first visit is blocked by onboarding, and examples can be mistaken for live personal values.

## What is retained

- all 86 calculator IDs and validated calculation functions;
- nine laboratory categories and curated workflows;
- local-first profile, favorites, recents, drafts, history and snapshots;
- versioned import/export and migrations;
- RU/EN content, natural-language aliases and fuzzy search;
- evidence/reference metadata;
- vanilla ES modules, GitHub Pages routing and PWA architecture.

## What is rebuilt

- application navigation and first-use experience;
- Home as a useful search-first workspace;
- library density and discovery hierarchy;
- calculator header, form/result relationship and result templates;
- mobile navigation priorities;
- logo silhouette, typography hierarchy and semantic visual language;
- theme tokens and component restraint;
- release/version/cache coherence and visual regression evidence.

## Baseline verdict

Version 4.0 is functionally strong but visually and compositionally inconsistent with a premium precision instrument. The overhaul must improve task completion and information density before adding decorative assets.
