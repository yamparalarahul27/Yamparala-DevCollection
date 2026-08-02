"use client";

import { forwardRef, type ReactNode } from "react";
import { CircleCheck, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import GlossyButton, {
  type GlossyButtonProps,
} from "@/components/GlossyButton";
import styles from "./PreviewDeployButtons.module.css";

export type PreviewDeployButtonProps = Omit<GlossyButtonProps, "tone"> & {
  variant: "preview" | "deploy";
  children?: ReactNode;
};

export const PreviewDeployButton = forwardRef<
  HTMLButtonElement,
  PreviewDeployButtonProps
>(function PreviewDeployButton(
  { children, className, leading, size = "lg", variant, ...props },
  ref,
) {
  const isPreview = variant === "preview";
  const Icon = isPreview ? Eye : CircleCheck;

  return (
    <GlossyButton
      ref={ref}
      className={cn(styles.pairButton, className)}
      leading={leading ?? <Icon aria-hidden="true" />}
      size={size}
      tone={isPreview ? "light" : "steel"}
      {...props}
    >
      {children ?? (isPreview ? "Preview" : "Deploy")}
    </GlossyButton>
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
