"use client";

import ComponentShell from "@/components/ComponentShell";
import MathCurveLoaders from "@/components/MathCurveLoaders";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Math Curve Loaders component.`;

const PROMPT_CONTENT = `Build a Math Curve Loaders gallery component in Next.js with animated canvas-based loading animations based on mathematical curves.

Requirements:
- Display 6 mathematical curve loaders: Rose Curve, Lissajous, Hypotrochoid, Cardioid, Cassini Oval, and Fourier Path
- Each loader is drawn on an HTML Canvas using requestAnimationFrame for smooth 60fps animation
- Particles trail along the mathematical curve path with fading opacity for a glowing trail effect
- Include a pill-bar selector to switch between curve types
- Show the active curve's mathematical formula and description
- The selected curve animates in a large canvas preview area
- Show all curves in a small grid below for quick comparison
- Use distinct colors per curve: purple for Rose, pink for Lissajous, green for Hypotrochoid, orange for Cardioid, blue for Cassini, violet for Fourier
- Device pixel ratio aware canvas rendering for crisp output
- Credit: https://x.com/xin_pai88825?s=21
- Inspired by: https://github.com/paidax01/math-curve-loaders`;

export default function MathCurveLoadersPage() {
  return (
    <ComponentShell
      title="Math Curve Loaders"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <MathCurveLoaders />
    </ComponentShell>
  );
}
