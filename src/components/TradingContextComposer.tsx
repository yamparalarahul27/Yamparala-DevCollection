"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ArrowUp,
  ChartNoAxesCombined,
  CircleAlert,
  ReceiptText,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import useGapMotion from "@/lib/useGapMotion";
import styles from "./TradingContextComposer.module.css";

export type TradingContextAction =
  | "orders"
  | "positions"
  | "explain"
  | "retry";

export type TradingContextStatus = "ready" | "loading" | "empty" | "error";

export type TradingAssetContext = {
  accent?: string;
  coverage: number;
  icon: string;
  market: "futures" | "spot";
  name: string;
  pnl: number;
};

export type TradingContextComposerProps = {
  assets?: readonly TradingAssetContext[];
  autoFocus?: boolean;
  className?: string;
  defaultValue?: string;
  debug?: boolean;
  forceOpen?: boolean;
  /**
   * Manual scrub position. When set, the card chases this value through
   * the motion spring instead of animating on open/close. Leave undefined
   * to let typed prompts drive the reveal.
   */
  gap?: number;
  label?: string;
  name?: string;
  onAction?: (action: TradingContextAction, prompt: string) => void;
  /** Reports the live animated gap every frame (used by the playground slider). */
  onGapChange?: (gap: number) => void;
  onRetry?: () => void;
  onSubmitPrompt?: (prompt: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  scrubbing?: boolean;
  status?: TradingContextStatus;
  value?: string;
};

/**
 * Motion model ported 1:1 from the video-reference variant: the context
 * card and the composer are white silhouettes merged by a gooey SVG
 * filter, one `gap` value (card bottom → composer top, px) drives the
 * shapes, and open/close plays the curves measured frame by frame from
 * the reference recording. Because this card travels ~264px (vs 70px in
 * the video) the reveal caps its absolute overshoot at the video's
 * ~28px so the bounce feels identical.
 */
const CARD_HEIGHT = 236;
const COMPOSER_HEIGHT = 134;
const MAX_GAP = 22;
/** How deep the card's bottom edge may tuck inside the composer. */
const MAX_TUCK = 26;
/** Fully absorbed: the remaining 20px sliver sits inside the composer band. */
const MIN_GAP = -(CARD_HEIGHT + MAX_TUCK) + 20;
const OVERSHOOT_CAP_PX = 28;

/** Content is invisible below -60px of gap and fully opaque by +16px. */
function contentAlpha(gap: number) {
  return Math.min(1, Math.max(0, (gap + 60) / 76));
}

const defaultAssets: readonly TradingAssetContext[] = [
  {
    accent: "#f5a623",
    coverage: 42,
    icon: "B",
    market: "futures",
    name: "BTC-PERP",
    pnl: 1284.4,
  },
  {
    accent: "#727cf5",
    coverage: 18,
    icon: "E",
    market: "spot",
    name: "ETH",
    pnl: -186.25,
  },
  {
    accent: "#13a88a",
    coverage: 22,
    icon: "S",
    market: "futures",
    name: "SOL-PERP",
    pnl: 412.08,
  },
];

const actionPrompts: Record<Exclude<TradingContextAction, "retry">, string> = {
  explain: "Explain the PnL and portfolio exposure shown here",
  orders: "Show all of my recent orders",
  positions: "Show my open positions",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  style: "currency",
});

