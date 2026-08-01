"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./BuyNowGlowButton.module.css";

export type BuyNowGlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

const BuyNowGlowButton = forwardRef<HTMLButtonElement, BuyNowGlowButtonProps>(
  function BuyNowGlowButton(
    { children = "Buy Now", className, type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(styles.button, className)}
        {...props}
      >
        <span aria-hidden="true" className={styles.icon}>
          $
        </span>
        <span className={styles.label}>{children}</span>
      </button>
    );
  },
);

export default BuyNowGlowButton;
