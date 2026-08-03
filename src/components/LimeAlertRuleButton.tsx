"use client";

import { forwardRef } from "react";
import { Plus } from "lucide-react";
import GlossyButton, {
  type GlossyButtonProps,
} from "@/components/GlossyButton";

export type LimeAlertRuleButtonProps = Omit<GlossyButtonProps, "tone">;

const LimeAlertRuleButton = forwardRef<
  HTMLButtonElement,
  LimeAlertRuleButtonProps
>(function LimeAlertRuleButton(
  {
    children = "Add Alert Rule",
    leading = <Plus aria-hidden="true" />,
    size = "lg",
    ...props
  },
  ref,
) {
  return (
    <GlossyButton
      ref={ref}
      leading={leading}
      size={size}
      tone="lime"
      {...props}
    >
      {children}
    </GlossyButton>
  );
});

export default LimeAlertRuleButton;
