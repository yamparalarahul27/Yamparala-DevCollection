"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
} from "react";
import { PanelTopOpen, RotateCcw } from "lucide-react";
import TradingContextComposer from "./TradingContextComposer";
import styles from "./TradingContextComposer.module.css";

const MIN_GAP = -236;
const MAX_GAP = 22;

export default function TradingContextComposerPlayground() {
  const [prompt, setPrompt] = useState("");
  const [gap, setGap] = useState(22);
  const [debug, setDebug] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (replayTimerRef.current) {
        clearTimeout(replayTimerRef.current);
      }
    };
  }, []);

  function handlePromptChange(nextPrompt: string) {
    setPrompt(nextPrompt);
    setIsOpen(/\b(orders?|positions?)\b/i.test(nextPrompt));
  }

  function handleGapInput(event: FormEvent<HTMLInputElement>) {
    setGap(Number(event.currentTarget.value));
  }

  function stopScrubbing(event: PointerEvent<HTMLInputElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsScrubbing(false);
  }

  function handleReplay() {
    if (replayTimerRef.current) {
      clearTimeout(replayTimerRef.current);
    }

    setIsScrubbing(false);
    setIsOpen(false);
    replayTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      replayTimerRef.current = null;
    }, 320);
  }

  function handleToggle() {
    if (replayTimerRef.current) {
      clearTimeout(replayTimerRef.current);
      replayTimerRef.current = null;
    }

    setIsScrubbing(false);
    setIsOpen((current) => !current);
  }

  return (
    <div className={styles.playground}>
      <TradingContextComposer
        autoFocus
        debug={debug}
        forceOpen={isOpen}
        gap={gap}
        onValueChange={handlePromptChange}
        scrubbing={isScrubbing}
        value={prompt}
      />

      <div aria-label="Motion controls" className={styles.motionControls}>
        <label className={styles.gapControl}>
          <span>Gap</span>
          <input
            aria-label="Context card gap"
            max={MAX_GAP}
            min={MIN_GAP}
            onInput={handleGapInput}
            onPointerCancel={stopScrubbing}
            onPointerDown={() => setIsScrubbing(true)}
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

        <div className={styles.controlActions}>
          <button aria-label="Replay motion" onClick={handleReplay} title="Replay motion" type="button">
            <RotateCcw aria-hidden="true" size={15} />
          </button>
          <button onClick={handleToggle} type="button">
            <PanelTopOpen aria-hidden="true" size={15} />
            Toggle
          </button>
        </div>
      </div>
    </div>
  );
}
