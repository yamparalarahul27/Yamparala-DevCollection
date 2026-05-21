# Backlog

Open ideas for future iteration on the component collection.

## Side-list + preview landing layout

Convert the landing page from a single-column stack into a two-pane layout:

- **Left:** scrollable sidebar listing every component (compact rows — name, status dot, tiny color swatch). Keyboard navigable (↑/↓, Enter).
- **Right:** live in-page preview of the currently selected component (iframe-embedded route or direct dynamic import), with sticky title bar showing status, links to "Open full page", "Copy code", "Copy prompt".

Notes:

- Mobile fallback: sidebar collapses into a sheet/drawer; preview takes full width.
- Search box at top of sidebar (fuzzy by title + description).
- URL state: `/?c=<slug>` so previews are shareable; no preview ⇒ welcome panel with stats.
- Consider remembering last-viewed component in `localStorage` for fast resume.
- Performance: lazy-load preview routes; keep sidebar light.

Out of scope for this PR — tracked here so we don't lose it.
