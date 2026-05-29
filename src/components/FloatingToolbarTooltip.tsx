"use client";

import { AppWindow, Maximize2, MoreHorizontal, Pin } from "lucide-react";
import { useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./FloatingToolbarTooltip.module.css";

const toolbarActions = [
  {
    id: "pin",
    label: "Pin toolbar",
    tooltipWidth: 106,
    Icon: Pin,
  },
  {
    id: "window",
    label: "Open window",
    tooltipWidth: 116,
    Icon: AppWindow,
  },
  {
    id: "floating",
    label: "Use Floating Window",
    tooltipWidth: 178,
    Icon: Maximize2,
  },
  {
    id: "more",
    label: "More...",
    tooltipWidth: 82,
    Icon: MoreHorizontal,
  },
] as const;

const DEFAULT_ACTIVE_INDEX = 2;
const ITEM_STEP = 48;
const ITEM_CENTER = 22;

export default function FloatingToolbarTooltip() {
  const [activeIndex, setActiveIndex] = useState(DEFAULT_ACTIVE_INDEX);
  const activeAction = toolbarActions[activeIndex];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (index + direction + toolbarActions.length) % toolbarActions.length;

    setActiveIndex(nextIndex);
    const nextButton = event.currentTarget.parentElement?.querySelectorAll("button")[
      nextIndex
    ];
    nextButton?.focus();
  }

  return (
    <section className={styles.stage} aria-label="Floating toolbar tooltip demo">
      <div className={styles.canvas}>
        <div className={styles.windowChrome}>
          <span />
          <span />
          <span />
        </div>

        <div
          className={styles.toolbarCluster}
          style={
            {
              "--active-x": `${activeIndex * ITEM_STEP}px`,
              "--tooltip-center": `${activeIndex * ITEM_STEP + ITEM_CENTER}px`,
              "--tooltip-width": `${activeAction.tooltipWidth}px`,
            } as CSSProperties
          }
        >
          <div
            className={styles.toolbar}
            role="toolbar"
            aria-label="Floating window actions"
          >
            <span className={styles.activeSurface} aria-hidden="true" />
            {toolbarActions.map(({ id, label, Icon }, index) => (
              <button
                aria-describedby="floating-toolbar-tooltip"
                aria-label={label}
                className={styles.toolbarButton}
                data-active={index === activeIndex ? "true" : undefined}
                key={id}
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onMouseEnter={() => setActiveIndex(index)}
                onPointerDown={() => setActiveIndex(index)}
                onPointerEnter={() => setActiveIndex(index)}
                type="button"
              >
                <Icon aria-hidden="true" size={19} strokeWidth={2.15} />
              </button>
            ))}
          </div>

          <div
            className={styles.tooltip}
            id="floating-toolbar-tooltip"
            role="tooltip"
          >
            {activeAction.label}
          </div>
        </div>

        <div className={styles.previewContent} aria-hidden="true">
          <div className={styles.previewHeader}>
            <span />
            <span />
          </div>
          <div className={styles.previewGrid}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
