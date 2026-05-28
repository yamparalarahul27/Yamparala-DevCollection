import ComponentShell from "@/components/ComponentShell";
import FigmaPropertiesButton from "@/components/FigmaPropertiesButton";

const CODE_CONTENT = `"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./FigmaPropertiesButton.module.css";

export type FigmaPropertiesButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
  };

const FigmaPropertiesButton = forwardRef<
  HTMLButtonElement,
  FigmaPropertiesButtonProps
>(function FigmaPropertiesButton(
  { children, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[styles.button, className].filter(Boolean).join(" ")}
      {...props}
    >
      <span className={styles.content}>{children}</span>
    </button>
  );
});

export default FigmaPropertiesButton;

/* FigmaPropertiesButton.module.css */
.button {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  min-height: 44px;
  min-width: 132px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 10px;
  padding: 0 18px;
  background: linear-gradient(90deg, #323232 0%, #222222 100%);
  box-shadow:
    inset 0 0.5px 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 1.2px 0.35px #121212,
    0 2px 4px -1px rgba(13, 13, 13, 0.5),
    0 0 0 1px #333333;
  color: #f8fafc;
  cursor: pointer;
  font-family: var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  opacity: 1;
  transition:
    filter 160ms ease,
    transform 160ms ease;
  -webkit-tap-highlight-color: transparent;
}

.button:hover:not(:disabled) {
  filter: brightness(1.06);
}

.button:active:not(:disabled) {
  filter: brightness(0.98);
  transform: translateY(1px);
}

.button:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: 3px;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  position: relative;
  z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }

  .button:active:not(:disabled) {
    transform: none;
  }
}`;

const PROMPT_CONTENT = `Create a reusable Next.js button component from these Figma appearance properties:
- 100% opacity
- 10px corner radius
- Linear dark gradient from #323232 at 0% to #222222 at 100%
- Inner shadow: 0 0.5px 1px 0 rgba(255,255,255,0.15)
- Inner shadow: 0 -1px 1.2px 0.35px #121212
- Drop shadow: 0 2px 4px -1px rgba(13,13,13,0.5)
- Drop shadow/stroke: 0 0 0 1px #333333
- Use a real button element, keep the hit target at least 40px tall, add focus-visible styling, and respect reduced motion.`;

export default function FigmaPropertiesButtonPage() {
  return (
    <ComponentShell
      title="Figma Properties Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-10 px-4 py-8">
        <div className="flex min-h-[180px] w-full items-center justify-center rounded-[22px] border border-black/[0.04] bg-white shadow-sm">
          <FigmaPropertiesButton>Continue</FigmaPropertiesButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <FigmaPropertiesButton>Confirm</FigmaPropertiesButton>
          <FigmaPropertiesButton>Save changes</FigmaPropertiesButton>
          <FigmaPropertiesButton disabled>Disabled</FigmaPropertiesButton>
        </div>
      </div>
    </ComponentShell>
  );
}
