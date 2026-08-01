"use client";

import ComponentShell from "@/components/ComponentShell";
import ChainSelector, { defaultDemoChains } from "@/components/ChainSelector";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Chain Selector component.`;

const PROMPT_CONTENT = `Build a horizontal chain-selector pill bar with a clear props API:
- Accept chains: { id, label, icon }[]
- Support controlled value / uncontrolled defaultValue + onChange
- Active chain shows label + accent underline; inactive shows icon with accessible label
- Keep the bar scrollable on small screens without a fixed min-width trap`;

export default function ChainSelectorPage() {
  return (
    <ComponentShell
      title="Chain Selector"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <ChainSelector chains={defaultDemoChains} defaultValue="ethereum" />
    </ComponentShell>
  );
}
