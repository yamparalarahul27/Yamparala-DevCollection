"use client";

import {
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import styles from "./FinancialCharts.module.css";

type CssVarStyle = CSSProperties & Record<`--${string}`, string | number>;

export type DonutSegmentDatum = {
  color: string;
  glow?: string;
  label?: string;
  meta?: string;
  title?: string;
  value: number;
};

export type HaloSegmentDatum = {
  color: string;
  darkColor?: string;
  glow?: string;
  label: string;
  value: number;
};

export type BarChartDatum = {
  color?: string;
  endColor?: string;
  glow?: string;
  label: string;
  middleColor?: string;
  value: number;
  valueLabel?: string;
};

export type WalletAllocationDatum = {
  amount: string;
  arcOrder?: number;
  color: string;
  label: string;
  softColor: string;
  value: number;
};

const defaultDonutSegments: DonutSegmentDatum[] = [
  {
    color: "#8a22ff",
    glow: "#dd6cff",
    label: "30%",
    meta: "NVDA, GOOG +22",
    title: "Growth",
    value: 30,
  },
  {
    color: "#73788f",
    glow: "#dbe2ff",
    label: "22%",
    meta: "MSFT, AAPL +14",
    title: "Momentum",
    value: 22,
  },
  {
    color: "#2f2f38",
    glow: "#747785",
    label: "20%",
    meta: "TSLA, META +8",
    title: "Income",
    value: 20,
  },
  {
    color: "#555660",
    glow: "#babdca",
    label: "18%",
    meta: "AMZN, NFLX +6",
    title: "Balance",
    value: 18,
  },
  {
    color: "#41424b",
    glow: "#c6c8dc",
    label: "5%",
    meta: "Cash reserve",
    title: "Reserve",
    value: 5,
  },
  {
    color: "#3a3a43",
    glow: "#d0d1e2",
    label: "5%",
    meta: "New positions",
    title: "Watchlist",
    value: 5,
  },
];

const defaultHaloSegments: HaloSegmentDatum[] = [
  { color: "#f5c7ff", darkColor: "#7a247f", glow: "#fff0ff", label: "OPEN", value: 0.75 },
  { color: "#efa7ff", darkColor: "#6f197c", glow: "#ffd8ff", label: "AI", value: 1 },
  { color: "#ca67e9", darkColor: "#4e0b72", glow: "#f2b8ff", label: "META", value: 2 },
  { color: "#a449de", darkColor: "#391066", glow: "#e9a8ff", label: "NVDA", value: 3 },
  { color: "#c753f4", darkColor: "#4a0b77", glow: "#ffc8ff", label: "GOOG", value: 2.25 },
  { color: "#a818e5", darkColor: "#34036b", glow: "#ed9bff", label: "MSFT", value: 1.5 },
  { color: "#6817d4", darkColor: "#21035d", glow: "#c484ff", label: "AAPL", value: 2 },
];

const defaultBarDatasets: Record<string, BarChartDatum[]> = {
  "1M": [
    { color: "#6cff00", endColor: "#087000", label: "[Appreciation]", value: 389, valueLabel: "$389.00" },
    { color: "#dfff17", endColor: "#4e6900", label: "Income", value: 126, valueLabel: "$126.00" },
    { color: "#b427ff", endColor: "#f2b8ff", label: "Fees", value: 5.53, valueLabel: "-$5.53" },
  ],
  "3M": [
    { color: "#80ff00", endColor: "#087000", label: "[Appreciation]", value: 512, valueLabel: "$512.00" },
    { color: "#e9ff27", endColor: "#4e6900", label: "Income", value: 174, valueLabel: "$174.00" },
    { color: "#b427ff", endColor: "#f2b8ff", label: "Fees", value: 5.53, valueLabel: "-$5.53" },
  ],
  YTD: [
    { color: "#8dff16", endColor: "#086f00", label: "[Appreciation]", value: 603, valueLabel: "$603.00" },
    { color: "#e7ff16", endColor: "#526b00", label: "Income", value: 209, valueLabel: "$209.00" },
    { color: "#b427ff", endColor: "#f2b8ff", label: "Fees", value: 5.53, valueLabel: "-$5.53" },
  ],
  "1Y": [
    { color: "#92ff00", endColor: "#006400", label: "[Appreciation]", value: 641, valueLabel: "$641.00" },
    { color: "#eaff00", endColor: "#455f00", label: "Income", value: 221, valueLabel: "$221.00" },
    { color: "#b427ff", endColor: "#f2b8ff", label: "Fees", value: 5.53, valueLabel: "-$5.53" },
  ],
  ALL: [
    { color: "#92ff00", endColor: "#006400", label: "[Appreciation]", value: 679, valueLabel: "$679.00" },
    { color: "#eaff00", endColor: "#455f00", label: "Income", value: 239, valueLabel: "$239.00" },
    { color: "#b427ff", endColor: "#f2b8ff", label: "Fees", value: 5.53, valueLabel: "-$5.53" },
  ],
  COMPARE: [
    { color: "#80ff00", endColor: "#006400", label: "[Appreciation]", value: 579, valueLabel: "$579.00" },
    { color: "#dfff17", endColor: "#455f00", label: "Income", value: 301, valueLabel: "$301.00" },
    { color: "#b427ff", endColor: "#f2b8ff", label: "Fees", value: 8.23, valueLabel: "-$8.23" },
  ],
};

const defaultWalletAllocation: WalletAllocationDatum[] = [
  {
    amount: "$100.00",
    arcOrder: 2,
    color: "#f59e0b",
    label: "Funding",
    softColor: "#fef3c7",
    value: 15,
  },
  {
    amount: "$1150.00",
    arcOrder: 3,
    color: "#10b981",
    label: "Spot",
    softColor: "#ccfbf1",
    value: 25,
  },
  {
    amount: "$1110.00",
    arcOrder: 0,
    color: "#3b82f6",
    label: "Futures",
    softColor: "#dbeafe",
    value: 50,
  },
  {
    amount: "$10.00",
    arcOrder: 1,
    color: "#ec5bd9",
    label: "Bonus",
    softColor: "#f9c8f2",
    value: 10,
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
});

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x.toFixed(3),
    start.y.toFixed(3),
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x.toFixed(3),
    end.y.toFixed(3),
  ].join(" ");
}

