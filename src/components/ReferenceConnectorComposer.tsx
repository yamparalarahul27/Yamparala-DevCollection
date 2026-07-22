"use client";

import {
  useId,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent,
} from "react";
import { ArrowUp } from "lucide-react";
import styles from "./ReferenceConnectorComposer.module.css";

const MIN_GAP = -60;
const MAX_GAP = 10;

export default function ReferenceConnectorComposer() {
  const inputId = useId();
  const [prompt, setPrompt] = useState("");
  const [gap, setGap] = useState(MAX_GAP);
  const [debug, setDebug] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const progress = (gap - MIN_GAP) / (MAX_GAP - MIN_GAP);
  const motionStyle = {
    "--reference-blur": `${3 * (1 - progress)}px`,
    "--reference-gap": `${gap}px`,
    "--reference-opacity": progress,
    "--reference-scale": 0.97 + 0.03 * progress,
  } as CSSProperties;

  function handleGapInput(event: FormEvent<HTMLInputElement>) {
    setGap(Number(event.currentTarget.value));
  }

  function stopScrubbing(event: PointerEvent<HTMLInputElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setScrubbing(false);
  }

  return (
    <div className={styles.referenceDemo}>
      <div
        className={styles.stage}
        data-debug={debug ? "true" : "false"}
        data-scrubbing={scrubbing ? "true" : "false"}
        data-visible={visible ? "true" : "false"}
        style={motionStyle}
      >
        <section
          aria-hidden={!visible || progress < 0.14}
          aria-label="MCP connector"
          className={styles.connectorCard}
        >
          <span aria-hidden="true" className={styles.notionIcon}>
            N
          </span>
          <span className={styles.connectorIdentity}>
            <span>MCP Connector</span>
            <strong>Notion</strong>
          </span>
          <button className={styles.skipButton} tabIndex={visible && progress > 0.72 ? 0 : -1} type="button">
            Skip
          </button>
          <button
            className={styles.connectButton}
            tabIndex={visible && progress > 0.72 ? 0 : -1}
            type="button"
          >
            Connect
          </button>
        </section>

        <form className={styles.composer} onSubmit={(event) => event.preventDefault()}>
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
            <ArrowUp aria-hidden="true" size={14} strokeWidth={2.2} />
          </button>
        </form>
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
            type="range"
            value={gap}
          />
          <output>{gap}px</output>
        </label>

        <label className={styles.debugControl}>
          <input
            checked={debug}
            onChange={(event) => setDebug(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>Debug</span>
        </label>

        <button className={styles.toggleButton} onClick={() => setVisible((current) => !current)} type="button">
          Toggle
        </button>
      </div>
    </div>
  );
}
