"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import GlossyButton, {
  type GlossyButtonProps,
} from "@/components/GlossyButton";
import styles from "./PerformanceButton.module.css";

export type PerformanceButtonProps = Omit<
  GlossyButtonProps,
  "tone" | "shape" | "size"
> & {
  isLeaving?: boolean;
  size?: GlossyButtonProps["size"];
};

const PerformanceButton = forwardRef<HTMLButtonElement, PerformanceButtonProps>(
  function PerformanceButton(
    {
      children = "Subscribe",
      className,
      isLeaving = false,
      size = "lg",
      ...props
    },
    ref,
  ) {
    return (
      <GlossyButton
        ref={ref}
        className={cn(styles.performance, isLeaving && styles.leaving, className)}
        shape="pill"
        size={size}
        tone="ink"
        {...props}
      >
        {children}
      </GlossyButton>
    );
  },
);

export default PerformanceButton;
