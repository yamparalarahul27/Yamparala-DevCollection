"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ComponentShell from "@/components/ComponentShell";
import GlossyButton, {
  type GlossyButtonShape,
  type GlossyButtonSize,
  type GlossyButtonTone,
} from "@/components/GlossyButton";
import PropsPlayground from "@/components/PropsPlayground";

const CODE_CONTENT = `Use Copy Code to load the current local source for GlossyButton.`;

const PROMPT_CONTENT = `Create a shared GlossyButton primitive with:
- tone: light | dark | orange | lime | purple | green | ink | mint | steel
- size: sm | md | lg | hero
- shape: rounded | pill
- children, leading, trailing, forwardRef, disabled
- shared inset highlight / soft shadow tokens so one-off CTA skins can wrap it`;

const stageByTone: Record<GlossyButtonTone, string> = {
  light: "bg-[#f3f4f6]",
  dark: "bg-[#111827]",
  orange: "bg-[#fff8f2]",
  lime: "bg-[#f7ffe8]",
  purple: "bg-[#efeddb]",
  green: "bg-[#efeddb]",
  ink: "bg-[#f4f6fb]",
  mint: "bg-[#171823]",
  steel: "bg-[#f7f7f8]",
};

const tones: GlossyButtonTone[] = [
  "light",
  "dark",
  "orange",
  "lime",
  "purple",
  "green",
  "ink",
  "mint",
  "steel",
];

export default function GlossyButtonPage() {
  const [tone, setTone] = useState<GlossyButtonTone>("dark");
  const [size, setSize] = useState<GlossyButtonSize>("md");
  const [shape, setShape] = useState<GlossyButtonShape>("rounded");
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
        description="Shared primitive behind Experience skins and consolidated specialty CTAs."
        stageClassName={stageByTone[tone]}
        controls={[
          {
            type: "select",
            id: "tone",
            label: "tone",
            value: tone,
            options: tones.map((value) => ({ label: value, value })),
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
            type: "select",
            id: "shape",
            label: "shape",
            value: shape,
            options: [
              { label: "rounded", value: "rounded" },
              { label: "pill", value: "pill" },
            ],
            onChange: (value) => setShape(value as GlossyButtonShape),
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
          shape={shape}
          size={size}
          tone={tone}
        >
          {label || "Continue"}
        </GlossyButton>
      </PropsPlayground>
    </ComponentShell>
  );
}