function cleanId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

function getPositiveData<T extends { value: number }>(data: T[], fallback: T[]) {
  const positive = data.filter((item) => item.value > 0);

  return positive.length > 0 ? positive : fallback;
}

function getTotal(data: Array<{ value: number }>) {
  return data.reduce((sum, item) => sum + Math.max(item.value, 0), 0) || 1;
}

function formatPercent(value: number, total: number) {
  const percent = (value / total) * 100;
  const rounded = Math.round(percent * 10) / 10;

  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
}

function formatCurrency(value: number) {
  return `${value < 0 ? "-" : ""}${currencyFormatter.format(Math.abs(value))}`;
}

function getMidColor(color: string, fallback = "#1ec700") {
  return color === "#b427ff" ? "#d25cff" : fallback;
}

function handleSvgKey(event: KeyboardEvent<SVGGElement>, callback: () => void) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  callback();
}

function buildDonutSegments(data: DonutSegmentDatum[]) {
  const total = getTotal(data);
  let cursor = 0;

  return data.map((segment, index) => {
    const span = (Math.max(segment.value, 0) / total) * 360;
    const gap = Math.min(span * 0.4, segment.value <= 5 ? 5 : 3.2);
    const start = cursor + gap / 2;
    const end = cursor + span - gap / 2;
    const mid = start + (end - start) / 2;
    cursor += span;

    return {
      ...segment,
      end,
      index,
      label: segment.label ?? formatPercent(segment.value, total),
      labelPosition: polarToCartesian(210, 210, 180, mid),
      mid,
      path: describeArc(210, 210, 138, start, end),
      start,
    };
  });
}

