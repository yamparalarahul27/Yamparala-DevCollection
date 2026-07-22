"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Motion engine for the connector/context reveal, reverse-engineered
 * frame by frame from the reference screen recording (37 fps, 489 frames).
 *
 * Two kinds of movement drive the single `gap` value (the px distance
 * between the card's bottom edge and the composer's top edge — negative
 * values overlap the shapes so the goo filter merges them):
 *
 * 1. Toggle playback — the measured curves below, sampled from the video
 *    at native frame times. The reveal overshoots its target by ~38.6%
 *    at ~120ms, dips ~3% under, and settles at ~340ms. The dismissal
 *    drops in ~170ms and relaxes through a long tail.
 * 2. Scrubbing — a stiff critical-ish spring chasing the slider value,
 *    which reproduces the slight lag and release overshoot visible in
 *    the recording's drag segments.
 */

type CurvePoint = readonly [timeMs: number, progress: number];

/** Reveal: measured card-top trajectory normalized to 0..1 progress. */
export const TOGGLE_IN_CURVE: readonly CurvePoint[] = [
  [0, 0],
  [24, 0.14],
  [48, 0.49],
  [73, 1.09],
  [98, 1.3],
  [121, 1.386],
  [146, 1.35],
  [171, 1.3],
  [195, 1.229],
  [220, 1.086],
  [245, 1.029],
  [268, 0.971],
  [293, 0.986],
  [316, 0.995],
  [341, 1],
];

/** Dismissal: fast main drop plus the slow settle tail from the video. */
export const TOGGLE_OUT_CURVE: readonly CurvePoint[] = [
  [0, 0],
  [24, 0.214],
  [48, 0.743],
  [73, 1.03],
  [98, 1.09],
  [121, 1.06],
  [146, 1.05],
  [171, 1.04],
  [220, 1.025],
  [268, 1.012],
  [317, 1.005],
  [415, 1],
];

/** Spring constants fitted to the recording's scrub-release segments. */
const SCRUB_STIFFNESS = 780;
const SCRUB_DAMPING = 44;
const REST_DELTA = 0.05;
const REST_SPEED = 0.5;

function sampleCurve(curve: readonly CurvePoint[], timeMs: number): number {
  if (timeMs <= curve[0][0]) {
    return curve[0][1];
  }

  const last = curve[curve.length - 1];

  if (timeMs >= last[0]) {
    return last[1];
  }

  for (let index = 1; index < curve.length; index += 1) {
    const [t1, p1] = curve[index];

    if (timeMs <= t1) {
      const [t0, p0] = curve[index - 1];
      const local = (timeMs - t0) / (t1 - t0);
      return p0 + (p1 - p0) * local;
    }
  }

  return last[1];
}

type MotionMode =
  | { kind: "idle" }
  | {
      kind: "curve";
      curve: readonly CurvePoint[];
      from: number;
      to: number;
      startedAt: number;
      overshootScale: number;
    }
  | { kind: "spring"; target: number; velocity: number; lastAt: number };

export type PlayOptions = {
  direction?: "in" | "out";
  /**
   * Cap on the absolute overshoot in px. The measured curves overshoot
   * proportionally (~38.6% of the travel on the way in); when a component
   * travels much farther than the 70px in the source video this keeps the
   * bounce at the same absolute size the video shows.
   */
  maxOvershootPx?: number;
};

export type GapMotion = {
  /** Current animated gap value (may overshoot the slider bounds). */
  gap: number;
  /** True while a toggle curve or scrub spring is running. */
  animating: boolean;
  /** Play the measured toggle curve from the current value to `target`. */
  playTo: (target: number, options?: PlayOptions) => void;
  /** Chase `target` with the scrub spring (slider drags). */
  scrubTo: (target: number) => void;
  /** Jump instantly without animation. */
  set: (value: number) => void;
};

export default function useGapMotion(initial: number): GapMotion {
  const [gap, setGap] = useState(initial);
  const [animating, setAnimating] = useState(false);
  const gapRef = useRef(initial);
  const modeRef = useRef<MotionMode>({ kind: "idle" });
  const frameRef = useRef(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = query.matches;
    const onChange = (event: MediaQueryListEvent) => {
      reducedRef.current = event.matches;
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const stop = useCallback(() => {
    modeRef.current = { kind: "idle" };
    cancelAnimationFrame(frameRef.current);
    setAnimating(false);
  }, []);

  const apply = useCallback((value: number) => {
    gapRef.current = value;
    setGap(value);
  }, []);

  const start = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    setAnimating(true);

    const step = (now: number) => {
      const mode = modeRef.current;

      if (mode.kind === "curve") {
        const elapsed = now - mode.startedAt;
        const raw = sampleCurve(mode.curve, elapsed);
        const progress = raw > 1 ? 1 + (raw - 1) * mode.overshootScale : raw;
        apply(mode.from + (mode.to - mode.from) * progress);

        if (elapsed >= mode.curve[mode.curve.length - 1][0]) {
          apply(mode.to);
          stop();
          return;
        }
      }

      if (mode.kind === "spring") {
        const dt = Math.min((now - mode.lastAt) / 1000, 1 / 30);
        mode.lastAt = now;
        const displacement = gapRef.current - mode.target;
        const acceleration = -SCRUB_STIFFNESS * displacement - SCRUB_DAMPING * mode.velocity;
        mode.velocity += acceleration * dt;
        const next = gapRef.current + mode.velocity * dt;
        apply(next);

        if (Math.abs(next - mode.target) < REST_DELTA && Math.abs(mode.velocity) < REST_SPEED) {
          apply(mode.target);
          stop();
          return;
        }
      }

      if (modeRef.current.kind !== "idle") {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, [apply, stop]);

  const playTo = useCallback(
    (target: number, options?: PlayOptions) => {
      if (reducedRef.current) {
        stop();
        apply(target);
        return;
      }

      const from = gapRef.current;

      if (Math.abs(target - from) < REST_DELTA) {
        return;
      }

      const rising = options?.direction ? options.direction === "in" : target > from;
      const travel = Math.abs(target - from);
      const overshootScale =
        options?.maxOvershootPx === undefined
          ? 1
          : Math.min(1, options.maxOvershootPx / (travel * 0.386));
      modeRef.current = {
        kind: "curve",
        curve: rising ? TOGGLE_IN_CURVE : TOGGLE_OUT_CURVE,
        from,
        to: target,
        startedAt: performance.now(),
        overshootScale,
      };
      start();
    },
    [apply, start, stop],
  );

  const scrubTo = useCallback(
    (target: number) => {
      if (reducedRef.current) {
        stop();
        apply(target);
        return;
      }

      const mode = modeRef.current;

      if (mode.kind === "spring") {
        mode.target = target;
        return;
      }

      modeRef.current = { kind: "spring", target, velocity: 0, lastAt: performance.now() };
      start();
    },
    [apply, start, stop],
  );

  const set = useCallback(
    (value: number) => {
      stop();
      apply(value);
    },
    [apply, stop],
  );

  return { gap, animating, playTo, scrubTo, set };
}
