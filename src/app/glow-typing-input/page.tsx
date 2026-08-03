"use client";

import { useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import GlowTypingInput from "@/components/GlowTypingInput";
import PropsPlayground from "@/components/PropsPlayground";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Glow Typing Input component.`;

const PROMPT_CONTENT = `Create a reusable glowing typing input inspired by the shared image:
- Large dark pill surface with a muted plus icon on the left.
- Real editable input where the user can type.
- Hide the native caret and render a custom gradient caret with warm top, white center, violet bottom glow, and soft bloom under the caret.
- The custom caret should follow the input selection/cursor position while typing or clicking in the text.
- Support controlled and uncontrolled value usage, accessible label, focus/hover states, mobile sizing, and reduced-motion-safe CSS.`;

export default function GlowTypingInputPage() {
  const [value, setValue] = useState("Let");
  const [placeholder, setPlaceholder] = useState("Type");
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentShell
      title="Glow Typing Input"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <PropsPlayground
        description="Controlled value, placeholder, and disabled state."
        stageClassName="bg-black shadow-[0_34px_120px_rgba(0,0,0,0.28)]"
        controls={[
          {
            type: "text",
            id: "value",
            label: "value",
            value,
            onChange: setValue,
          },
          {
            type: "text",
            id: "placeholder",
            label: "placeholder",
            value: placeholder,
            onChange: setPlaceholder,
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
        <div className="w-full max-w-xl">
          <GlowTypingInput
            disabled={disabled}
            onValueChange={setValue}
            placeholder={placeholder}
            value={value}
          />
        </div>
      </PropsPlayground>
    </ComponentShell>
  );
}