function buildHaloSegments(data: HaloSegmentDatum[]) {
  const total = getTotal(data);
  const sweep = 236;
  let cursor = -118;

  return data.map((segment, index) => {
    const span = (Math.max(segment.value, 0) / total) * sweep;
    const gap = Math.min(span * 0.28, 4);
    const start = cursor + gap / 2;
    const end = cursor + span - gap / 2;
    cursor += span;

    return {
      ...segment,
      end,
      index,
      path: describeArc(280, 382, 246, start, end),
      start,
    };
  });
}

function buildBarData(data: BarChartDatum[]) {
  const maxValue = Math.max(...data.map((bar) => Math.abs(bar.value)), 1);

  return data.map((bar, index) => {
    const height = Math.max(10, Math.round((Math.abs(bar.value) / maxValue) * 210));

    return {
      ...bar,
      endColor: bar.endColor ?? (bar.color === "#b427ff" ? "#f2b8ff" : "#006400"),
      height,
      index,
      middleColor: bar.middleColor ?? getMidColor(bar.color ?? "#92ff00"),
      valueLabel: bar.valueLabel ?? formatCurrency(bar.value),
    };
  });
}

function buildWalletSegments(data: WalletAllocationDatum[]) {
  const total = getTotal(data);
  const ordered = data
    .map((segment, index) => ({ ...segment, index }))
    .sort((a, b) => (a.arcOrder ?? a.index) - (b.arcOrder ?? b.index));
  let cursor = -132;

  return ordered.map((segment) => {
    const span = (Math.max(segment.value, 0) / total) * 360;
    const gap = Math.min(span * 0.22, 8);
    const start = cursor + gap / 2;
    const end = cursor + span - gap / 2;
    cursor += span;

    return {
      ...segment,
      edgePath: describeArc(180, 152, 127, start, end),
      fillPath: describeArc(180, 152, 105, start, end),
      percentLabel: formatPercent(segment.value, total),
    };
  });
}

type SegmentedGrowthDonutChartProps = {
  data?: DonutSegmentDatum[];
  initialActiveIndex?: number;
};

