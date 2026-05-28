"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import styles from "./BuyNowGlowButton.module.css";

export type BuyNowGlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const BuyNowGlowButton = forwardRef<HTMLButtonElement, BuyNowGlowButtonProps>(
  function BuyNowGlowButton({ className, type = "button", ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={[styles.button, className].filter(Boolean).join(" ")}
        {...props}
      >
        <span aria-hidden="true" className={styles.icon}>
          $
        </span>
        <span className={styles.label}>Buy Now</span>
      </button>
    );
  },
);

export default BuyNowGlowButton;
