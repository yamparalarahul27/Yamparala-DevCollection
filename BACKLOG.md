# Backlog

Open ideas for future iteration on the component collection.

## Side-list + preview landing layout

Shipped as `ComponentCollectionStudio` on the homepage:

- Left sidebar list with search, category chips, keyboard ↑/↓/Enter
- Right live iframe preview with sticky title + Open full page / New tab
- URL state `/?c=<slug>` (+ `q`, `section`); last viewed remembered in localStorage
- Mobile: list/preview swap with Back to list

Possible polish later: copy-code/prompt actions in the studio chrome, denser virtualized list, and non-iframe previews for lighter components.

## Project health follow-ups

August 2026 cleanup extracted WIP demos, kebab routes, tokens, GlossyButton,
props playgrounds, expanded specialty-button consolidation, and the studio landing.

### Still open

- Continue migrating remaining specialty buttons (Buy Now glow, FUN Loading,
  Ultramock, Glossy Icon, Connect Wallet, Glass) only where the look fits a
  GlossyButton tone — otherwise keep as art studies.
- Broader a11y + dark-mode policy for product components.

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
