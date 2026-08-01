"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./TrackStatusButton.module.css";

export type TrackStatusButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

const TrackStatusButton = forwardRef<
  HTMLButtonElement,
  TrackStatusButtonProps
>(function TrackStatusButton(
  { children = "Track Status", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.button, className)}
      {...props}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
});

export default TrackStatusButton;
