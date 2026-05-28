"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ComponentType,
} from "react";
import { ArrowRight, Plus, type LucideProps } from "lucide-react";
import styles from "./GlossyIconButtons.module.css";

export type GlossyIconButtonTone = "purple" | "black" | "green";

type GlossyIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ComponentType<LucideProps>;
  tone?: GlossyIconButtonTone;
};

function FilledSaveIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M5.25 3.5h11.7l1.8 1.8v15.2H5.25V3.5Zm3.1 1.8v5.25h7.3V5.3h-1.75v3.5h-3.8V5.3H8.35Zm.2 9.05v4.25h6.9v-4.25h-6.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

const toneIconMap: Record<GlossyIconButtonTone, ComponentType<LucideProps>> = {
  purple: ArrowRight,
  black: Plus,
  green: FilledSaveIcon,
};

export const GlossyIconButton = forwardRef<
  HTMLButtonElement,
  GlossyIconButtonProps
>(function GlossyIconButton(
  { children = "Button", className, icon, tone = "purple", type = "button", ...props },
  ref,
) {
  const Icon = icon ?? toneIconMap[tone];

  return (
    <button
      ref={ref}
      type={type}
      className={[styles.button, styles[tone], className].filter(Boolean).join(" ")}
      {...props}
    >
      {tone === "purple" ? null : <Icon aria-hidden="true" className={styles.icon} />}
      <span className={styles.label}>{children}</span>
      {tone === "purple" ? <Icon aria-hidden="true" className={styles.icon} /> : null}
    </button>
  );
});

export default function GlossyIconButtonStack() {
  return (
    <div className={styles.stack}>
      <GlossyIconButton tone="purple">Button</GlossyIconButton>
      <GlossyIconButton tone="black">Button</GlossyIconButton>
      <GlossyIconButton tone="green">Button</GlossyIconButton>
    </div>
  );
}