export function SegmentedGrowthDonutChart({
  data = defaultDonutSegments,
  initialActiveIndex = 0,
}: SegmentedGrowthDonutChartProps) {
  const gradientPrefix = cleanId(useId());
  const sourceData = useMemo(
    () => getPositiveData(data, defaultDonutSegments),
    [data],
  );
  const segments = useMemo(() => buildDonutSegments(sourceData), [sourceData]);
  const [activeIndex, setActiveIndex] = useState(
    Math.min(initialActiveIndex, segments.length - 1),
  );
  const activeSegment = segments[activeIndex] ?? segments[0];
  const pointerPosition = polarToCartesian(210, 210, 106, activeSegment.mid);

  return (
    <figure className={styles.donutChart} aria-label="Growth allocation donut chart">
      <svg className={styles.donutSvg} viewBox="0 0 420 420" role="img">
        <defs>
          <filter id={`${gradientPrefix}-donut-glow`} height="170%" width="170%" x="-35%" y="-35%">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="4" />
            <feColorMatrix
              in="blur"
              result="glow"
              type="matrix"
              values="1 0 0 0 0.42 0 1 0 0 0.24 0 0 1 0 0.95 0 0 0 0.95 0"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {segments.map((segment) => (
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id={`${gradientPrefix}-donut-gradient-${segment.index}`}
              key={segment.index}
              x1="90"
              x2="330"
              y1="90"
              y2="330"
            >
              <stop offset="0%" stopColor={segment.glow ?? segment.color} />
              <stop offset="42%" stopColor={segment.color} />
              <stop offset="100%" stopColor="#15151b" />
            </linearGradient>
          ))}
        </defs>
        <circle className={styles.innerTicks} cx="210" cy="210" r="93" />
        {segments.map((segment) => {
          const isActive = segment.index === activeIndex;

          return (
            <g
              aria-label={`${segment.title ?? "Segment"} ${segment.label}`}
              className={styles.interactiveSegment}
              key={`${segment.label}-${segment.index}`}
              onClick={() => setActiveIndex(segment.index)}
              onFocus={() => setActiveIndex(segment.index)}
              onKeyDown={(event) => handleSvgKey(event, () => setActiveIndex(segment.index))}
              onPointerEnter={() => setActiveIndex(segment.index)}
              role="button"
              tabIndex={0}
            >
              <path
                className={styles.donutArcShadow}
                d={segment.path}
                pathLength={1}
              />
              <path
                className={`${styles.donutArc} ${isActive ? styles.activeDonutArc : ""}`}
                d={segment.path}
                filter={isActive ? `url(#${gradientPrefix}-donut-glow)` : undefined}
                pathLength={1}
                stroke={`url(#${gradientPrefix}-donut-gradient-${segment.index})`}
              />
              <path
                className={`${styles.donutArcHighlight} ${
                  isActive ? styles.activeDonutArcHighlight : ""
                }`}
                d={segment.path}
                pathLength={1}
              />
              <text
                className={isActive ? styles.primaryLabel : styles.arcLabel}
                dominantBaseline="middle"
                textAnchor="middle"
                x={segment.labelPosition.x}
                y={segment.labelPosition.y}
              >
                {segment.label}
              </text>
            </g>
          );
        })}
        <text className={styles.centerTitle} textAnchor="middle" x="210" y="204">
          {activeSegment.title ?? "Growth"} {activeSegment.label}
        </text>
        <text className={styles.centerMeta} textAnchor="middle" x="210" y="239">
          {activeSegment.meta ?? "Interactive allocation"}
        </text>
        <path
          className={styles.centerChevron}
          d="M304 231L314 241L304 251"
          fill="none"
        />
        <path
          className={styles.pointer}
          d="M0 -8L18 0L0 8Z"
          fill="white"
          transform={`translate(${pointerPosition.x.toFixed(2)} ${pointerPosition.y.toFixed(2)}) rotate(${(activeSegment.mid - 90).toFixed(2)})`}
        />
      </svg>
    </figure>
  );
}

type RadialGrowthHaloChartProps = {
  data?: HaloSegmentDatum[];
  initialActiveIndex?: number;
};

export function RadialGrowthHaloChart({
  data = defaultHaloSegments,
  initialActiveIndex = 3,
}: RadialGrowthHaloChartProps) {
  const gradientPrefix = cleanId(useId());
  const sourceData = useMemo(
    () => getPositiveData(data, defaultHaloSegments),
    [data],
  );
  const segments = useMemo(() => buildHaloSegments(sourceData), [sourceData]);
  const [activeIndex, setActiveIndex] = useState(
    Math.min(initialActiveIndex, segments.length - 1),
  );
  const activeSegment = segments[activeIndex] ?? segments[0];

  return (
    <figure className={styles.haloChart} aria-label="Cropped radial growth chart">
      <div className={styles.haloHeader}>
        <span>Growth</span>
        <strong>
          {activeSegment.label} <em>{activeSegment.value.toFixed(2)}%</em>
        </strong>
      </div>
      <svg className={styles.haloSvg} viewBox="0 0 560 420" role="img">
        <defs>
          <filter id={`${gradientPrefix}-halo-depth`} height="170%" width="170%" x="-35%" y="-35%">
            <feDropShadow dx="0" dy="16" floodColor="#b035ff" floodOpacity="0.42" stdDeviation="11" />
            <feDropShadow dx="0" dy="2" floodColor="#ffffff" floodOpacity="0.28" stdDeviation="1.2" />
          </filter>
          {segments.map((segment) => (
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id={`${gradientPrefix}-halo-${segment.index}`}
              key={segment.index}
              x1="60"
              x2="520"
              y1="130"
              y2="210"
            >
              <stop offset="0%" stopColor={segment.glow ?? "#f7ceff"} />
              <stop offset="36%" stopColor={segment.color} />
              <stop offset="100%" stopColor={segment.darkColor ?? "#3b087d"} />
            </linearGradient>
          ))}
        </defs>
        <circle className={styles.haloTicks} cx="280" cy="382" r="210" />
        {segments.map((segment) => {
          const isActive = activeIndex === segment.index;

          return (
            <g
              aria-label={`${segment.label} ${segment.value.toFixed(2)} percent`}
              className={styles.interactiveSegment}
              key={segment.index}
              onClick={() => setActiveIndex(segment.index)}
              onFocus={() => setActiveIndex(segment.index)}
              onKeyDown={(event) => handleSvgKey(event, () => setActiveIndex(segment.index))}
              onPointerEnter={() => setActiveIndex(segment.index)}
              role="button"
              tabIndex={0}
            >
              <path className={styles.haloExtrude} d={segment.path} pathLength={1} />
              <path
                className={`${styles.haloArc} ${isActive ? styles.activeHaloArc : ""}`}
                d={segment.path}
                filter={`url(#${gradientPrefix}-halo-depth)`}
                pathLength={1}
                stroke={`url(#${gradientPrefix}-halo-${segment.index})`}
              />
              <path
                className={`${styles.haloShine} ${isActive ? styles.activeHaloShine : ""}`}
                d={segment.path}
                pathLength={1}
              />
            </g>
          );
        })}
      </svg>
      <button
        className={styles.haloBack}
        onClick={() => setActiveIndex((activeIndex - 1 + segments.length) % segments.length)}
        type="button"
      >
        <span>Back</span>
        <i aria-hidden="true" />
      </button>
    </figure>
  );
}

