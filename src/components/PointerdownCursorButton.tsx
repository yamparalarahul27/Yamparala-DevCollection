import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./PointerdownCursorButton.module.css";

type PointerdownCursorButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PointerdownCursorButton({
  className,
  children = "Press Me",
  ...props
}: PointerdownCursorButtonProps) {
  return (
    <button className={cn(styles.button, className)} type="button" {...props}>
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </button>
  );
}
