"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ComponentShell from "@/components/ComponentShell";
import GlossyButton, {
  type GlossyButtonSize,
  type GlossyButtonTone,
} from "@/components/GlossyButton";
import PropsPlayground from "@/components/PropsPlayground";

const CODE_CONTENT = `Use Copy Code to load the current local source for GlossyButton.`;

const PROMPT_CONTENT = `Create a shared GlossyButton primitive with:
- tone: light | dark | orange | lime | purple
- size: sm | md | lg | hero
- children, leading, trailing, forwardRef, disabled
- shared inset highlight / soft shadow tokens so one-off CTA skins can wrap it`;

const stageByTone: Record<GlossyButtonTone, string> = {
  light: "bg-[#f3f4f6]",
  dark: "bg-[#111827]",
  orange: "bg-[#fff8f2]",
  lime: "bg-[#f7ffe8]",
  purple: "bg-[#efeddb]",
};

export default function GlossyButtonPage() {
  const [tone, setTone] = useState<GlossyButtonTone>("dark");
  const [size, setSize] = useState<GlossyButtonSize>("md");
  const [label, setLabel] = useState("Continue");
  const [disabled, setDisabled] = useState(false);
  const [showLeading, setShowLeading] = useState(false);

  return (
    <ComponentShell
      title="Glossy Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <PropsPlayground
        description="Shared primitive behind the Experience button skins."
        stageClassName={stageByTone[tone]}
        controls={[
          {
            type: "select",
            id: "tone",
            label: "tone",
            value: tone,
            options: [
              { label: "light", value: "light" },
              { label: "dark", value: "dark" },
              { label: "orange", value: "orange" },
              { label: "lime", value: "lime" },
              { label: "purple", value: "purple" },
            ],
            onChange: (value) => setTone(value as GlossyButtonTone),
          },
          {
            type: "select",
            id: "size",
            label: "size",
            value: size,
            options: [
              { label: "sm", value: "sm" },
              { label: "md", value: "md" },
              { label: "lg", value: "lg" },
              { label: "hero", value: "hero" },
            ],
            onChange: (value) => setSize(value as GlossyButtonSize),
          },
          {
            type: "text",
            id: "label",
            label: "children",
            value: label,
            onChange: setLabel,
          },
          {
            type: "toggle",
            id: "leading",
            label: "leading icon",
            value: showLeading,
            onChange: setShowLeading,
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
        <GlossyButton
          disabled={disabled}
          leading={showLeading ? <Plus aria-hidden="true" /> : undefined}
          size={size}
          tone={tone}
        >
          {label || "Continue"}
        </GlossyButton>
      </PropsPlayground>
    </ComponentShell>
  );
}
