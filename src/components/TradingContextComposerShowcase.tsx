"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import ReferenceConnectorComposer from "./ReferenceConnectorComposer";
import TradingContextComposerPlayground from "./TradingContextComposerPlayground";
import styles from "./ReferenceConnectorComposer.module.css";

type Variant = "trading" | "reference";

const variants: Array<{ id: Variant; label: string }> = [
  { id: "trading", label: "Trading context" },
  { id: "reference", label: "Video reference" },
];

export default function TradingContextComposerShowcase() {
  const [variant, setVariant] = useState<Variant>("reference");
  const tabListRef = useRef<HTMLDivElement>(null);

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const tabs = Array.from(tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    const activeIndex = Math.max(0, tabs.indexOf(document.activeElement as HTMLButtonElement));
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key === "ArrowLeft"
            ? (activeIndex - 1 + tabs.length) % tabs.length
            : (activeIndex + 1) % tabs.length;

    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  }

  return (
    <div className={styles.showcase}>
      <div
        aria-label="Composer variants"
        className={styles.variantTabs}
        onKeyDown={handleTabKeyDown}
        ref={tabListRef}
        role="tablist"
      >
        {variants.map((item) => (
          <button
            aria-controls={`composer-panel-${item.id}`}
            aria-selected={variant === item.id}
            id={`composer-tab-${item.id}`}
            key={item.id}
            onClick={() => setVariant(item.id)}
            role="tab"
            tabIndex={variant === item.id ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`composer-tab-${variant}`}
        className={styles.variantPanel}
        id={`composer-panel-${variant}`}
        role="tabpanel"
      >
        {variant === "reference" ? (
          <ReferenceConnectorComposer />
        ) : (
          <TradingContextComposerPlayground />
        )}
      </div>
    </div>
  );
}
