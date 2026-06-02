import ComponentShell from "@/components/ComponentShell";
import FinancialChartsShowcase from "@/components/FinancialCharts";

const CODE_CONTENT = `Use Copy Code to load the current local source for the financial chart components.`;

const PROMPT_CONTENT = `Create four polished financial chart components inspired by the shared references:
- A dark segmented donut chart with separated arcs, percentage labels, dotted inner guide ring, center title/meta, and a glowing active purple slice.
- A cropped radial growth chart with chunky 3D purple arc segments, top title/value, inner dotted guide ring, and a lower Back affordance.
- A neon black bar chart with 3D green/lime/purple bars, labels, dotted baseline, and timeframe buttons.
- A light wallet allocation donut with rounded pastel segments, colored outer rails, centered wallet count, and a large finance legend.
- Each chart should accept typed data props, calculate its arcs/bars from those values, and support hover, click, and keyboard focus inspection.
- Use copy-paste friendly React + CSS modules with responsive sizing and reduced-motion-safe visual treatment.`;

export default function ChartComponentsPage() {
  return (
    <ComponentShell
      title="Chart Components"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <FinancialChartsShowcase />
    </ComponentShell>
  );
}
