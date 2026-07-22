"use client";

import {
  useId,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent,
} from "react";
import { ArrowUp } from "lucide-react";
import useGapMotion from "@/lib/useGapMotion";
import styles from "./ReferenceConnectorComposer.module.css";

/**
 * Frame-accurate recreation of the reference recording.
 *
 * The card and the composer are two white silhouettes rendered inside a
 * gooey SVG filter (blur + alpha contrast), so when the card sinks behind
 * the composer the two shapes melt together like liquid — exactly what
 * the video shows. Card content lives on a separate unfiltered layer that
 * fades and blurs over the last ~28px of travel while the composer text
 * stays crisp. A single `gap` value (bottom of card → top of composer,
 * in px) drives everything; Toggle plays the motion curve measured from
 * the video and the slider scrubs the same value through a stiff spring.
 */

const MIN_GAP = -60;
const MAX_GAP = 10;

/** Card content is invisible below -21px and fully opaque by ~+7px. */
function contentAlpha(gap: number) {
  return Math.min(1, Math.max(0, (gap + 21) / 28));
}

export default function ReferenceConnectorComposer() {
  const inputId = useId();
  const rawId = useId();
  const gooId = `goo-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [prompt, setPrompt] = useState("");
  const [debug, setDebug] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const motion = useGapMotion(MAX_GAP);

  const gap = motion.gap;
  const alpha = contentAlpha(gap);
  const blur = 3 * (1 - alpha);
  const sliderValue = Math.round(Math.min(MAX_GAP, Math.max(MIN_GAP, gap)));
  const open = gap > (MIN_GAP + MAX_GAP) / 2;
  const interactive = alpha > 0.7;

  const stageStyle = {
    "--gap": gap,
    "--card-alpha": alpha,
    "--card-blur": `${blur.toFixed(2)}px`,
  } as CSSProperties;

  function handleToggle() {
    motion.playTo(open ? MIN_GAP : MAX_GAP, { direction: open ? "out" : "in" });
  }

  function handleGapInput(event: FormEvent<HTMLInputElement>) {
    motion.scrubTo(Number(event.currentTarget.value));
  }

  function stopScrubbing(event: PointerEvent<HTMLInputElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setScrubbing(false);
  }

  return (
    <div className={styles.referenceDemo}>
      <svg aria-hidden="true" className={styles.gooDefs} focusable="false">
        <defs>
          <filter id={gooId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8 4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className={styles.stage}
        data-debug={debug ? "true" : "false"}
        data-scrubbing={scrubbing ? "true" : "false"}
        style={stageStyle}
      >
        <div
          aria-hidden="true"
          className={styles.shapes}
          style={{ "--goo": `url(#${gooId})` } as CSSProperties}
        >
          <div className={styles.shapeCard} />
          <div className={styles.shapeComposer} />
        </div>

        <section
          aria-hidden={alpha < 0.15}
          aria-label="MCP connector"
          className={styles.cardContent}
        >
          <span aria-hidden="true" className={styles.notionIcon}>
            N
          </span>
          <span className={styles.connectorIdentity}>
            <span>MCP Connector</span>
            <strong>Notion</strong>
          </span>
          <button className={styles.skipButton} tabIndex={interactive ? 0 : -1} type="button">
            Skip
          </button>
          <button className={styles.connectButton} tabIndex={interactive ? 0 : -1} type="button">
            Connect
          </button>
        </section>

        <form className={styles.composerContent} onSubmit={(event) => event.preventDefault()}>
          <label className={styles.srOnly} htmlFor={inputId}>
            Ask anything
          </label>
          <input
            autoComplete="off"
            id={inputId}
            onChange={(event) => setPrompt(event.currentTarget.value)}
            placeholder="Ask anything..."
            spellCheck="false"
            type="text"
            value={prompt}
          />
          <button aria-label="Send message" disabled={!prompt.trim()} type="submit">
            <ArrowUp aria-hidden="true" size={16} strokeWidth={2.2} />
          </button>
        </form>

        {debug ? (
          <div aria-hidden="true" className={styles.debugLayer}>
            <div className={styles.debugCard} />
            <div className={styles.debugComposer} />
            <span className={styles.debugReadout}>
              gap {gap.toFixed(1)}px · α {alpha.toFixed(2)} · blur {blur.toFixed(1)}px
            </span>
          </div>
        ) : null}
      </div>

      <div aria-label="Reference motion controls" className={styles.controls}>
        <label className={styles.gapControl}>
          <span>Gap</span>
          <input
            aria-label="Connector gap"
            max={MAX_GAP}
            min={MIN_GAP}
            onInput={handleGapInput}
            onPointerCancel={stopScrubbing}
            onPointerDown={() => setScrubbing(true)}
            onPointerUp={stopScrubbing}
            step="1"
            style={
              {
                "--fill": `${(((sliderValue - MIN_GAP) / (MAX_GAP - MIN_GAP)) * 100).toFixed(1)}%`,
              } as CSSProperties
            }
            type="range"
            value={sliderValue}
          />
          <output>{sliderValue}px</output>
        </label>

        <label className={styles.debugControl}>
          <input
            checked={debug}
            onChange={(event) => setDebug(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>Debug</span>
        </label>

        <button className={styles.toggleButton} onClick={handleToggle} type="button">
          Toggle
        </button>
      </div>
    </div>
  );
}
