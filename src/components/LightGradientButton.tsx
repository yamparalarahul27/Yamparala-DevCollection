"use client";

import { forwardRef } from "react";
import GlossyButton, {
  type GlossyButtonProps,
} from "@/components/GlossyButton";

export type LightGradientButtonProps = Omit<GlossyButtonProps, "tone">;

const LightGradientButton = forwardRef<
  HTMLButtonElement,
  LightGradientButtonProps
>(function LightGradientButton({ children = "Open", size = "md", ...props }, ref) {
  return (
    <GlossyButton ref={ref} size={size} tone="light" {...props}>
      {children}
    </GlossyButton>
  );
});

export default LightGradientButton;
