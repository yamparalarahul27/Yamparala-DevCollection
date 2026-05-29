"use client";

import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type OrangeAddViewButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function OrangeAddViewButton({
  className,
  type = "button",
  ...props
}: OrangeAddViewButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "relative z-10 box-border inline-flex min-h-10 items-center justify-center rounded-xl border border-white/40 bg-orange-600 px-10 py-2.5 text-base font-normal leading-none tracking-[-0.02em] text-white",
        "shadow-[0_18px_36px_rgba(0,0,0,0.12),0_3px_6px_rgba(0,0,0,0.20),inset_0_0_6px_2px_rgba(255,255,255,0.24),0_0_0_1px_var(--color-orange-600)]",
        "transition-[filter,transform] duration-150 ease-out hover:brightness-105 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300 disabled:cursor-not-allowed disabled:opacity-55",
        className,
      )}
      {...props}
    >
      Add View
    </button>
  );
}