type NeonAppreciationBarChartProps = {
  data?: BarChartDatum[];
  dataByTimeframe?: Record<string, BarChartDatum[]>;
  initialActiveIndex?: number;
  initialTimeframe?: string;
  timeframes?: string[];
};

export function NeonAppreciationBarChart({
  data,
  dataByTimeframe = defaultBarDatasets,
  initialActiveIndex = 0,
  initialTimeframe = "ALL",
  timeframes = ["1M", "3M", "YTD", "1Y", "ALL", "COMPARE"],
}: NeonAppreciationBarChartProps) {
  const [activeTimeframe, setActiveTimeframe] = useState(initialTimeframe);
  const currentData = dataByTimeframe[activeTimeframe] ?? data ?? defaultBarDatasets.ALL;
  const bars = useMemo(() => buildBarData(currentData), [currentData]);
  const [activeIndex, setActiveIndex] = useState(
    Math.min(initialActiveIndex, bars.length - 1),
  );

  return (
    <figure className={styles.barChart} aria-label="Appreciation income and fee bar chart">
      <div className={styles.barPlot}>
        <span className={styles.baseline} />
        {bars.map((bar) => {
          const isActive = activeIndex === bar.index;
          const isSmall = bar.height < 42;

          return (
            <button
              className={`${styles.barColumn} ${isSmall ? styles.smallBarColumn : ""} ${
                isActive ? styles.activeBarColumn : ""
              }`}
              key={bar.label}
              onClick={() => setActiveIndex(bar.index)}
              onFocus={() => setActiveIndex(bar.index)}
              onPointerEnter={() => setActiveIndex(bar.index)}
              style={
                {
                  "--bar-end": bar.endColor,
                  "--bar-glow": bar.glow ?? bar.color ?? "#92ff00",
                  "--bar-height": `${bar.height}px`,
                  "--bar-middle": bar.middleColor,
                  "--bar-start": bar.color ?? "#92ff00",
                } as CssVarStyle
              }
              type="button"
            >
              <div className={styles.barLabel}>
                <strong>{bar.label}</strong>
                <span>{bar.valueLabel}</span>
              </div>
              <span className={styles.bar} />
            </button>
          );
        })}
      </div>
      <div className={styles.timeframes} aria-label="Timeframe controls">
        {timeframes.map((timeframe) => (
          <button
            className={timeframe === activeTimeframe ? styles.activeTimeframe : undefined}
            key={timeframe}
            onClick={() => {
              setActiveTimeframe(timeframe);
              setActiveIndex(0);
            }}
            type="button"
          >
            {timeframe}
          </button>
        ))}
      </div>
    </figure>
  );
}

