"use client";

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { Eye, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./FixActionButtons.module.css";

export type FixActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant: "apply" | "preview";
};

export const FixActionButton = forwardRef<HTMLButtonElement, FixActionButtonProps>(
  function FixActionButton(
    { children, className, type = "button", variant, ...props },
    ref,
  ) {
    const isApply = variant === "apply";
    const Icon = isApply ? Hammer : Eye;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          styles.button,
          isApply ? styles.apply : styles.preview,
          className,
        )}
        {...props}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            styles.icon,
            isApply ? styles.applyIcon : styles.previewIcon,
          )}
        />
        <span>{children ?? (isApply ? "Apply Fix" : "Preview Fix")}</span>
      </button>
    );
  },
);

export default function FixActionButtons() {
  return (
    <div className={styles.stack}>
      <FixActionButton variant="apply" />
      <FixActionButton variant="preview" />
    </div>
  );
}
