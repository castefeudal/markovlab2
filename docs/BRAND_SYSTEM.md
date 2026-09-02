# MARKOVLAB Brand System 5.0

## Concept

MARKOVLAB is a precision instrument for personal decisions. The 5.0 mark combines a deliberately blunt **M**, a calibration baseline with three ticks and one brass reference point. The point is the personal observation; the baseline is the method used to interpret it.

Brand attributes: precise, scientific, editorial, tactile, controlled, candid and personal.

## Logo system

The master mark is SVG. `assets/brand/` contains:

- `logo-primary.svg` — primary lockup;
- `logo-horizontal.svg` and dark/light variants — navigation and reports;
- `logo-mark.svg` — compact mark;
- `logo-mono.svg` — one‑colour reproduction;
- `favicon.svg`, social avatars, OpenGraph assets and PWA icons.

Clear space is one calibration-tick interval on every side. Do not rotate, distort, add glow, recolour individual strokes or place the mark on visually noisy imagery. At 16–24 px use the compact mark. The former orbit/axis construction was removed because it lost silhouette at favicon size.

## Colour

The core palette is mineral ivory, deep forest, graphite, controlled mint and restrained brass. Semantic colours never replace explanatory text.

| Role | Intent |
| --- | --- |
| Page / recessed | quiet mineral field |
| Surface / elevated | readable editorial layers |
| Graphite | primary information |
| Forest | action and calibrated progress |
| Mint | local/private/supportive states |
| Brass | reference marks and secondary emphasis |
| Info / success / warning / danger | explicit semantic states only |

Light, Dark and Midnight are independently tuned token sets. System resolves early from `prefers-color-scheme`; all choices persist locally.

## Typography

The product uses a local system stack with high-quality Cyrillic coverage and no remote font dependency. Display headings are compact and editorial; body copy keeps readable line length; labels are short and technical; metric values use tabular numerals. Units remain visually subordinate but never ambiguous.

## Imagery

Art direction: precision instruments, measured geometry and premium studio materials. Mineral backgrounds, forest metal, mint traces and small brass details form one series. Images contain no accidental text, fake charts, patients, fitness models or decorative “AI” objects.

The hero is now a code-native product demonstration, not a decorative bitmap. Evidence uses `evidence-interval-v5.webp`: a calibrated physical interval between reference markers. Laboratory imagery remains a coordinated local WebP series and is always paired with a practical question. Meaningful images receive localized captions; decorative images use `alt=""`.

## Iconography

One inline SVG family is used throughout. Icons share stroke weight, rounded joins and a geometric silhouette. Emoji and unrelated icon libraries are not mixed into the interface.

## Data visualisation

Charts use direct labels, visible axes, restrained grids and real recorded points. Lines represent chronology, bars comparison, intervals uncertainty, and stacked segments composition. Gauges, speedometers, arbitrary health scores and invented smoothing are prohibited.

## Motion

Transitions are generally 100–300 ms and communicate state change: hover, focus, dialog entry, result reveal, favourite, save and chart update. `prefers-reduced-motion` removes nonessential movement and smooth scrolling.

## Voice

Copy is calm, specific and non-diagnostic. MARKOVLAB distinguishes exact mathematics, validated estimates, population estimates, heuristics and guidelines. The interface states the main limitation before encouraging action.
