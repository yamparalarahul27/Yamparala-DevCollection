"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./EarnButton.module.css";

export type EarnButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

function FilledEarnIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 72 72">
      <path
        d="M16.3 41.9c5.3 0 8.8-1.9 13.5-5.5 3-2.3 5.3-3 8.1-2.5 3.1.6 4 3.2 1.7 5.7l-6 6.6c-1.2 1.3-.2 3.4 1.6 3.3l11.1-.7c3-.2 5.8-1.4 8-3.5l5.9-5.5c2.1-1.9 4.9-1.5 6 .6 1 1.8.6 3.7-1.1 5.3L52.7 57.4a17.8 17.8 0 0 1-12.2 4.8H24.6c-3.1 0-6.1-.6-8.9-1.8L7.6 57V43.2c2.6-.8 5.6-1.3 8.7-1.3Z"
        fill="currentColor"
      />
      <path
        d="M23.7 13.4c5.8-5.6 13.3-4.4 18.3.3-5.7 1.3-10 6.4-10 12.5 0 2.3.6 4.5 1.7 6.4-7.4-.8-12.8-6.6-12.8-13.6 0-2 .7-3.9 2.8-5.6Z"
        fill="currentColor"
      />
      <path
        d="M48.1 36.9c6.3 0 11.4-5.1 11.4-11.4s-5.1-11.4-11.4-11.4-11.4 5.1-11.4 11.4 5.1 11.4 11.4 11.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

const EarnButton = forwardRef<HTMLButtonElement, EarnButtonProps>(
  function EarnButton(
    { children = "Earn", className, type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={[styles.button, className].filter(Boolean).join(" ")}
        {...props}
      >
        <FilledEarnIcon className={styles.icon} />
        <span className={styles.label}>{children}</span>
      </button>
    );
  },
);

export default EarnButton;
