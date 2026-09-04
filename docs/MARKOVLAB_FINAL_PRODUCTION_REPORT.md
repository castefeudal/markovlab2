# MARKOVLAB — final production report (6.0.0)

Date: 3 September 2026 · Release: **6.0.0** · main: `ca8b164` (merge of PR #1 from `work/markovlab2-ultimate-production`).

## Repository & deployment

- Repository: `castefeudal/markovlab2`; backup branch `backup/pre-ultimate-production-20260903` (baseline `7536028`).
- PR #1 reviewed and merged after green CI; `Deploy to GitHub Pages` completed (run 33694586234).
- Production: **https://castefeudal.github.io/markovlab2/** — serves `6.0.0`, cache `markovlab2-v6.0.0-r1`, canonical/OG/sitemap point at the new path.

## Delivered

- **Fork isolation (P0):** dedicated namespaces `markovlab2-state-v4`, `markovlab2-draft-*`, `markovlab2-active-workflow-v1`, SW cache `markovlab2-v6.0.0-r1`; old `markovlab-*` keys and caches are never read, written or deleted. Verified in a real browser with both apps served under one origin: old site state (theme, profile, history, favorites) stayed intact across the full cross-use scenario, and both service workers/caches coexist.
- **URL normalization (P0):** canonical, `og:url`, `twitter:url`, JSON-LD, sitemap, robots and `productionBaseUrl` now resolve to `/markovlab2/`; runtime assets stay relative.
- **Release contract (P0):** single version 6.0.0 across package, runtime config, SW cache and all `?v=` cache-busting params, enforced by tests; version drift (5.4/5.3 mix) eliminated.
- **11 new calculators (97 total):** Katch–McArdle, revised Harris–Benedict (Roza & Shizgal 1984), RMR method comparison with spread, macro planner with feasibility guard, warm-up planner, race split table, NPV, IRR (multi-root detection, no NaN), loan amortization, break-even with honest infeasibility handling, inflation purchasing power. Existing e1RM upgraded to a four-method range (Epley, Brzycki, Lombardi, O'Conner).
- **Fixed defect (P0):** `pace`, `race-time` and related calculators rendered broken time values (`0:300`, `0:3000`); the clock formatter now produces real `m:ss`.
- **Gates:** new fork-isolation and URL-drift test suite; content matrices regenerated 97/97; `npm run verify` aggregates the release gates; CI dropped the no-op `npm install`.

## Production verification (executed)

- Live HTML/JS/SW fetched: bootstrap reads `markovlab2-state-v4`; canonical and `og:url` are `/markovlab2/`; SW cache is `markovlab2-v6.0.0-r1`; `config.js` reports `6.0.0`.
- Real browser on production: `#calc/rmr-comparison` renders, accepts input, calculates (Mifflin 1586 / HB-rev 1648 / Katch–McArdle 1353 kcal, spread 295) with no console errors; state persisted under the new namespace.
- Old production `https://castefeudal.github.io/markovlab/` still returns 200 and its data remains untouched.

## Not available in this environment

- Forced-offline reload of production, installed-PWA update flow on a real device, physical iOS/Android, 200/400% zoom pass and screen readers were not available and are not marked passed.

## Release 6.0.0-r2 (4 September 2026)

main: `9b5efe0` (merge of PR #5 from `hermes/markovlab2-ultimate-production`). Deploy run 33926416597 succeeded.

- **E2E browser gate (new):** `tests/e2e-browser.mjs` drives the real build in headless Chromium: RU default per browser locale with EN switch persistence, command-palette search → calculator flow, required-field validation without phantom results, save-to-history across reload, theme switching, zero console errors, zero external runtime requests, and an axe-core audit (0 serious/critical violations on calculator, overview and profile pages).
- **Fixed release-stamp drift:** `renderers-v3.js` still imported `pro.js?v=6.0.0-r1` after revision bumps; `apply-release.mjs` now rewrites all module imports, so SW cache, `?v=` params and imports move in lockstep (enforced by test).
- **Deploy workflow repaired:** stray orphaned step removed.
- **Semantic contract (PR #3):** `rmr-comparison` Katch–McArdle row now computes only when body fat is provided (no hidden 20% default) and the formula row matches the math (370 + 21.6 × LBM); macro planner separates grams from kcal.
- **i18n (PR #4):** remaining measurement units (W, W/kg, in, mi, kJ, lb, h:mm, kcal/100g, mL/kg/min, units) get Russian release labels.
- **SEO landing pages (PR #2):** 98 crawlable calculator pages under `/calculators/<id>/` with canonical, JSON-LD SoftwareApplication, formulas, limitations, related tools; sitemap has 99 URLs.
- **Production verification r2:** live `sw.js` reports cache `markovlab2-v6.0.0-r2`; `renderers-v3.js` served with `pro.js?v=6.0.0-r2`; homepage, `#calc/cunningham`, SEO pages, robots, sitemap, both manifests and 404 all return 200 in a real browser with no console errors.

## Gates summary

- `npm test`: 136/136 pass.
- `node tests/e2e-browser.mjs`: ALL PASS (11 checks + axe).
- CI (test workflow): green on every PR; Pages deploy: green on every merge to main.
