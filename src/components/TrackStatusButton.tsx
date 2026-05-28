"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
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
      className={[styles.button, className].filter(Boolean).join(" ")}
      {...props}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
});

export default TrackStatusButton;