type WalletAllocationChartProps = {
  centerLabel?: string;
  data?: WalletAllocationDatum[];
  initialActiveIndex?: number;
};

export function WalletAllocationChart({
  centerLabel = "Wallets",
  data = defaultWalletAllocation,
  initialActiveIndex = -1,
}: WalletAllocationChartProps) {
  const filterPrefix = cleanId(useId());
  const sourceData = useMemo(
    () => getPositiveData(data, defaultWalletAllocation),
    [data],
  );
  const total = getTotal(sourceData);
  const segments = useMemo(() => buildWalletSegments(sourceData), [sourceData]);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const activeSegment = sourceData[activeIndex];
  const centerValue = activeSegment ? formatPercent(activeSegment.value, total) : sourceData.length.toString().padStart(2, "0");

  return (
    <figure className={styles.walletChart} aria-label="Wallet allocation donut chart">
      <h3 className={styles.walletTitle}>Wallet Allocation</h3>
      <div className={styles.walletRing}>
        <svg className={styles.walletSvg} viewBox="0 0 360 300" role="img">
          <defs>
            <filter id={`${filterPrefix}-wallet-soft-shadow`} height="150%" width="150%" x="-25%" y="-25%">
              <feDropShadow dx="0" dy="10" floodColor="#94a3b8" floodOpacity="0.18" stdDeviation="9" />
            </filter>
          </defs>
          {segments.map((segment) => {
            const isActive = activeIndex === segment.index;

            return (
              <g
                aria-label={`${segment.label} ${segment.percentLabel}`}
                className={styles.interactiveSegment}
                key={segment.label}
                onClick={() => setActiveIndex(segment.index)}
                onFocus={() => setActiveIndex(segment.index)}
                onKeyDown={(event) => handleSvgKey(event, () => setActiveIndex(segment.index))}
                onPointerEnter={() => setActiveIndex(segment.index)}
                role="button"
                tabIndex={0}
              >
                <path
                  className={`${styles.walletArcGlow} ${isActive ? styles.activeWalletArcGlow : ""}`}
                  d={segment.fillPath}
                  stroke={segment.color}
                />
                <path
                  className={styles.walletArcFill}
                  d={segment.fillPath}
                  filter={`url(#${filterPrefix}-wallet-soft-shadow)`}
                  stroke={segment.softColor}
                />
                <path
                  className={`${styles.walletArcEdge} ${isActive ? styles.activeWalletArcEdge : ""}`}
                  d={segment.edgePath}
                  stroke={segment.color}
                />
              </g>
            );
          })}
          <text className={styles.walletCenterLabel} textAnchor="middle" x="180" y="146">
            {activeSegment?.label ?? centerLabel}
          </text>
          <text className={styles.walletCenterValue} textAnchor="middle" x="180" y="190">
            {centerValue}
          </text>
        </svg>
      </div>
      <div className={styles.walletLegend}>
        {sourceData.map((segment, index) => (
          <button
            className={`${styles.walletRow} ${activeIndex === index ? styles.activeWalletRow : ""}`}
            key={segment.label}
            onClick={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onPointerEnter={() => setActiveIndex(index)}
            style={{ "--swatch": segment.color } as CssVarStyle}
            type="button"
          >
            <span aria-hidden="true" className={styles.walletSwatch} />
            <span className={styles.walletName}>{segment.label}</span>
            <span className={styles.walletAmount}>
              {segment.amount} <em>({formatPercent(segment.value, total)})</em>
            </span>
          </button>
        ))}
      </div>
    </figure>
  );
}

export default function FinancialChartsShowcase() {
  return (
    <section className={styles.showcase} aria-label="Financial chart component previews">
      <SegmentedGrowthDonutChart />
      <RadialGrowthHaloChart />
      <NeonAppreciationBarChart />
      <WalletAllocationChart />
    </section>
  );
}
