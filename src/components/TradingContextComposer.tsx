"use client";

import {
  useId,
  useMemo,
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
  gap?: number;
  label?: string;
  name?: string;
  onAction?: (action: TradingContextAction, prompt: string) => void;
  onRetry?: () => void;
  onSubmitPrompt?: (prompt: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  scrubbing?: boolean;
  status?: TradingContextStatus;
  value?: string;
};

const CARD_HEIGHT = 236;
const MAX_GAP = 22;

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
  gap = 22,
  label = "Ask about your portfolio",
  name,
  onAction,
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
  const [internalValue, setInternalValue] = useState(defaultValue);
  const prompt = value ?? internalValue;
  const inferredOpen = /\b(orders?|positions?)\b/i.test(prompt);
  const isOpen = forceOpen ?? inferredOpen;
  const clampedGap = Math.max(-CARD_HEIGHT, Math.min(MAX_GAP, gap));
  const revealProgress = (clampedGap + CARD_HEIGHT) / (CARD_HEIGHT + MAX_GAP);
  const isContextInteractive = isOpen && revealProgress > 0.72;
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

  const actionTabIndex = isContextInteractive && status === "ready" ? 0 : -1;
  const motionStyle = {
    "--context-blur": `${4 * (1 - revealProgress)}px`,
    "--context-gap": `${clampedGap}px`,
    "--context-opacity": revealProgress,
    "--context-scale": 0.96 + 0.04 * revealProgress,
  } as CSSProperties;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-debug={debug ? "true" : "false"}
      data-interactive={isContextInteractive ? "true" : "false"}
      data-open={isOpen ? "true" : "false"}
      data-scrubbing={scrubbing ? "true" : "false"}
      style={motionStyle}
    >
      <section
        aria-hidden={!isOpen || revealProgress < 0.1}
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
            <button
              onClick={handleRetry}
              tabIndex={isOpen && revealProgress > 0.72 ? 0 : -1}
              type="button"
            >
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
    </div>
  );
}
