# MARKOVLAB 5.0 Accessibility Report

Target: WCAG 2.2 AA-oriented product experience.

## Implemented

- skip link and focusable `main` landmark;
- semantic header/nav/main and current-page state;
- native labelled inputs, units outside values and `inputmode="decimal"`;
- error summary, field-level descriptions, `aria-invalid` and result live region/focus;
- command palette keyboard navigation (`Esc`, arrows, `Enter`, `⌘K`/`Ctrl K`);
- ≥44 px primary controls and mobile navigation targets;
- visible `focus-visible` treatment;
- reduced-motion override;
- chart/diagram text alternatives and no colour-only meaning;
- localized accessible labels for RU and EN;
- print report without application chrome.

## Manual checklist

Keyboard order, dialog focus return, 200% zoom, 400% reflow, 320 px width, long Russian labels and reduced motion are release gates in `VISUAL_QA_MATRIX.md`. Automated coverage checks landmarks, labels, descriptions, error targets and isolated external links.

## External limitation

Native screen-reader runs and WebKit/Firefox accessibility-tree inspection require a separate release environment. These are not falsely marked as executed.
