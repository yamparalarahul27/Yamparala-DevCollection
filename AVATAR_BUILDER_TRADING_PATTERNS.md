# Avatar Builder — Trading Patterns Ideas

Design exploration for evolving the **Avatar Creator** (`src/app/avatarcreator/page.tsx`)
and the reusable **ProfileAvatar** component (`src/components/ProfileAvatar.tsx`) with
trading / market-themed patterns, plus general builder improvements.

## Current state

- Two-tone gradient avatars: a `top` color and a `bottom` color split 51/51.
- A render-style toggle with two modes: **Smooth** and **Dithered**
  (dithered adds two CSS dot-grid layers via `mix-blend` masks).
- A swatch palette of preset color pairs, a **Shuffle** button, and a
  **"+"** popover for adding a custom top/bottom color pair.
- `ProfileAvatar` composes stacked absolute layers (radial highlight, inner ring,
  shadow, dither grids) and supports a `children` slot for overlay content.
- The repo is a fintech/trading-themed component kit (PnL calendar, financial
  charts, NFT table, chain selector, connect-wallet). `FinancialCharts.tsx`
  already has reusable SVG path machinery (e.g. `describeArc`) and line-chart logic.

These ideas reuse that existing layer/SVG architecture wherever possible.

---

## A. Pattern textures — trading motifs as a render style

Add **"Pattern"** as a peer to Smooth/Dithered in the existing style toggle, so a
market motif is overlaid onto the same gradient avatar.

1. **Candlestick band** — a ring or diagonal strip of tiny green/red candles
   rendered as an SVG/CSS layer inside the circle.
2. **Sparkline / price line** — a single glowing line chart sweeping across the
   avatar, reusing the line-drawing approach from `FinancialCharts.tsx`.
3. **Depth / heatmap grid** — order-book style colored cells, or a subtle
   ticker-tape texture.
4. **Classic chart shapes** — head-and-shoulders, cup-and-handle, ascending
   triangle as decorative line motifs.

Fits cleanly because `ProfileAvatar` already stacks absolutely-positioned layers.

## B. Data-driven / generative avatars

5. **Seed-from-wallet identicon** — paste a wallet address or username →
   deterministically derive the gradient colors *and* a candlestick/sparkline
   pattern. The same seed always yields the same avatar (like Blockies, but
   on-brand). Ties into the existing `connect-wallet-button`.
6. **PnL-reactive avatar** — feed a P/L number or a small series; the avatar
   turns green-biased with an uptrend line when profitable, red with a downtrend
   when not. Could read from the PnL calendar concept.
7. **Live shimmer** — subtly animate the sparkline / candles (building on the
   existing dot-shimmer prototype) so the avatar feels "live."

## C. Builder UX upgrades (pattern-agnostic polish)

8. **Gradient controls** — direction/angle control, more than two color stops,
   and preset "market" palettes (bull / bear / neutral).
9. **Export** — download as PNG/SVG and copy as a data-URI (no export today).
10. **Initials / emoji overlay** — `ProfileAvatar` already supports a `children`
    slot; expose it in the builder UI.
11. **Persist custom swatches** — save to `localStorage` (they currently vanish
    on refresh).

---

## Recommended first slice

Highest-impact, on-theme single feature:

> A **"Pattern" render mode** (candlestick + sparkline) that can also be
> **seeded from a wallet address** (A1–A2 + B5), with **PNG export** (C9) as a
> quick complementary win.

It makes the avatar visibly "trading," reuses existing SVG primitives, and
connects to the wallet components already in the kit.

## Suggested sequencing

1. Pattern render mode (A1–A2) — extend the style toggle and `ProfileAvatar`.
2. Seeded generation (B5) — deterministic hash → colors + pattern.
3. PnL-reactive variant (B6) — bull/bear bias from a value/series.
4. Builder polish (C8–C11) — export, persistence, overlays, gradient angle.
