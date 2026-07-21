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
  type KeyboardEvent,
} from "react";
import { ArrowUp, CircleAlert, ReceiptText, RefreshCw } from "lucide-react";
import useGapMotion from "@/lib/useGapMotion";
import styles from "./TradingContextComposer.module.css";

export type TradingContextAction =
  | "orders"
  | "positions"
  | "explain"
  | "asset"
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
  /** Called when the user dismisses the card with Esc while `forceOpen` is controlled. */
  onDismiss?: () => void;
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

const actionPrompts: Record<"orders" | "positions" | "explain", string> = {
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

function BitcoinMark() {
  return (
    <svg aria-hidden="true" className={styles.assetLogo} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#f7931a" />
      <path
        fill="#ffffff"
        d="M21.2 14.1c.3-1.9-1.1-2.9-3-3.6l.6-2.5-1.5-.4-.6 2.4c-.4-.1-.8-.2-1.2-.3l.6-2.4-1.5-.4-.6 2.5c-.3-.1-.6-.1-.9-.2l-2.1-.5-.4 1.6s1.1.3 1.1.3c.6.2.7.6.7.9l-.7 2.9h.2l-.2.1-1 4c-.1.2-.3.5-.7.4 0 0-1.1-.3-1.1-.3l-.8 1.8 2 .5c.4.1.7.2 1.1.3l-.6 2.5 1.5.4.6-2.5c.4.1.8.2 1.2.3l-.6 2.5 1.5.4.6-2.5c2.6.5 4.5.3 5.3-2 .7-1.9 0-3-1.4-3.7 1-.2 1.7-.9 1.9-2.2zm-3.4 4.9c-.5 1.9-3.7.9-4.7.6l.8-3.4c1 .3 4.4.8 3.9 2.8zm.5-4.9c-.4 1.7-3.1.8-3.9.6l.8-3c.9.2 3.6.6 3.1 2.4z"
      />
    </svg>
  );
}

function EthereumMark() {
  return (
    <svg aria-hidden="true" className={styles.assetLogo} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#627eea" />
      <path d="M16.5 4v8.87l7.5 3.35L16.5 4z" fill="#ffffff" fillOpacity=".62" />
      <path d="M16.5 4 9 16.22l7.5-3.35V4z" fill="#ffffff" />
      <path d="M16.5 21.97V28l7.5-10.38-7.5 4.35z" fill="#ffffff" fillOpacity=".62" />
      <path d="M16.5 28v-6.03L9 17.62 16.5 28z" fill="#ffffff" />
      <path d="m16.5 20.57 7.5-4.35-7.5-3.34v7.69z" fill="#ffffff" fillOpacity=".28" />
      <path d="m9 16.22 7.5 4.35v-7.69L9 16.22z" fill="#ffffff" fillOpacity=".62" />
    </svg>
  );
}

function SolanaMark() {
  const gradientId = `sol-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg aria-hidden="true" className={styles.assetLogo} viewBox="0 0 32 32">
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={gradientId} x1="8" x2="24" y1="24" y2="8">
          <stop stopColor="#9945ff" />
          <stop offset="1" stopColor="#14f195" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="#1b1b1f" />
      <path
        fill={`url(#${gradientId})`}
        d="M10.6 19.7a.66.66 0 0 1 .46-.19h11.5c.29 0 .43.35.23.55l-2.27 2.28a.66.66 0 0 1-.46.19H8.56a.32.32 0 0 1-.23-.55l2.27-2.28zm0-8.51a.66.66 0 0 1 .46-.19h11.5c.29 0 .43.35.23.55l-2.27 2.28a.66.66 0 0 1-.46.19H8.56a.32.32 0 0 1-.23-.55l2.27-2.28zm11.46 4.23a.66.66 0 0 0-.46-.19h-11.5a.32.32 0 0 0-.23.55l2.27 2.28c.12.12.29.19.46.19h11.5c.29 0 .43-.35.23-.55l-2.27-2.28z"
      />
    </svg>
  );
}

function AssetMark({ asset }: { asset: TradingAssetContext }) {
  const symbol = asset.name.split(/[-/]/)[0].toUpperCase();

  if (symbol === "BTC") return <BitcoinMark />;
  if (symbol === "ETH") return <EthereumMark />;
  if (symbol === "SOL") return <SolanaMark />;

  return (
    <span
      aria-hidden="true"
      className={styles.assetIcon}
      style={{ "--asset-accent": asset.accent ?? "#64748b" } as CSSProperties}
    >
      {asset.icon}
    </span>
  );
}

function TradingRows({
  assets,
  onAssetSelect,
  tabbable,
}: {
  assets: readonly TradingAssetContext[];
  onAssetSelect: (asset: TradingAssetContext) => void;
  tabbable: boolean;
}) {
  return (
    <ul className={styles.assetList}>
      {assets.slice(0, 3).map((asset) => (
        <li className={styles.assetItem} key={`${asset.name}-${asset.market}`}>
          <button
            className={styles.assetRow}
            onClick={() => onAssetSelect(asset)}
            tabIndex={tabbable ? 0 : -1}
            type="button"
          >
            <AssetMark asset={asset} />
            <span className={styles.assetIdentity}>
              <strong>{asset.name}</strong>
              <span className={styles.marketTag}>
                {asset.market === "futures" ? "Futures" : "Spot"}
              </span>
            </span>
            <span className={styles.pnlBlock} data-positive={asset.pnl >= 0 ? "true" : "false"}>
              <strong>{formatPnl(asset.pnl)}</strong>
              <span>
                {asset.market === "futures" ? "uPnL" : "PnL"} · {Math.round(asset.coverage)}% of
                portfolio
              </span>
            </span>
          </button>
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
  onDismiss,
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
  const [dismissed, setDismissed] = useState(false);
  const prompt = value ?? internalValue;
  const inferredOpen = /\b(orders?|positions?)\b/i.test(prompt);
  const isOpen = forceOpen ?? (inferredOpen && !dismissed);

  const motion = useGapMotion(
    manualGap !== undefined ? manualGap : isOpen ? MAX_GAP : MIN_GAP,
  );
  const wasOpenRef = useRef(isOpen);
  const hadManualRef = useRef(manualGap !== undefined);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const escCloseRef = useRef(false);

  useEffect(() => {
    if (manualGap !== undefined) {
      motion.scrubTo(Math.min(MAX_GAP, Math.max(MIN_GAP, manualGap)));
      hadManualRef.current = true;
      return;
    }

    const manualReleased = hadManualRef.current;
    hadManualRef.current = false;

    if (isOpen === wasOpenRef.current && !manualReleased) {
      return;
    }

    wasOpenRef.current = isOpen;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const play = () =>
      motion.playTo(isOpen ? MAX_GAP : MIN_GAP, {
        direction: isOpen ? "in" : "out",
        maxOvershootPx: OVERSHOOT_CAP_PX,
      });

    // Debounce typed closes so the card doesn't slam shut while the user
    // edits through a keyword; Esc and explicit toggles close immediately.
    const typedClose = !isOpen && forceOpen === undefined && !manualReleased && !escCloseRef.current;
    escCloseRef.current = false;

    if (typedClose) {
      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null;
        play();
      }, 350);
    } else {
      play();
    }
  }, [forceOpen, isOpen, manualGap, motion]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

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
    if (dismissed) {
      setDismissed(false);
    }

    updatePrompt(event.currentTarget.value);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Escape" || !isOpen) {
      return;
    }

    event.preventDefault();
    escCloseRef.current = true;

    if (forceOpen === undefined) {
      setDismissed(true);
    } else {
      onDismiss?.();
    }
  }

  function handleAssetSelect(asset: TradingAssetContext) {
    const nextPrompt = `Explain my ${asset.name} ${
      asset.market === "futures" ? "position" : "holdings"
    }`;
    updatePrompt(nextPrompt);
    onAction?.("asset", nextPrompt);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (prompt.trim()) {
      onSubmitPrompt?.(prompt.trim());
    }
  }

  function handleAction(action: "orders" | "positions" | "explain") {
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
      data-revealed={alpha > 0.25 ? "true" : "false"}
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
          <strong>{contextTitle}</strong>
          <span className={styles.totalCoverage}>{Math.round(coverage)}% covered</span>
        </header>

        {status === "loading" ? <LoadingRows /> : null}
        {status === "ready" ? (
          <TradingRows
            assets={assets}
            onAssetSelect={handleAssetSelect}
            tabbable={isContextInteractive}
          />
        ) : null}
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
            <button onClick={() => handleAction("orders")} tabIndex={actionTabIndex} type="button">
              Orders
            </button>
            <button
              onClick={() => handleAction("positions")}
              tabIndex={actionTabIndex}
              type="button"
            >
              Positions
            </button>
            <button
              className={styles.primaryAction}
              onClick={() => handleAction("explain")}
              tabIndex={actionTabIndex}
              type="button"
            >
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
          onKeyDown={handleInputKeyDown}
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
