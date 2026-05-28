"use client";

import { useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import PerformanceButton from "@/components/PerformanceButton";

const codeContent = `Use Copy Code to load the current local source for the performance button.`;
const promptContent = `Recreate the dark pill-shaped Subscribe button from performance.dev:
- 56px tall, 138px min-width, 32px horizontal padding, 999px border-radius
- Background rgb(10,13,26), white text, 16px / 500 weight
- Two-layer box-shadow (close + long ambient)
- Inset gradient ring via ::after pseudo-element with mask trick (top/bottom light, middle dark)
- Hover/active background rgb(22,27,48) with 0.2s / 0.1s transition
- Inner span animates opacity + 6px blur during leaving state.`;

export default function PerformanceButtonPage() {
  const [leaving, setLeaving] = useState(false);

  return (
    <ComponentShell
      title="Performance Button"
      codeContent={codeContent}
      promptContent={promptContent}
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-12 px-2 py-6">
        {/* Hero — exact dimensions from performance.dev */}
        <PerformanceButton style={{ minWidth: 138 }}>Subscribe</PerformanceButton>

        {/* In a faux newsletter form, for context */}
        <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 bg-transparent px-4 text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
          <PerformanceButton style={{ minWidth: 138 }}>Subscribe</PerformanceButton>
        </div>

        {/* Variations */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500">Variants</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PerformanceButton>Continue</PerformanceButton>
            <PerformanceButton style={{ minWidth: 180 }}>Get started</PerformanceButton>
            <PerformanceButton disabled>Disabled</PerformanceButton>
          </div>
        </div>

        {/* Leaving-state demo */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500">
            Label transition (click to toggle blur-out)
          </p>
          <PerformanceButton
            isLeaving={leaving}
            onClick={() => setLeaving((v) => !v)}
            style={{ minWidth: 138 }}
          >
            {leaving ? "Leaving…" : "Subscribe"}
          </PerformanceButton>
        </div>
      </div>
    </ComponentShell>
  );
}
