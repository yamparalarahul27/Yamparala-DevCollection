"use client";

import ComponentShell from "@/components/ComponentShell";
import PnlCalendar from "@/components/PnlCalendar";

const CODE_CONTENT = `Use Copy Code to load the current local source for the PnL Calendar component.`;

const PROMPT_CONTENT = `Build a compact, light-theme PnL Calendar component in Next.js.

Requirements:
- Show three months per page with a compact monthly heatmap layout.
- Header includes title and pagination indicator with previous/next arrows.
- Each day cell displays day number plus formatted PnL value.
- Positive PnL uses soft green tones, negative uses soft red tones, and future/unavailable days use muted gray.
- Expose props for months, page/pageCount, onPageChange, and onDayClick.
- Make the layout responsive: one column on mobile, two on tablets, three on desktop.`;

export default function PnlCalendarPage() {
  return (
    <ComponentShell
      title="PnL Calendar"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <PnlCalendar />
    </ComponentShell>
  );
}
