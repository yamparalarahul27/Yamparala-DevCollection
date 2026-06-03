"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import styles from "./ConnectWalletButton.module.css";

export type ConnectWalletButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  state?: "idle" | "connecting" | "connected";
};

const stateLabels = {
  connected: "Connected",
  connecting: "Connecting",
  idle: "Connect Wallet",
};

const dotPattern = Array.from({ length: 25 });

const ConnectWalletButton = forwardRef<HTMLButtonElement, ConnectWalletButtonProps>(
  function ConnectWalletButton(
    {
      children,
      className,
      disabled,
      label,
      state = "idle",
      type = "button",
      ...props
    },
    ref,
  ) {
    const isBusy = state === "connecting";

    return (
      <button
        aria-busy={isBusy || undefined}
        className={[styles.button, className].filter(Boolean).join(" ")}
        data-state={state}
        disabled={disabled || isBusy}
        ref={ref}
        type={type}
        {...props}
      >
        <span className={styles.label}>
          {children ?? label ?? stateLabels[state]}
        </span>
        <span aria-hidden="true" className={styles.actionBlock}>
          <span className={styles.dotGrid}>
            {dotPattern.map((_, index) => (
              <i key={index} />
            ))}
          </span>
        </span>
      </button>
    );
  },
);

export default ConnectWalletButton;
