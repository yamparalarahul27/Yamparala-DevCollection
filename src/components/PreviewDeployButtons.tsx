"use client";

import { type ButtonHTMLAttributes } from "react";
import { CircleCheck, Eye } from "lucide-react";
import styles from "./PreviewDeployButtons.module.css";

type PreviewDeployButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "preview" | "deploy";
};

export function PreviewDeployButton({
  className,
  type = "button",
  variant,
  ...props
}: PreviewDeployButtonProps) {
  const isPreview = variant === "preview";
  const Icon = isPreview ? Eye : CircleCheck;

  return (
    <button
      type={type}
      className={[
        styles.button,
        isPreview ? styles.preview : styles.deploy,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <Icon
        aria-hidden="true"
        className={[styles.icon, isPreview ? styles.previewIcon : ""]
          .filter(Boolean)
          .join(" ")}
      />
      <span>{isPreview ? "Preview" : "Deploy"}</span>
    </button>
  );
}

export default function PreviewDeployButtons() {
  return (
    <div className={styles.row}>
      <PreviewDeployButton variant="preview" />
      <PreviewDeployButton variant="deploy" />
    </div>
  );
}
