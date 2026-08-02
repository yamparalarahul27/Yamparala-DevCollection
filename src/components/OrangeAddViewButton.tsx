"use client";

import { forwardRef } from "react";
import GlossyButton, {
  type GlossyButtonProps,
} from "@/components/GlossyButton";

export type OrangeAddViewButtonProps = Omit<GlossyButtonProps, "tone">;

const OrangeAddViewButton = forwardRef<
  HTMLButtonElement,
  OrangeAddViewButtonProps
>(function OrangeAddViewButton(
  { children = "Add View", size = "md", ...props },
  ref,
) {
  return (
    <GlossyButton ref={ref} size={size} tone="orange" {...props}>
      {children}
    </GlossyButton>
  );
});

export default OrangeAddViewButton;
export { OrangeAddViewButton };
