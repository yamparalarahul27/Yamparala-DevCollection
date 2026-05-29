"use client";

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
