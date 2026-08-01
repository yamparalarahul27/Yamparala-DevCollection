"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CurveDrawFn = (
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
) => void;

export type CurveType = {
  id: string;
  label: string;
  description: string;
  color: string;
  draw: CurveDrawFn;
  formula: string;
};

export function rose(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.35;
  const k = 5;
  const trail = 120;
  for (let i = 0; i < trail; i++) {
    const angle = t * 4 + (i / trail) * Math.PI * 2;
    const rr = r * Math.cos(k * angle);
    const x = cx + rr * Math.cos(angle);
    const y = cy + rr * Math.sin(angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(129, 98, 255, ${alpha * 0.9})`;
    ctx.fill();
  }
}

export function lissajous(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  const a = 3;
  const b = 2;
  const rx = Math.min(w, h) * 0.35;
  const ry = Math.min(w, h) * 0.35;
  const trail = 150;
  for (let i = 0; i < trail; i++) {
    const angle = t * 3 + (i / trail) * Math.PI * 2;
    const x = cx + rx * Math.sin(a * angle + Math.PI / 2);
    const y = cy + ry * Math.sin(b * angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(236, 72, 153, ${alpha * 0.9})`;
    ctx.fill();
  }
}

export function hypotrochoid(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.25;
  const rr = R * 0.4;
  const d = R * 0.6;
  const trail = 180;
  for (let i = 0; i < trail; i++) {
    const angle = t * 2 + (i / trail) * Math.PI * 6;
    const x =
      cx + (R - rr) * Math.cos(angle) + d * Math.cos(((R - rr) / rr) * angle);
    const y =
      cy + (R - rr) * Math.sin(angle) - d * Math.sin(((R - rr) / rr) * angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 160, 107, ${alpha * 0.9})`;
    ctx.fill();
  }
}

export function cardioid(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  const a = Math.min(w, h) * 0.16;
  const trail = 120;
  for (let i = 0; i < trail; i++) {
    const angle = t * 3 + (i / trail) * Math.PI * 2;
    const r = 2 * a * (1 + Math.cos(angle));
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(229, 105, 16, ${alpha * 0.9})`;
    ctx.fill();
  }
}

export function cassiniOval(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  const a = Math.min(w, h) * 0.22;
  const b = a * (0.9 + 0.15 * Math.sin(t));
  const trail = 140;
  for (let i = 0; i < trail; i++) {
    const angle = t * 2.5 + (i / trail) * Math.PI * 2;
    const cos2 = Math.cos(2 * angle);
    const inner =
      a * a * cos2 +
      Math.sqrt(Math.abs(b * b * b * b - a * a * a * a * (1 - cos2 * cos2)));
    const r = Math.sqrt(Math.abs(inner));
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(29, 122, 252, ${alpha * 0.9})`;
    ctx.fill();
  }
}

export function fourierPath(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) * 0.3;
  const trail = 160;
  for (let i = 0; i < trail; i++) {
    const angle = t * 2 + (i / trail) * Math.PI * 2;
    const x =
      cx +
      scale *
        (0.5 * Math.cos(angle) +
          0.3 * Math.cos(3 * angle) +
          0.15 * Math.cos(5 * angle));
    const y =
      cy +
      scale *
        (0.5 * Math.sin(angle) +
          0.3 * Math.sin(3 * angle) +
          0.15 * Math.sin(7 * angle));
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124, 58, 237, ${alpha * 0.9})`;
    ctx.fill();
  }
}

export const CURVES: CurveType[] = [
  {
    id: "rose",
    label: "Rose Curve",
    description: "Petal-shaped polar curve",
    color: "#8162ff",
    draw: rose,
    formula: "r = cos(kθ)",
  },
  {
    id: "lissajous",
    label: "Lissajous",
    description: "Harmonic motion pattern",
    color: "#EC4899",
    draw: lissajous,
    formula: "x = sin(at+δ), y = sin(bt)",
  },
  {
    id: "hypotrochoid",
    label: "Hypotrochoid",
    description: "Spirograph-like curve",
    color: "#22A06B",
    draw: hypotrochoid,
    formula: "x = (R−r)cosθ + d·cos((R−r)θ/r)",
  },
  {
    id: "cardioid",
    label: "Cardioid",
    description: "Heart-shaped curve",
    color: "#E56910",
    draw: cardioid,
    formula: "r = 2a(1 + cosθ)",
  },
  {
    id: "cassini",
    label: "Cassini Oval",
    description: "Product-of-distances curve",
    color: "#1D7AFC",
    draw: cassiniOval,
    formula: "((x−a)²+y²)((x+a)²+y²) = b⁴",
  },
  {
    id: "fourier",
    label: "Fourier Path",
    description: "Superposed harmonics",
    color: "#7C3AED",
    draw: fourierPath,
    formula: "x = Σ aₙcos(nθ), y = Σ bₙsin(nθ)",
  },
];

export type MathCurveCanvasProps = {
  curve: CurveType;
  size?: number;
  className?: string;
};

export function MathCurveCanvas({
  curve,
  size = 180,
  className,
}: MathCurveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const startTime = performance.now();

    function animate(now: number) {
      const t = (now - startTime) / 1000;
      ctx!.clearRect(0, 0, size, size);
      curve.draw(ctx!, t, size, size);
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [curve, size]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("rounded-xl", className)}
      style={{ width: size, height: size, background: "#fafafa" }}
    />
  );
}

