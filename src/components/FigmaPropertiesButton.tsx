"use client";

import { forwardRef } from "react";
import GlossyButton, {
  type GlossyButtonProps,
} from "@/components/GlossyButton";

export type FigmaPropertiesButtonProps = Omit<GlossyButtonProps, "tone">;

const FigmaPropertiesButton = forwardRef<
  HTMLButtonElement,
  FigmaPropertiesButtonProps
>(function FigmaPropertiesButton(
  { children = "Continue", size = "md", ...props },
  ref,
) {
  return (
    <GlossyButton ref={ref} size={size} tone="dark" {...props}>
      {children}
    </GlossyButton>
  );
});

export default FigmaPropertiesButton;
