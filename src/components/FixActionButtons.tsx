"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Eye, Hammer } from "lucide-react";
import styles from "./FixActionButtons.module.css";

type FixActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant: "apply" | "preview";
};

export function FixActionButton({
  children,
  className,
  type = "button",
  variant,
  ...props
}: FixActionButtonProps) {
  const isApply = variant === "apply";
  const Icon = isApply ? Hammer : Eye;

  return (
    <button
      type={type}
      className={[
        styles.button,
        isApply ? styles.apply : styles.preview,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <Icon
        aria-hidden="true"
        className={[styles.icon, isApply ? styles.applyIcon : styles.previewIcon]
          .filter(Boolean)
          .join(" ")}
      />
      <span>{children ?? (isApply ? "Apply Fix" : "Preview Fix")}</span>
    </button>
  );
}

export default function FixActionButtons() {
  return (
    <div className={styles.stack}>
      <FixActionButton variant="apply" />
      <FixActionButton variant="preview" />
    </div>
  );
}
