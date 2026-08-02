"use client";

import { forwardRef, type ReactNode } from "react";
import { Eye, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";
import GlossyButton, {
  type GlossyButtonProps,
} from "@/components/GlossyButton";
import styles from "./FixActionButtons.module.css";

export type FixActionButtonProps = Omit<GlossyButtonProps, "tone"> & {
  children?: ReactNode;
  variant: "apply" | "preview";
};

export const FixActionButton = forwardRef<HTMLButtonElement, FixActionButtonProps>(
  function FixActionButton(
    { children, className, leading, size = "lg", variant, ...props },
    ref,
  ) {
    const isApply = variant === "apply";
    const Icon = isApply ? Hammer : Eye;

    return (
      <GlossyButton
        ref={ref}
        className={cn(styles.fixButton, className)}
        leading={leading ?? <Icon aria-hidden="true" />}
        size={size}
        tone={isApply ? "mint" : "dark"}
        {...props}
      >
        {children ?? (isApply ? "Apply Fix" : "Preview Fix")}
      </GlossyButton>
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
