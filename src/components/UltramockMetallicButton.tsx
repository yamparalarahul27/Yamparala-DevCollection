"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type PointerEvent,
} from "react";
import styles from "./UltramockMetallicButton.module.css";

type MetallicButtonStyle = CSSProperties & {
  "--mx"?: string;
  "--my"?: string;
};

export type UltramockMetallicButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement>;

const UltramockMetallicButton = forwardRef<
  HTMLButtonElement,
  UltramockMetallicButtonProps
>(function UltramockMetallicButton(
  {
    children = "Subscribe — $72/yr",
    className,
    onPointerLeave,
    onPointerMove,
    style,
    type = "button",
    ...props
  },
  ref,
) {
  function updatePointer(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(1, rect.width);
    const y = (event.clientY - rect.top) / Math.max(1, rect.height);

    event.currentTarget.style.setProperty("--mx", x.toFixed(3));
    event.currentTarget.style.setProperty("--my", y.toFixed(3));
    onPointerMove?.(event);
  }

  function resetPointer(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.setProperty("--mx", "0.5");
    event.currentTarget.style.setProperty("--my", "0.5");
    onPointerLeave?.(event);
  }

  return (
    <button
      className={[styles.button, className].filter(Boolean).join(" ")}
      onPointerLeave={resetPointer}
      onPointerMove={updatePointer}
      ref={ref}
      style={{ "--mx": "0.5", "--my": "0.5", ...style } as MetallicButtonStyle}
      type={type}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      <span aria-hidden="true" className={styles.sheen} />
      <span aria-hidden="true" className={styles.sparkles} />
    </button>
  );
});

export default UltramockMetallicButton;
