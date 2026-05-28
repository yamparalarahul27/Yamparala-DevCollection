"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./LightGradientButton.module.css";

export type LightGradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

const LightGradientButton = forwardRef<
  HTMLButtonElement,
  LightGradientButtonProps
>(function LightGradientButton(
  { children = "Open", className, type = "button", ...props },
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

export default LightGradientButton;
