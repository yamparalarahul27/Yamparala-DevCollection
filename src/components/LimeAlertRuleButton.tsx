"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Plus } from "lucide-react";
import styles from "./LimeAlertRuleButton.module.css";

export type LimeAlertRuleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

const LimeAlertRuleButton = forwardRef<
  HTMLButtonElement,
  LimeAlertRuleButtonProps
>(function LimeAlertRuleButton(
  { children = "Add Alert Rule", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[styles.button, className].filter(Boolean).join(" ")}
      {...props}
    >
      <Plus aria-hidden="true" className={styles.icon} />
      <span>{children}</span>
    </button>
  );
});

export default LimeAlertRuleButton;
