# Canvas Gallery — Implementation Guide

A 3D image gallery built with React Three Fiber. Pan around an infinite tiled grid, click an image to fly the camera to it and slide in a detail panel.

## Stack

- **React Three Fiber** (`@react-three/fiber`) v9
- **drei** (`@react-three/drei`) v10 — uses `<Image>` and `useCursor`
- **three** r172
- **lucide-react** — icons
- **Tailwind CSS** — overlay styling
- Next.js 15 App Router (dynamic import with `ssr: false`)

## File Layout

```
src/
├── components/CanvasGallery.tsx     — The component (single file)
└── app/canvas-gallery/page.tsx       — Demo page with dynamic import + sample data
```

## Public API

```ts
export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  description?: string;
  location?: string;
  date?: string;
  tags?: string[];
}

interface CanvasGalleryProps {
  items: GalleryItem[];
  columns?: number;       // default 5
  mobileColumns?: number; // default 3
  gap?: number;           // default 0.3 (world units)
  itemWidth?: number;     // default 2
  itemHeight?: number;    // default 1.4
}
```

## Architecture — 6 Internal Pieces

### 1. `useIsMobile(breakpoint = 640)`
`matchMedia` hook. Returns boolean, listens for changes.

### 2. `Rig` — camera controller (no zoom)
Lives inside `<Canvas>`. Manages pan + select-to-fly:

- Attaches pointer listeners to the **outer DOM container** (id `canvas-gallery-container`), not the Canvas itself. This avoids R3F event conflicts.
- Drag sensitivity: `0.01` desktop, `0.015` mobile.
- Inertia: velocity multiplied by `0.92` per frame when not dragging.
- Blocks `wheel` with `preventDefault` (`{ passive: false }`) — prevents browser zoom.
- When an item is selected: `lockedTarget` overrides drag, camera lerps to a position **offset from the item** so the side panel doesn't cover it:
  - Desktop: `x = item.x - 1.2`, `z = 5.5`
  - Mobile: `y = item.y + 1.5`, `z = 5` (item moves up, bottom sheet covers bottom)
- Lerp speed: `0.06` when locked (slow + smooth), `0.1` when free panning.

### 3. `ImageCard` — single 3D plane
- Drei `<Image>` with `toneMapped={false}` for accurate colors.
- Invisible mesh overlay (`opacity={0}`) handles click/hover events — keeps the image clean.
- Animated scale: `1 → 1.04 hover → 1.08 selected` via `lerp(0.1)`.
- Z-lift on hover/select for a subtle pop forward.
- Selection ring: extra plane behind the image, slightly larger, colored `#6366f1`.
- `useCursor(hovered)` flips cursor to pointer.

### 4. `InfiniteGrid` — the key trick
Renders a **3×3 block of duplicated tiles** that follows the camera:

1. Each tile contains all `items` in a grid (`columns × ceil(items/columns)`).
2. `tileW = columns * (itemWidth + gap)`, `tileH = rows * (itemHeight + gap)`.
3. Every frame: compute `ox = Math.round(camera.x / tileW)`, `oy = Math.round(-camera.y / tileH)`.
4. When the camera crosses a tile boundary, `tileOffset` state updates and the 9 tiles re-anchor around the new center.
5. Each tile renders at `[tx * tileW, -ty * tileH, 0]`.

Result: pan in any direction, infinitely, with no virtualization bookkeeping. Items repeat (intentional — like a wallpaper).

### 5. `SidePanel` — HTML overlay (outside Canvas)
Rendered as a sibling of the Canvas, not inside it.

**Desktop:** Fixed 380px right slide-in. `translate-x-full ↔ translate-x-0`, 500ms ease.

**Mobile:** Bottom sheet with backdrop:
- `max-h-[85vh]`, rounded top, swipe-to-dismiss.
- `touchstart/move/end` track drag offset; dismiss if `dy > 100px`.
- Drag handle pill at top.
- `paddingBottom: env(safe-area-inset-bottom)` for notched devices.

**Both:** Escape key closes. Backdrop blur. Theme-aware (`isDark`).

### 6. `HUD`
Small chip at `top-[72px] left-5`: item count + "Drag to pan" hint.

## Main Component Wiring

```tsx
<div id="canvas-gallery-container" className="h-full w-full touch-none">
  <Canvas
    camera={{ position: [0, 0, isMobile ? 5 : 7], fov: 50 }}
    dpr={[1, isMobile ? 1.5 : 2]}
    gl={{ antialias: !isMobile, alpha: true }}
    style={{ background: "transparent" }}
  >
    <Rig selectedPosition={...} isSelected={...} isMobile={...} />
    <InfiniteGrid {...} />
    <ambientLight intensity={1.5} />
  </Canvas>
</div>

<HUD ... />
<SidePanel ... />
```

## Camera Constants

```ts
const CAMERA_Z = 7;                  // desktop default
const CAMERA_Z_MOBILE = 5;
const CAMERA_Z_SELECTED = 5.5;       // closer when item selected
const CAMERA_Z_SELECTED_MOBILE = 5;
```

## Theme Sync (project-specific, optional)

The component polls `localStorage["proteus-shell-theme"]` every 500ms to mirror the surrounding shell's dark mode. **Replace this with your own theme source** (context, prop, `useTheme()`, etc.) — it's the only hack in the file.

## Page Usage

```tsx
"use client";
import dynamic from "next/dynamic";
import type { GalleryItem } from "@/components/CanvasGallery";

// ssr:false is mandatory — Three.js needs window
const CanvasGallery = dynamic(() => import("@/components/CanvasGallery"), {
  ssr: false,
  loading: () => <div>Loading 3D canvas...</div>,
});

const items: GalleryItem[] = [
  { id: "1", image: "https://picsum.photos/seed/a/800/600", title: "..." },
  // ...
];

export default function Page() {
  return (
    <div className="h-[75vh] w-full max-w-[1200px] overflow-hidden rounded-2xl">
      <CanvasGallery items={items} columns={5} mobileColumns={3} />
    </div>
  );
}
```

## Gotchas (must-read)

1. **`ssr: false` is mandatory** on the dynamic import — Three.js needs `window`.
2. **The wrapper div needs `id="canvas-gallery-container"`** — `Rig`'s pointer listeners attach to it by id. If you rename, update both places.
3. **`touch-none` on the container** — prevents browser scroll/zoom from fighting the drag handler.
4. **Wheel is blocked** — by design (no zoom in this gallery). Remove the `onWheel` listener if you want zoom.
5. **Pointer events go to the DOM container, not R3F** — this is intentional. R3F's built-in events would conflict with the drag inertia.
6. **Images repeat across tiles** — the "infinite" grid is the same set of images tiled. If you need uniqueness, randomize per-tile inside `InfiniteGrid`.
7. **`toneMapped={false}` on `<Image>`** — without this, drei applies tone mapping and colors look washed out.
8. **Use a fixed-height parent** (`h-[75vh]` or similar) — Canvas needs a bounded container.

## Performance Notes

- DPR capped at `1.5` on mobile, `2` on desktop.
- Antialiasing off on mobile.
- Selection ring only mounts when `isSelected`.
- Grid only re-renders the 9-tile set when crossing a tile boundary (state change), not every frame.

## Dependencies to Install

```bash
pnpm add three @react-three/fiber @react-three/drei lucide-react
pnpm add -D @types/three
```

---

Full source: `src/components/CanvasGallery.tsx` (744 lines) and `src/app/canvas-gallery/page.tsx`.
