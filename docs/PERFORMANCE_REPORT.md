# MARKOVLAB 5.0 Performance Report

## Architecture

Static HTML, vanilla ES modules and local assets. No framework runtime, remote font, analytics, tracker, CDN script or mandatory API. JavaScript executes after parsing via `type="module"`; theme and locale resolve before styles to prevent FOUC.

## Budgets verified before release

| Item | Observed | Gate |
| --- | ---: | ---: |
| all files under `assets/` | 4,174,052 bytes | <5 MB |
| v5 CSS override | ~24 KB uncompressed | <32 KB |
| new Evidence WebP | 69,744 bytes | <180 KB |
| icon 192 | 6,800 bytes | <20 KB |
| icon 512 | 20,047 bytes | <40 KB |
| remote runtime requests | 0 by source gate | 0 |

The 4.17 MB figure is the full optional asset library, not initial transfer. Home 5.0 no longer preloads the old 36 KB decorative hero. Most laboratory and support images are route-specific or lazy.

## Rendering decisions

- compact top navigation restores the 252 px previously consumed by the desktop sidebar;
- Home hero has no bitmap LCP dependency;
- width/height is declared for production images;
- result and library layout avoid artificial min-height;
- service-worker cache is coherently versioned `markovlab-v5.0.0-r2`; changed shell CSS and app entry points use the matching `5.0.0-r2` request revision so prior PWA clients cannot retain the pre-fix assets.

## Measurement limitation

Chrome DevTools performance tracing was not available in the execution environment. Production network/console and browser smoke tests are recorded in the release report; no synthetic LCP/CLS/INP values are invented.