function formatPnl(value: number) {
  const formatted = currencyFormatter.format(Math.abs(value));
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

function TradingRows({ assets }: { assets: readonly TradingAssetContext[] }) {
  return (
    <ul className={styles.assetList}>
      {assets.slice(0, 3).map((asset) => (
        <li className={styles.assetRow} key={`${asset.name}-${asset.market}`}>
          <span
            aria-hidden="true"
            className={styles.assetIcon}
            style={{ "--asset-accent": asset.accent ?? "#64748b" } as CSSProperties}
          >
            {asset.icon}
          </span>
          <span className={styles.assetIdentity}>
            <strong>{asset.name}</strong>
            <span>{asset.market === "futures" ? "Futures" : "Spot"}</span>
          </span>
          <span className={styles.pnl} data-positive={asset.pnl >= 0 ? "true" : "false"}>
            <span>{asset.market === "futures" ? "uPnL" : "PnL"}</span>
            <strong>{formatPnl(asset.pnl)}</strong>
          </span>
          <span className={styles.coverage}>
            <span>Portfolio</span>
            <strong>{Math.round(asset.coverage)}%</strong>
          </span>
        </li>
      ))}
    </ul>
  );
}

function LoadingRows() {
  return (
    <div aria-label="Loading trading context" className={styles.skeletonList} role="status">
      {Array.from({ length: 3 }).map((_, index) => (
        <span className={styles.skeletonRow} key={index}>
          <i />
          <i />
          <i />
        </span>
      ))}
    </div>
  );
}

export default function TradingContextComposer({
  assets = defaultAssets,
  autoFocus = false,
  className,
  defaultValue = "",
  debug = false,
  forceOpen,
  gap: manualGap,
  label = "Ask about your portfolio",
  name,
  onAction,
  onGapChange,
  onRetry,
  onSubmitPrompt,
  onValueChange,
  placeholder = "Ask anything...",
  scrubbing = false,
  status = "ready",
  value,
}: TradingContextComposerProps) {
  const generatedId = useId();
  const inputId = `${generatedId}-input`;
  const contextId = `${generatedId}-context`;
  const gooId = `goo-${generatedId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const prompt = value ?? internalValue;
  const inferredOpen = /\b(orders?|positions?)\b/i.test(prompt);
  const isOpen = forceOpen ?? inferredOpen;

  const motion = useGapMotion(
    manualGap !== undefined ? manualGap : isOpen ? MAX_GAP : MIN_GAP,
  );
  const wasOpenRef = useRef(isOpen);
  const hadManualRef = useRef(manualGap !== undefined);

  useEffect(() => {
    if (manualGap !== undefined) {
      motion.scrubTo(Math.min(MAX_GAP, Math.max(MIN_GAP, manualGap)));
      hadManualRef.current = true;
      return;
    }

    const manualReleased = hadManualRef.current;
    hadManualRef.current = false;

    if (isOpen !== wasOpenRef.current || manualReleased) {
      wasOpenRef.current = isOpen;
      motion.playTo(isOpen ? MAX_GAP : MIN_GAP, {
        direction: isOpen ? "in" : "out",
        maxOvershootPx: OVERSHOOT_CAP_PX,
      });
    }
  }, [isOpen, manualGap, motion]);

  const gap = motion.gap;

  useEffect(() => {
    onGapChange?.(gap);
  }, [gap, onGapChange]);

  const alpha = contentAlpha(gap);
  const blur = 4 * (1 - alpha);
  const isContextInteractive = alpha > 0.7 && status === "ready";
  /*
   * Shape geometry: the card's top edge always moves 1:1 with `gap`, but
   * its bottom edge stops MAX_TUCK px inside the composer (the card is
   * taller than the composer, so a plain translate would poke out below).
   * Past that point the shape shrinks while the top keeps descending
   * until the sliver is fully absorbed — visually identical to sliding
   * behind, and the goo filter melts the seam exactly like the video.
   */
  const shapeBottom = COMPOSER_HEIGHT + Math.max(gap, -MAX_TUCK);
  const shapeHeight = Math.max(0, CARD_HEIGHT + gap - Math.max(gap, -MAX_TUCK));
  const contentBottom = COMPOSER_HEIGHT + gap;
  const contentClip = Math.min(CARD_HEIGHT, Math.max(0, -gap + 1));

  const coverage = useMemo(
    () => Math.min(100, assets.reduce((total, asset) => total + asset.coverage, 0)),
    [assets],
  );
  const contextTitle = /\bpositions?\b/i.test(prompt)
    ? "Position context"
    : "Recent trading context";

  function updatePrompt(nextPrompt: string) {
    if (value === undefined) {
      setInternalValue(nextPrompt);
    }

    onValueChange?.(nextPrompt);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updatePrompt(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (prompt.trim()) {
      onSubmitPrompt?.(prompt.trim());
    }
  }

  function handleAction(action: Exclude<TradingContextAction, "retry">) {
    const nextPrompt = actionPrompts[action];
    updatePrompt(nextPrompt);
    onAction?.(action, nextPrompt);
  }

  function handleRetry() {
    onRetry?.();
    onAction?.("retry", prompt);
  }

  const actionTabIndex = isContextInteractive ? 0 : -1;
  const rootStyle = {
    "--card-alpha": alpha,
    "--card-blur": `${blur.toFixed(2)}px`,
    "--shape-bottom": `${shapeBottom.toFixed(2)}px`,
    "--shape-height": `${shapeHeight.toFixed(2)}px`,
    "--content-bottom": `${contentBottom.toFixed(2)}px`,
    "--content-clip": `${contentClip.toFixed(2)}px`,
  } as CSSProperties;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-debug={debug ? "true" : "false"}
      data-interactive={isContextInteractive ? "true" : "false"}
      data-open={isOpen ? "true" : "false"}
      data-scrubbing={scrubbing ? "true" : "false"}
      style={rootStyle}
    >
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
        aria-hidden="true"
        className={styles.shapes}
        style={{ "--goo": `url(#${gooId})` } as CSSProperties}
      >
        <div className={styles.shapeCard} />
        <div className={styles.shapeComposer} />
      </div>

      <section
        aria-hidden={alpha < 0.15}
        aria-label="Portfolio trading context"
        className={styles.contextCard}
        data-status={status}
        id={contextId}
      >
        <header className={styles.contextHeader}>
          <span>
            <Sparkles aria-hidden="true" size={15} strokeWidth={2} />
            <strong>{contextTitle}</strong>
          </span>
          <span className={styles.totalCoverage}>{Math.round(coverage)}% covered</span>
        </header>

        {status === "loading" ? <LoadingRows /> : null}
        {status === "ready" ? <TradingRows assets={assets} /> : null}
        {status === "empty" ? (
          <div className={styles.statePanel}>
            <ReceiptText aria-hidden="true" size={22} />
            <strong>No recent trading activity</strong>
            <span>New orders and positions will appear here.</span>
          </div>
        ) : null}
        {status === "error" ? (
          <div className={styles.statePanel}>
            <CircleAlert aria-hidden="true" size={22} />
            <strong>Couldn&apos;t load trading context</strong>
            <button onClick={handleRetry} tabIndex={alpha > 0.7 ? 0 : -1} type="button">
              <RefreshCw aria-hidden="true" size={14} />
              Retry
            </button>
          </div>
        ) : null}

        {status === "ready" ? (
          <footer className={styles.actions}>
            <button
              onClick={() => handleAction("orders")}
              tabIndex={actionTabIndex}
              type="button"
            >
              <ReceiptText aria-hidden="true" size={15} />
              Orders
            </button>
            <button
              onClick={() => handleAction("positions")}
              tabIndex={actionTabIndex}
              type="button"
            >
              <ChartNoAxesCombined aria-hidden="true" size={15} />
              Positions
            </button>
            <button
              onClick={() => handleAction("explain")}
              tabIndex={actionTabIndex}
              type="button"
            >
              <Sparkles aria-hidden="true" size={15} />
              Explain
            </button>
          </footer>
        ) : null}
      </section>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <label className={styles.srOnly} htmlFor={inputId}>
          {label}
        </label>
        <input
          aria-controls={contextId}
          aria-label={label}
          autoComplete="off"
          autoFocus={autoFocus}
          id={inputId}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          spellCheck="false"
          type="text"
          value={prompt}
        />
        <button
          aria-label="Send message"
          className={styles.sendButton}
          disabled={!prompt.trim()}
          type="submit"
        >
          <ArrowUp aria-hidden="true" size={19} strokeWidth={2.4} />
        </button>
      </form>

      {debug ? (
        <div aria-hidden="true" className={styles.debugLayer}>
          <span className={styles.debugReadout}>
            gap {gap.toFixed(1)}px · α {alpha.toFixed(2)} · blur {blur.toFixed(1)}px
          </span>
        </div>
      ) : null}
    </div>
  );
}

export { CARD_HEIGHT, COMPOSER_HEIGHT, MAX_GAP, MIN_GAP };
