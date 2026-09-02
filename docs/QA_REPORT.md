# QA report — MARKOVLAB 6.0.0 release

Date: 3 September 2026.
Release: 6.0.0 · branch `work/markovlab2-ultimate-production` → `main`.

## Executed

- Automated regression: 129 tests passed, 0 failed (`npm run verify`; includes the new fork-isolation suite and regenerated completeness matrices).
- Formula vectors: known-answer, boundary and invalid vectors for all new equations (Katch–McArdle 370+21.6×LBM = 1752.4 at 64 kg FFM; revised Harris–Benedict 1825.2 kcal male 80/180/35; NPV 492.11 for −1000 + 600×3 @10%; IRR 36.31% single-root; two-IRR detection for alternating flows; amortization 888.49/мес at 12%/12мес; break-even 500 units and honest infeasibility when price ≤ variable cost).
- Time-format regression: `pace`, `race-time` and related calculators render real `m:ss` values (e.g. 5:00 min/km, 50:00 for 10 km at 5:00 pace); previous broken outputs (`0:300`, `0:3000`) are gone.
- Fork namespace: runtime code writes only `markovlab2-*` keys and cache `markovlab2-v6.0.0-r1`; no old `markovlab-*` namespace appears in any runtime write path; clear-data touches only the new namespace.
- URL drift: canonical, `og:url`, `twitter:url`, JSON-LD, sitemap, robots and `RELEASE_CONFIG.productionBaseUrl` all resolve to `https://castefeudal.github.io/markovlab2/`; no legacy `/markovlab/` production URL remains in runtime files.
- Content completeness: 97/97 calculators have RU/EN titles, descriptions, when-useful, per-field help, method, limitation, action and search aliases; matrices regenerated from the registry.
- Locale leak scan across rendered surfaces: no known EN enum leakage in RU and vice versa.
- Import safety: oversize rejection, prototype-pollution filtering and schema normalization covered by the existing suite; old-app exports remain importable.

## Browser checks

- Local Chromium smoke over HTTP: Home, Library, calculator (Basic and Pro), Profile, History, Evidence, Workflows and 404 render without console errors; theme and language persist across reload.
- Production verification after deployment is recorded in `docs/MARKOVLAB_FINAL_PRODUCTION_REPORT.md` once the live site check completes for this release.

## Blocked / not available

- Physical iOS/Android devices, forced-offline reload on production, installed-client update UX, 200%/400% zoom, and NVDA/VoiceOver/TalkBack were not available in this execution environment and are not marked passed.
