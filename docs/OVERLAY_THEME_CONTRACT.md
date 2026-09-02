# Overlay and inverse-surface contract

MARKOVLAB has four palettes — Light, Paper, Dark and Midnight — plus System, which resolves the operating-system preference rather than acting as a fifth palette.

All page, overlay and inverse surfaces resolve from the same semantic tokens:

`--surface-page`, `--surface-recessed`, `--surface-elevated`, `--surface-inverse`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-on-inverse`, `--border-soft`, `--border-strong`, `--accent`, `--accent-on-dark`, `--accent-on-light`, `--focus`, `--overlay-backdrop`, `--overlay-shadow`.

Dialogs, popovers, command palette, confirmation dialog, onboarding, select controls, author note, About author panel and Trust panel must consume these tokens rather than palette-specific literal colors. Small ordinary text requires 4.5:1; focus and non-text controls require 3:1. `--accent-on-inverse` chooses a light or dark accent according to the inverse surface.
