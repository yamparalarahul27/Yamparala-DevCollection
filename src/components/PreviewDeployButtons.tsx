"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { CircleCheck, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./PreviewDeployButtons.module.css";

export type PreviewDeployButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "preview" | "deploy";
  children?: ReactNode;
};

export const PreviewDeployButton = forwardRef<
  HTMLButtonElement,
  PreviewDeployButtonProps
>(function PreviewDeployButton(
  { children, className, type = "button", variant, ...props },
  ref,
) {
  const isPreview = variant === "preview";
  const Icon = isPreview ? Eye : CircleCheck;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        styles.button,
        isPreview ? styles.preview : styles.deploy,
        className,
      )}
      {...props}
    >
      <Icon
        aria-hidden="true"
        className={cn(styles.icon, isPreview && styles.previewIcon)}
      />
      <span>{children ?? (isPreview ? "Preview" : "Deploy")}</span>
    </button>
  );
});

export default function PreviewDeployButtons() {
  return (
    <div className={styles.row}>
      <PreviewDeployButton variant="preview" />
      <PreviewDeployButton variant="deploy" />
    </div>
  );
}
