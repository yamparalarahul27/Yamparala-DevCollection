"use client";

import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type UIEvent,
} from "react";
import { Plus } from "lucide-react";
import styles from "./GlowTypingInput.module.css";

export type GlowTypingInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "value"
> & {
  defaultValue?: string;
  label?: string;
  onValueChange?: (value: string) => void;
  value?: string;
};

export default function GlowTypingInput({
  autoFocus = false,
  className,
  defaultValue = "Let",
  id,
  label = "Glowing text input",
  onBlur,
  onChange,
  onClick,
  onFocus,
  onKeyUp,
  onSelect,
  onValueChange,
  onScroll,
  placeholder = "Type",
  value,
  ...props
}: GlowTypingInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [caretLeft, setCaretLeft] = useState(0);
  const inputValue = value ?? internalValue;

  const updateCaret = useCallback(() => {
    const input = inputRef.current;
    const measure = measureRef.current;

    if (!input || !measure) return;

    const selection = isFocused ? input.selectionStart ?? input.value.length : input.value.length;
    measure.textContent = input.value.slice(0, selection);
    setCaretLeft(Math.max(0, measure.offsetWidth - input.scrollLeft));
  }, [isFocused]);

  const scheduleCaretUpdate = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updateCaret();
    });
  }, [updateCaret]);

  useLayoutEffect(() => {
    updateCaret();
  }, [inputValue, updateCaret]);

  useLayoutEffect(() => {
    const input = inputRef.current;

    if (!autoFocus || !input || document.activeElement !== input || input.value.length === 0) {
      return;
    }

    const end = input.value.length;
    input.setSelectionRange(end, end);
    updateCaret();
  }, [autoFocus, updateCaret]);

  useLayoutEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setInternalValue(event.currentTarget.value);
    }

    onValueChange?.(event.currentTarget.value);
    onChange?.(event);
    scheduleCaretUpdate();
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    if ((event.currentTarget.selectionStart ?? 0) === 0 && event.currentTarget.value.length > 0) {
      const end = event.currentTarget.value.length;
      event.currentTarget.setSelectionRange(end, end);
    }

    setIsFocused(true);
    onFocus?.(event);
    scheduleCaretUpdate();
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    onBlur?.(event);
  }

  function handleSelect(event: UIEvent<HTMLInputElement>) {
    onSelect?.(event);
    scheduleCaretUpdate();
  }

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    onKeyUp?.(event);
    scheduleCaretUpdate();
  }

  function handleClick(event: MouseEvent<HTMLInputElement>) {
    onClick?.(event);
    scheduleCaretUpdate();
  }

  function handleScroll(event: UIEvent<HTMLInputElement>) {
    onScroll?.(event);
    scheduleCaretUpdate();
  }

  return (
    <label
      className={[styles.shell, className].filter(Boolean).join(" ")}
      data-focused={isFocused ? "true" : undefined}
      htmlFor={inputId}
    >
      <span className={styles.prefix} aria-hidden="true">
        <Plus size={58} strokeWidth={1.25} />
      </span>
      <span className={styles.field}>
        <input
          {...props}
          aria-label={props["aria-label"] ?? label}
          autoFocus={autoFocus}
          autoComplete={props.autoComplete ?? "off"}
          className={styles.input}
          id={inputId}
          onBlur={handleBlur}
          onChange={handleChange}
          onClick={handleClick}
          onFocus={handleFocus}
          onKeyUp={handleKeyUp}
          onScroll={handleScroll}
          onSelect={handleSelect}
          placeholder={placeholder}
          ref={inputRef}
          spellCheck={props.spellCheck ?? false}
          type={props.type ?? "text"}
          value={inputValue}
        />
        <span
          aria-hidden="true"
          className={styles.caret}
          style={{ "--caret-left": `${caretLeft}px` } as CSSProperties}
        />
        <span aria-hidden="true" className={styles.measure} ref={measureRef} />
      </span>
      <span className={styles.srOnly}>{label}</span>
    </label>
  );
}
