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

## Project health follow-ups

Remaining items from the July 2026 project review (registry consolidation,
git-based dates, serverless source-viewer fix, CI, README, and lint cleanup
already landed). August 2026 cleanup extracted Chain Selector, NFT Table, and
PnL Calendar into real components with props, removed their CODE_CONTENT
megastrings, normalized several button label/`cn`/`forwardRef` APIs, and
demoted thin button skins to `Experience`.

### Still open — page-only demos

- Extract `svgtoc` CurvedToc and `mathcurveloaders` CurveCanvas out of their
  page.tsx dumps; kill remaining CODE_CONTENT megastrings there and on
  `numberflow` / `peektext` / `figma-properties-button`.
- Normalize remaining concatenated routes to kebab-case (`chain-selector`,
  `nft-table`, `pnl-calendar`, `floating-dock`, `performance-button`, …)
  with redirects if needed.
- Expand shared design tokens and optionally a GlossySurface primitive so
  button skins stop reinventing the same shadow/gradient recipe.

### Repo hygiene

- Remove the 2.1 MB `Proteus Logo.svg` at the repo root — `public/proteus-logo.svg`
  already serves the site; keep design masters out of the repo or optimize them.
- Remove `dot-shimmer-prototype.html` at the root; the `/dot-shimmer-effect`
  route supersedes it.
- Remove unused create-next-app leftovers in `public/` (`next.svg`, `vercel.svg`,
  `globe.svg`, `file.svg`, `window.svg`) after confirming nothing references them.

### Testing

- Add a test runner (Vitest fits the stack) and start with unit tests for
  `src/lib/parseDateInput.ts` — pure date-parsing logic that is easy to regress.
- Add a registry consistency test: every `componentRegistry` entry's `href`
  has a matching `src/app/<route>/page.tsx` and every listed source file exists.
- Wire the test step into the CI workflow once tests exist.

### Dependencies

- Align `three` (^0.172) with `@types/three` (^0.183) to avoid type/runtime
  API drift; upgrade `three` or pin types to the matching version.

### Nice-to-haves

- Per-page `metadata` (title/description) for component routes so shared
  links preview well; only the root layout defines metadata today.
- Consider generating component source snippets at build time instead of
  reading the filesystem in `/api/component-source`, which would let the
  route become static and drop the `outputFileTracingIncludes` config.
