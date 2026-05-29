"use client";

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react";
import { Check } from "lucide-react";
import styles from "./FunLoadingButton.module.css";

type ButtonPhase = "idle" | "processing" | "completed" | "clearing";

const PHASE_DELAYS = {
  processing: 3200,
  completed: 1250,
  clearing: 650,
};

export type FunLoadingButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  completedLabel?: string;
  idleLabel?: string;
  processingLabel?: string;
};

export default function FunLoadingButton({
  className,
  completedLabel = "Completed",
  disabled,
  idleLabel = "Withdraw",
  onClick,
  processingLabel = "Processing",
  type = "button",
  ...props
}: FunLoadingButtonProps) {
  const [phase, setPhase] = useState<ButtonPhase>("idle");
  const timeoutsRef = useRef<number[]>([]);
  const isAnimating = phase !== "idle";

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(window.clearTimeout);
    };
  }, []);

  function startCycle() {
    timeoutsRef.current.forEach(window.clearTimeout);
    setPhase("processing");

    timeoutsRef.current = [
      window.setTimeout(() => setPhase("completed"), PHASE_DELAYS.processing),
      window.setTimeout(
        () => setPhase("clearing"),
        PHASE_DELAYS.processing + PHASE_DELAYS.completed,
      ),
      window.setTimeout(
        () => setPhase("idle"),
        PHASE_DELAYS.processing +
          PHASE_DELAYS.completed +
          PHASE_DELAYS.clearing,
      ),
    ];
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled || isAnimating) {
      event.preventDefault();
      return;
    }

    onClick?.(event);

    if (!event.defaultPrevented) {
      startCycle();
    }
  }

  return (
    <button
      aria-busy={phase === "processing"}
      aria-disabled={disabled || isAnimating}
      className={[styles.button, styles[phase], className]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      onClick={handleClick}
      type={type}
      {...props}
    >
      <span aria-hidden="true" className={styles.shimmer} />
      <span className={styles.content}>
        {phase === "idle" ? (
          idleLabel
        ) : (
          <>
            {phase === "processing" ? (
              <span aria-hidden="true" className={styles.spinner} />
            ) : (
              <Check aria-hidden="true" size={16} strokeWidth={2.25} />
            )}
            <span>
              {phase === "processing" ? processingLabel : completedLabel}
            </span>
          </>
        )}
      </span>
    </button>
  );
}
