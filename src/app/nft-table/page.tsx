"use client";

import ComponentShell from "@/components/ComponentShell";
import NftCollectionTable, {
  defaultDemoNftCollections,
} from "@/components/NftCollectionTable";

const CODE_CONTENT = `Use Copy Code to load the current local source for the NFT Collections Table component.`;

const PROMPT_CONTENT = `Add row-level swipe interactions to an NFT table:
- Accept rows via props with sort, theme, action, and bookmark callbacks.
- Drag left on a row to reveal Bookmark and activate it (unfilled star -> filled star with scale animation).
- Drag right on a row to reveal 3 actions on the left: News, Trade, and Alerts.
- Keep interactions per-row and responsive for both desktop and mobile.
- Keep light theme as default and include a dark-mode toggle.
- Add UI credit to https://x.com/rndr_realm.`;

export default function NftTablePage() {
  return (
    <ComponentShell
      title="NFT Collections Table"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <NftCollectionTable rows={defaultDemoNftCollections} />
    </ComponentShell>
  );
}
