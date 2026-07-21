"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
} from "react";
import { PanelTopOpen, RotateCcw } from "lucide-react";
import TradingContextComposer, { MAX_GAP, MIN_GAP } from "./TradingContextComposer";
import styles from "./TradingContextComposer.module.css";

export default function TradingContextComposerPlayground() {
  const [prompt, setPrompt] = useState("");
  const [manualGap, setManualGap] = useState<number | null>(null);
  const [liveGap, setLiveGap] = useState(MIN_GAP);
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
    setManualGap(null);
    setIsOpen(/\b(orders?|positions?)\b/i.test(nextPrompt));
  }

  function handleGapInput(event: FormEvent<HTMLInputElement>) {
    setManualGap(Number(event.currentTarget.value));
  }

  const handleGapChange = useCallback((gap: number) => {
    setLiveGap(gap);
  }, []);

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
    setManualGap(null);
    setIsOpen(false);
    replayTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      replayTimerRef.current = null;
    }, 480);
  }

  function handleToggle() {
    if (replayTimerRef.current) {
      clearTimeout(replayTimerRef.current);
      replayTimerRef.current = null;
    }

    setIsScrubbing(false);
    setManualGap(null);
    setIsOpen((current) => !current);
  }

  const sliderValue =
    manualGap ?? Math.round(Math.min(MAX_GAP, Math.max(MIN_GAP, liveGap)));

  return (
    <div className={styles.playground}>
      <TradingContextComposer
        autoFocus
        debug={debug}
        forceOpen={isOpen}
        gap={manualGap ?? undefined}
        onGapChange={handleGapChange}
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
