"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./ArticleScrollRail.module.css";

export type ArticleScrollRailSection = {
  id: string;
  label: string;
};

type MeasuredSection = ArticleScrollRailSection & {
  y: number;
};

type ArticleScrollRailProps = {
  bottomOffset?: number;
  sections: ArticleScrollRailSection[];
  tickCount?: number;
  topOffset?: number;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

function getMaxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function getSectionTop(id: string) {
  const node = document.getElementById(id);
  if (!node) {
    return 0;
  }

  return node.getBoundingClientRect().top + window.scrollY;
}

export default function ArticleScrollRail({
  bottomOffset = 112,
  sections,
  tickCount = 60,
  topOffset = 96,
}: ArticleScrollRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [railHeight, setRailHeight] = useState(1);
  const [progress, setProgress] = useState(0);
  const [measuredSections, setMeasuredSections] = useState<MeasuredSection[]>(
    [],
  );

  const markerY = progress * railHeight;
  const ticks = useMemo(
    () =>
      Array.from({ length: tickCount }, (_, index) => {
        const denominator = Math.max(1, tickCount - 1);
        return (index / denominator) * railHeight;
      }),
    [railHeight, tickCount],
  );

  const updateMeasurements = useCallback(() => {
    const maxScroll = getMaxScroll();
    const nextHeight = railRef.current?.getBoundingClientRect().height ?? 1;

    setRailHeight(Math.max(1, nextHeight));
    setMeasuredSections(
      sections.map((section) => ({
        ...section,
        y: clamp(getSectionTop(section.id) / maxScroll) * nextHeight,
      })),
    );
    setProgress(clamp(window.scrollY / maxScroll));
  }, [sections]);

  const updateProgress = useCallback(() => {
    rafRef.current = null;
    setProgress(clamp(window.scrollY / getMaxScroll()));
  }, []);

  useEffect(() => {
    const initialMeasurementFrame =
      window.requestAnimationFrame(updateMeasurements);

    function requestProgressUpdate() {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(updateProgress);
    }

    const resizeObserver = new ResizeObserver(updateMeasurements);
    resizeObserver.observe(document.documentElement);
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", updateMeasurements);

    return () => {
      window.cancelAnimationFrame(initialMeasurementFrame);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", updateMeasurements);
    };
  }, [updateMeasurements, updateProgress]);

  function scrollToProgress(nextProgress: number) {
    const top = clamp(nextProgress) * getMaxScroll();
    window.scrollTo({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      top,
    });
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={styles.mobileProgress}
        style={{ transform: `scaleX(${progress})` }}
      />

      <aside
        aria-label="Article scroll progress"
        className={styles.rail}
        style={{
          "--rail-bottom": `${bottomOffset}px`,
          "--rail-top": `${topOffset}px`,
        } as CSSProperties}
      >
        <div className={styles.railInner} ref={railRef}>
          <div className={styles.ticks} aria-hidden="true">
            {ticks.map((y, index) => {
              const tickProgress = tickCount <= 1 ? 0 : index / (tickCount - 1);
              const distance = Math.abs(y - markerY);
              return (
                <span
                  className={styles.tick}
                  key={index}
                  style={
                    {
                      "--tick-opacity":
                        distance < 12
                          ? 0.42
                          : tickProgress > progress
                            ? 0.22
                            : 0.1,
                      "--tick-y": `${y}px`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>

          <div className={styles.jumpLayer}>
            {ticks.map((y, index) => {
              const tickProgress = tickCount <= 1 ? 0 : index / (tickCount - 1);
              return (
                <button
                  aria-label={`Jump to ${Math.round(tickProgress * 100)}%`}
                  className={styles.tickButton}
                  key={index}
                  onClick={() => scrollToProgress(tickProgress)}
                  style={{ "--tick-y": `${y}px` } as CSSProperties}
                  type="button"
                />
              );
            })}
          </div>

          <nav className={styles.sectionNav} aria-label="Article sections">
            {measuredSections.map((section, index) => (
              <a
                className={styles.sectionLink}
                href={`#${section.id}`}
                key={section.id}
                style={
                  {
                    "--delay": `${index * 45}ms`,
                    "--section-y": `${section.y}px`,
                  } as CSSProperties
                }
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div
            className={styles.marker}
            style={{ "--marker-y": `${markerY}px` } as CSSProperties}
          >
            <span className={styles.markerText}>{progress.toFixed(2)}</span>
            <span className={styles.markerLine} />
          </div>
        </div>
      </aside>
    </>
  );
}
