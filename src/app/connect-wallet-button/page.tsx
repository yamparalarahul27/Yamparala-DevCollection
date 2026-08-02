"use client";

import { useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import PropsPlayground from "@/components/PropsPlayground";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Connect Wallet button component.`;

const PROMPT_CONTENT = `Create a compact Connect Wallet button inspired by the shared screenshot:
- Realistic web/mobile sizing, not oversized: around 260-294px wide and 54-58px tall.
- Cyan glassy face with subtle scanline/pixel texture and dark text.
- Dark square action block on the right with a dotted arrow/grid mark.
- Hover state brightens the cyan face, sweeps a sheen across the surface, and moves the dot arrow slightly to the right.
- Pressed state feels tactile with a small downward compression.
- Use a real button element, visible focus ring, disabled/connecting support, and reduced-motion-safe CSS.`;

type WalletState = "idle" | "connecting" | "connected";

export default function ConnectWalletButtonPage() {
  const [state, setState] = useState<WalletState>("idle");
  const [label, setLabel] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentShell
      title="Connect Wallet Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <PropsPlayground
        description="Exercise idle / connecting / connected states."
        stageClassName="bg-[#030b0f] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        controls={[
          {
            type: "select",
            id: "state",
            label: "state",
            value: state,
            options: [
              { label: "idle", value: "idle" },
              { label: "connecting", value: "connecting" },
              { label: "connected", value: "connected" },
            ],
            onChange: (value) => setState(value as WalletState),
          },
          {
            type: "text",
            id: "label",
            label: "label override",
            value: label,
            placeholder: "Uses state default when empty",
            onChange: setLabel,
          },
          {
            type: "toggle",
            id: "disabled",
            label: "disabled",
            value: disabled,
            onChange: setDisabled,
          },
        ]}
      >
        <ConnectWalletButton
          disabled={disabled}
          label={label || undefined}
          state={state}
        />
      </PropsPlayground>
    </ComponentShell>
  );
}
