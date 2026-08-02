"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import styles from "./GlossyButton.module.css";

export type GlossyButtonTone =
  | "light"
  | "dark"
  | "orange"
  | "lime"
  | "purple"
  | "green"
  | "ink"
  | "mint"
  | "steel";

export type GlossyButtonSize = "sm" | "md" | "lg" | "hero";
export type GlossyButtonShape = "rounded" | "pill";

export type GlossyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  tone?: GlossyButtonTone;
  size?: GlossyButtonSize;
  shape?: GlossyButtonShape;
};

const toneClass: Record<GlossyButtonTone, string> = {
  light: styles.toneLight,
  dark: styles.toneDark,
  orange: styles.toneOrange,
  lime: styles.toneLime,
  purple: styles.tonePurple,
  green: styles.toneGreen,
  ink: styles.toneInk,
  mint: styles.toneMint,
  steel: styles.toneSteel,
};

const sizeClass: Record<GlossyButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  hero: styles.sizeHero,
};

const GlossyButton = forwardRef<HTMLButtonElement, GlossyButtonProps>(
  function GlossyButton(
    {
      children = "Continue",
      className,
      leading,
      shape = "rounded",
      size = "md",
      tone = "dark",
      trailing,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          styles.button,
          toneClass[tone],
          sizeClass[size],
          shape === "pill" && styles.shapePill,
          className,
        )}
        data-shape={shape}
        data-size={size}
        data-tone={tone}
        {...props}
      >
        {leading ? (
          <span aria-hidden="true" className={styles.leading}>
            {leading}
          </span>
        ) : null}
        <span className={styles.label}>{children}</span>
        {trailing ? (
          <span aria-hidden="true" className={styles.trailing}>
            {trailing}
          </span>
        ) : null}
      </button>
    );
  },
);

export default GlossyButton;
