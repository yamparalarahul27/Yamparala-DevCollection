"use client";

import { useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type TocItem = { id: string; label: string; depth: number };

export type CurvedTocProps = {
  items: TocItem[];
  activeIndex: number;
  onSelect: (i: number) => void;
  className?: string;
  /** Horizontal indent per depth level (default 16) */
  indentPx?: number;
  /** Item row height (default 32) */
  itemHeight?: number;
  /** Vertical gap between items (default 10) */
  gapHeight?: number;
  /** Base X of the stroke at depth 0 (default 8) */
  strokeXBase?: number;
  /** Component width (default 260) */
  width?: number;
};

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_INDENT_PX = 16;
const DEFAULT_ITEM_H = 32;
const DEFAULT_GAP_H = 10;
const DEFAULT_STROKE_X_BASE = 8;
const DEFAULT_WIDTH = 260;

/* ------------------------------------------------------------------ */
/*  Helpers: build SVG path segments                                   */
/* ------------------------------------------------------------------ */

function itemOffsetX(depth: number, strokeXBase: number, indentPx: number) {
  return strokeXBase + depth * indentPx;
}

/** Full SVG outline path through all items (for the dim + highlighted stroke). */
function buildOutlinePath(
  items: TocItem[],
  itemH: number,
  gapH: number,
  strokeXBase: number,
  indentPx: number
): string {
  let d = "";
  let runningY = 0;

  for (let i = 0; i < items.length; i++) {
    const offsetX = itemOffsetX(items[i].depth, strokeXBase, indentPx);
    const topY = runningY;
    const bottomY = topY + itemH;

    if (i === 0) {
      d += `M ${offsetX} ${topY} L ${offsetX} ${bottomY}`;
    } else {
      const upperOffsetX = itemOffsetX(
        items[i - 1].depth,
        strokeXBase,
        indentPx
      );
      const upperBottomY = topY; // top of gap
      // cubic Bezier through the gap
      d += ` C ${upperOffsetX} ${upperBottomY + gapH - 4} ${offsetX} ${upperBottomY + 4} ${offsetX} ${upperBottomY + gapH}`;
      d += ` L ${offsetX} ${bottomY}`;
    }

    runningY = bottomY + gapH;
  }
  return d;
}

/** Compute top-Y for item index */
function itemTopY(index: number, itemH: number, gapH: number) {
  return index * (itemH + gapH);
}

/* ------------------------------------------------------------------ */
/*  Curved TOC Component                                               */
/* ------------------------------------------------------------------ */

export default function CurvedToc({
  items,
  activeIndex,
  onSelect,
  className,
  indentPx = DEFAULT_INDENT_PX,
  itemHeight = DEFAULT_ITEM_H,
  gapHeight = DEFAULT_GAP_H,
  strokeXBase = DEFAULT_STROKE_X_BASE,
  width = DEFAULT_WIDTH,
}: CurvedTocProps) {
  const totalH = items.length * itemHeight + (items.length - 1) * gapHeight;
  const outlinePath = useMemo(
    () =>
      buildOutlinePath(items, itemHeight, gapHeight, strokeXBase, indentPx),
    [items, itemHeight, gapHeight, strokeXBase, indentPx]
  );

  // clip-path rect for the active thumb
  const thumbTop = itemTopY(activeIndex, itemHeight, gapHeight);
  const thumbBottom = thumbTop + itemHeight;
  const clipPath = `inset(${thumbTop}px 0 ${totalH - thumbBottom}px 0)`;

  // thumb box position
  const thumbBoxX = itemOffsetX(
    items[activeIndex].depth,
    strokeXBase,
    indentPx
  );

  return (
    <div
      className={`relative${className ? ` ${className}` : ""}`}
      style={{ height: totalH, width }}
    >
      {/* ---- Dim outline ---- */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={totalH}
      >
        <path
          d={outlinePath}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1.5}
        />
      </svg>

      {/* ---- Highlighted (clipped) outline ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath,
          transition: "clip-path 250ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        <svg width={width} height={totalH}>
          <path
            d={outlinePath}
            fill="none"
            stroke="#8162ff"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* ---- Thumb box (circle) ---- */}
      <div
        className="absolute w-[7px] h-[7px] rounded-full bg-[#8162ff] shadow-[0_0_6px_rgba(129,98,255,0.5)] pointer-events-none"
        style={{
          translate: `${thumbBoxX - 3}px ${thumbTop - 3}px`,
          transition: "translate 250ms cubic-bezier(.4,0,.2,1)",
        }}
      />

      {/* ---- Labels ---- */}
      {items.map((item, i) => {
        const top = itemTopY(i, itemHeight, gapHeight);
        const isActive = i === activeIndex;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(i)}
            className="absolute flex items-center text-left transition-colors duration-200"
            style={{
              top,
              left: itemOffsetX(item.depth, strokeXBase, indentPx) + 12,
              height: itemHeight,
              color: isActive ? "#1f2937" : "#9ca3af",
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <span className="text-[13px] leading-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
