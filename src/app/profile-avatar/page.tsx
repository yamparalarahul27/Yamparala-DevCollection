"use client";

import { useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import ProfileAvatar from "@/components/ProfileAvatar";
import PropsPlayground from "@/components/PropsPlayground";

const CODE_CONTENT = `Use Copy Code to load the current local source for ProfileAvatar.`;

const PROMPT_CONTENT = `Build a reusable ProfileAvatar with top/bottom gradient colors, optional dithering, size, label, and className.`;

export default function ProfileAvatarPlaygroundPage() {
  const [size, setSize] = useState("104");
  const [dithered, setDithered] = useState(true);
  const [top, setTop] = useState("#9b4ee8");
  const [bottom, setBottom] = useState("#ad73ee");
  const [label, setLabel] = useState("YR");

  return (
    <ComponentShell
      title="Profile Avatar"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <PropsPlayground
        description="Tune size, dithering, colors, and initials before opening the full Avatar Creator."
        controls={[
          {
            type: "select",
            id: "size",
            label: "size",
            value: size,
            options: [
              { label: "64", value: "64" },
              { label: "104", value: "104" },
              { label: "144", value: "144" },
              { label: "200", value: "200" },
            ],
            onChange: setSize,
          },
          {
            type: "toggle",
            id: "dithered",
            label: "dithered",
            value: dithered,
            onChange: setDithered,
          },
          {
            type: "text",
            id: "top",
            label: "top",
            value: top,
            onChange: setTop,
          },
          {
            type: "text",
            id: "bottom",
            label: "bottom",
            value: bottom,
            onChange: setBottom,
          },
          {
            type: "text",
            id: "label",
            label: "label / children",
            value: label,
            onChange: setLabel,
          },
        ]}
      >
        <ProfileAvatar
          bottom={bottom}
          dithered={dithered}
          label={label || "Avatar"}
          size={Number(size)}
          top={top}
        >
          {label}
        </ProfileAvatar>
      </PropsPlayground>

      <p className="mt-2 text-center text-[12px] text-[var(--text-secondary)]">
        Full builder with swatches lives at{" "}
        <a className="underline hover:text-[var(--foreground)]" href="/avatar-creator">
          /avatar-creator
        </a>
      </p>
    </ComponentShell>
  );
}
