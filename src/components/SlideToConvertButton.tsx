"use client";

import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Check, ChevronRight } from "lucide-react";
import styles from "./SlideToConvertButton.module.css";

const TRACK_PADDING = 5;
const THUMB_WIDTH = 66;
const COMPLETE_THRESHOLD = 0.86;

type SlideToConvertButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onPointerDown" | "onPointerMove" | "onPointerUp"
> & {
  onConvert?: () => void;
  resetDelay?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function SlideToConvertButton({
  className,
  disabled,
  onConvert,
  resetDelay = 1400,
  type = "button",
  ...props
}: SlideToConvertButtonProps) {
  const trackRef = useRef<HTMLButtonElement | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [maxTravel, setMaxTravel] = useState(0);
  const [progress, setProgress] = useState(0);

  const thumbX = TRACK_PADDING + progress * maxTravel;
  const fillWidth = TRACK_PADDING + THUMB_WIDTH + progress * maxTravel;
  const isDisabled = disabled || isComplete;

  useLayoutEffect(() => {
    const element = trackRef.current;
    if (!element) {
      return;
    }

    const target = element;

    function measure() {
      setMaxTravel(
        Math.max(0, target.getBoundingClientRect().width - THUMB_WIDTH - TRACK_PADDING * 2),
      );
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function reset() {
    setIsComplete(false);
    setProgress(0);
  }

  function finishConversion() {
    if (isComplete) {
      return;
    }

    setProgress(1);
    setIsComplete(true);
    onConvert?.();

    if (resetDelay > 0) {
      resetTimerRef.current = window.setTimeout(reset, resetDelay);
    }
  }

  function getProgressFromClientX(clientX: number) {
    const element = trackRef.current;
    if (!element || maxTravel === 0) {
      return progress;
    }

    const rect = element.getBoundingClientRect();
    const nextProgress =
      (clientX - rect.left - TRACK_PADDING - THUMB_WIDTH / 2) / maxTravel;

    return clamp(nextProgress, 0, 1);
  }

  function updateProgress(clientX: number) {
    const nextProgress = getProgressFromClientX(clientX);

    setProgress(nextProgress);
    return nextProgress;
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (isDisabled) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateProgress(event.clientX);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!isDragging || isDisabled) {
      return;
    }

    updateProgress(event.clientX);
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (!isDragging) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);

    const finalProgress = updateProgress(event.clientX);
    setIsDragging(false);

    if (finalProgress >= COMPLETE_THRESHOLD) {
      finishConversion();
      return;
    }

    setProgress(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (isComplete) {
      event.preventDefault();
      if (event.key === "Escape" || event.key === "Home" || event.key === "ArrowLeft") {
        reset();
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      finishConversion();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setProgress((value) => {
        const nextProgress = clamp(value + 0.18, 0, 1);

        if (nextProgress >= COMPLETE_THRESHOLD) {
          window.requestAnimationFrame(finishConversion);
        }

        return nextProgress;
      });
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "Home" || event.key === "Escape") {
      event.preventDefault();
      setProgress(0);
    }
  }

  return (
    <button
      aria-label={isComplete ? "Converted" : "Slide to convert"}
      aria-live="polite"
      className={[styles.track, className].filter(Boolean).join(" ")}
      data-complete={isComplete ? "true" : undefined}
      data-dragging={isDragging ? "true" : undefined}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      onPointerCancel={() => {
        setIsDragging(false);
        setProgress(0);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={trackRef}
      style={
        {
          "--fill-width": `${fillWidth}px`,
          "--thumb-x": `${thumbX}px`,
        } as CSSProperties
      }
      type={type}
      {...props}
    >
      <span className={styles.fill} aria-hidden="true" />
      <span className={styles.label}>
        {isComplete ? "Converted" : "Slide to convert"}
      </span>
      <span className={styles.thumb} aria-hidden="true">
        {isComplete ? (
          <Check className={styles.checkIcon} size={22} strokeWidth={2.5} />
        ) : (
          <span className={styles.arrows}>
            <ChevronRight className={styles.arrow} size={15} strokeWidth={2.4} />
            <ChevronRight className={styles.arrow} size={15} strokeWidth={2.4} />
            <ChevronRight className={styles.arrow} size={15} strokeWidth={2.4} />
          </span>
        )}
      </span>
    </button>
  );
}
