"use client";

import { forwardRef } from "react";
import GlossyButton, {
  type GlossyButtonProps,
} from "@/components/GlossyButton";

export type TrackStatusButtonProps = Omit<GlossyButtonProps, "tone" | "size"> & {
  size?: GlossyButtonProps["size"];
};

const TrackStatusButton = forwardRef<
  HTMLButtonElement,
  TrackStatusButtonProps
>(function TrackStatusButton(
  { children = "Track Status", size = "hero", ...props },
  ref,
) {
  return (
    <GlossyButton ref={ref} size={size} tone="purple" {...props}>
      {children}
    </GlossyButton>
  );
});

export default TrackStatusButton;
