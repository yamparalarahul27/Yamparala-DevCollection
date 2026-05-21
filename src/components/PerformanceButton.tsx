"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./PerformanceButton.module.css";

export type PerformanceButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  isLeaving?: boolean;
};

const PerformanceButton = forwardRef<HTMLButtonElement, PerformanceButtonProps>(
  function PerformanceButton(
    { children, className, isLeaving = false, type = "button", style, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={[styles.button, className].filter(Boolean).join(" ")}
        style={style}
        {...rest}
      >
        <span
          className={[styles.inner, isLeaving ? styles.innerLeaving : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </span>
      </button>
    );
  },
);

export default PerformanceButton;
