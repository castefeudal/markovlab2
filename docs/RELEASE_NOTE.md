# MARKOVLAB 4.0.0 — Measurable Progress

Release date: 22 August 2026.

## Product

- Home is now both a premium entry point and a lightweight personal dashboard for recent, saved and recommended work.
- The 86-tool library has a hierarchy: recent, high-utility entry points, nine laboratories and specialized results instead of an undifferentiated card wall.
- Search understands human tasks in RU and EN, intent aliases and useful misspellings.
- Progress is the primary label for chronology, deltas, snapshots and honest observed trends.

## Calculator experience

- Stable calculator IDs and formula mathematics are preserved.
- Result surfaces emphasize primary metric, unit, meaning, method/evidence, uncertainty, limitation and action.
- Calculator activation now has an explicit click path plus native form submit, improving mouse/touch reliability without reducing keyboard support.
- Inputs accept comma/dot decimals, retain drafts and provide range-specific localized errors.

## Brand and visual system

- New premium hero, privacy and progress images join the original logo and coordinated laboratory series.
- Light, Dark and Midnight receive deliberate surfaces; System follows `prefers-color-scheme`.
- A no-FOUC bootstrap applies the saved locale/theme before CSS.
- Responsive polish covers the 320–1920 px range, including persistent mobile RU/EN controls.

## Language, privacy and PWA

- Full Russian and English shells, calculator content, search aliases, manifests, 404 and print report.
- Browser-language detection defaults non-Russian locales to English; manual language and theme persist locally.
- State schema v3 migrates v1/v2 data and keeps safe versioned import/export.
- Local-first, offline and zero-remote-runtime principles remain intact.
- Versioned runtime asset URLs prevent an older active service worker from mixing previous modules with the 4.0 shell.

## Quality

- 88 automated tests pass.
- Required content matrix: 86/86 complete in RU and EN.
- Chromium before/after and responsive screenshot archive included with release artifacts.
- CI validates tests and regenerated completeness matrices on every pull request.
