"use client";

import { useMemo, useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import ChainSelector, { defaultDemoChains } from "@/components/ChainSelector";
import PropsPlayground from "@/components/PropsPlayground";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Chain Selector component.`;

const PROMPT_CONTENT = `Build a horizontal chain-selector pill bar with a clear props API:
- Accept chains: { id, label, icon }[]
- Support controlled value / uncontrolled defaultValue + onChange
- Active chain shows label + accent underline; inactive shows icon with accessible label
- Keep the bar scrollable on small screens without a fixed min-width trap`;

export default function ChainSelectorPage() {
  const [value, setValue] = useState("ethereum");
  const [showChevron, setShowChevron] = useState(true);
  const [compact, setCompact] = useState(false);

  const chains = useMemo(
    () => (compact ? defaultDemoChains.slice(0, 4) : defaultDemoChains),
    [compact],
  );

  return (
    <ComponentShell
      title="Chain Selector"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <PropsPlayground
        description="Controlled selection, chevron, and compact chain set."
        controls={[
          {
            type: "select",
            id: "value",
            label: "value",
            value,
            options: chains.map((chain) => ({
              label: chain.label,
              value: chain.id,
            })),
            onChange: setValue,
          },
          {
            type: "toggle",
            id: "chevron",
            label: "showChevron",
            value: showChevron,
            onChange: setShowChevron,
          },
          {
            type: "toggle",
            id: "compact",
            label: "compact (4 chains)",
            value: compact,
            onChange: setCompact,
          },
        ]}
      >
        <ChainSelector
          chains={chains}
          onChange={setValue}
          showChevron={showChevron}
          value={value}
        />
      </PropsPlayground>
    </ComponentShell>
  );
}
