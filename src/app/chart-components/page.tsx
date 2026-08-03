"use client";

import { useState, type ReactNode } from "react";
import ComponentShell from "@/components/ComponentShell";
import PropsPlayground from "@/components/PropsPlayground";
import {
  NeonAppreciationBarChart,
  RadialGrowthHaloChart,
  SegmentedGrowthDonutChart,
  WalletAllocationChart,
} from "@/components/FinancialCharts";

const CODE_CONTENT = `Use Copy Code to load the current local source for the financial chart components.`;

const PROMPT_CONTENT = `Create four polished financial chart components inspired by the shared references:
- A dark segmented donut chart with separated arcs, percentage labels, dotted inner guide ring, center title/meta, and a glowing active purple slice.
- A cropped radial growth chart with chunky 3D purple arc segments, top title/value, inner dotted guide ring, and a lower Back affordance.
- A neon black bar chart with 3D green/lime/purple bars, labels, dotted baseline, and timeframe buttons.
- A light wallet allocation donut with rounded pastel segments, colored outer rails, centered wallet count, and a large finance legend.
- Each chart should accept typed data props, calculate its arcs/bars from those values, and support hover, click, and keyboard focus inspection.
- Use copy-paste friendly React + CSS modules with responsive sizing and reduced-motion-safe visual treatment.`;

type ChartId = "donut" | "halo" | "bars" | "wallet";

const charts: Record<
  ChartId,
  { label: string; stageClassName: string; node: ReactNode }
> = {
  donut: {
    label: "SegmentedGrowthDonutChart",
    stageClassName: "bg-[#0b0c10]",
    node: <SegmentedGrowthDonutChart />,
  },
  halo: {
    label: "RadialGrowthHaloChart",
    stageClassName: "bg-[#0b0c10]",
    node: <RadialGrowthHaloChart />,
  },
  bars: {
    label: "NeonAppreciationBarChart",
    stageClassName: "bg-[#050505]",
    node: <NeonAppreciationBarChart />,
  },
  wallet: {
    label: "WalletAllocationChart",
    stageClassName: "bg-[#f5f6f8]",
    node: <WalletAllocationChart />,
  },
};

export default function ChartComponentsPage() {
  const [chartId, setChartId] = useState<ChartId>("donut");
  const active = charts[chartId];

  return (
    <ComponentShell
      title="Chart Components"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <PropsPlayground
        description="Focus one chart export. Open Copy Code for the full FinancialCharts module."
        stageClassName={active.stageClassName}
        controls={[
          {
            type: "select",
            id: "chart",
            label: "component",
            value: chartId,
            options: [
              { label: "Segmented donut", value: "donut" },
              { label: "Radial halo", value: "halo" },
              { label: "Neon bars", value: "bars" },
              { label: "Wallet allocation", value: "wallet" },
            ],
            onChange: (value) => setChartId(value as ChartId),
          },
        ]}
      >
        <div className="w-full max-w-md scale-[0.92] sm:scale-100">{active.node}</div>
      </PropsPlayground>
    </ComponentShell>
  );
}