export type MathCurveLoadersProps = {
  curves?: CurveType[];
  /** Controlled active curve id. */
  activeId?: string;
  /** Uncontrolled initial active curve id. */
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
};

export default function MathCurveLoaders({
  curves = CURVES,
  activeId,
  defaultActiveId,
  onActiveChange,
  className,
}: MathCurveLoadersProps) {
  const firstId = curves[0]?.id ?? "";
  const [uncontrolledId, setUncontrolledId] = useState(
    defaultActiveId ?? firstId,
  );
  const selectedId = activeId ?? uncontrolledId;
  const selected =
    curves.find((c) => c.id === selectedId) ?? curves[0] ?? null;

  function selectCurve(id: string) {
    if (activeId === undefined) {
      setUncontrolledId(id);
    }
    onActiveChange?.(id);
  }

  if (!selected) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-[600px] flex-col items-center gap-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        {curves.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectCurve(c.id)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
              selected.id === c.id
                ? "text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
            style={
              selected.id === c.id ? { backgroundColor: c.color } : undefined
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="proteus-panel flex flex-col items-center gap-4 rounded-[16px] p-6">
        <MathCurveCanvas curve={selected} size={240} />
        <div className="text-center">
          <p className="text-[15px] font-semibold text-[#1f2937]">
            {selected.label}
          </p>
          <p className="mt-0.5 text-[12px] text-[#6b7280]">
            {selected.description}
          </p>
          <p
            className="mt-2 inline-block rounded-md px-3 py-1 font-mono text-[12px] font-medium"
            style={{
              backgroundColor: selected.color + "14",
              color: selected.color,
            }}
          >
            {selected.formula}
          </p>
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        {curves.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectCurve(c.id)}
            className={`proteus-panel flex flex-col items-center gap-2 rounded-[12px] p-3 transition-all ${
              selected.id === c.id ? "ring-2 ring-offset-1" : "hover:shadow-md"
            }`}
            style={
              selected.id === c.id
                ? { outlineColor: c.color, borderColor: c.color }
                : undefined
            }
          >
            <MathCurveCanvas curve={c} size={80} />
            <span className="text-[11px] font-medium text-[#374151]">
              {c.label}
            </span>
          </button>
        ))}
      </div>

      <p className="text-[11px] text-[#9ca3af]">
        Inspired by{" "}
        <a
          href="https://github.com/paidax01/math-curve-loaders"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#6b7280]"
        >
          math-curve-loaders
        </a>{" "}
        by{" "}
        <a
          href="https://x.com/xin_pai88825?s=21"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#6b7280]"
        >
          @xin_pai88825
        </a>
      </p>
    </div>
  );
}
