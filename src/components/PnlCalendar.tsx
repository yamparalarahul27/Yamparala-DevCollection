"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PnlDayState = "gain" | "loss" | "future";

export type PnlDayCell = {
  day: number;
  state: PnlDayState;
  value: number | null;
};

export type PnlMonthGrid = {
  id: string;
  label: string;
  leadingBlanks: number;
  cells: PnlDayCell[];
};

export type PnlCalendarProps = {
  /** Months to render for the current page. When omitted, demo data is generated. */
  months?: readonly PnlMonthGrid[];
  page?: number;
  defaultPage?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  title?: string;
  className?: string;
  /** Optional day click handler for product integrations. */
  onDayClick?: (monthId: string, cell: PnlDayCell) => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const DEFAULT_PAGE_COUNT = 6;
const MONTHS_PER_PAGE = 3;
const START_MONTH = new Date(2026, 0, 1);

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function stableHash(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

function buildDemoValue(date: Date) {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const hash = stableHash(key);
  const negative = hash % 100 < 27;
  const base = (hash % 5800) + 120;
  return negative ? -base : base;
}

export function formatPnl(value: number | null) {
  if (value === null) {
    return "";
  }

  const sign = value >= 0 ? "+" : "-";
  const abs = Math.abs(value);
  if (abs >= 1000) {
    const compact = (abs / 1000).toFixed(1).replace(/\.0$/, "");
    return `${sign}${compact}k`;
  }
  return `${sign}${abs}`;
}

export function buildPnlMonthGrid(
  monthDate: Date,
  resolvedDayLimit: number,
  getValue: (date: Date) => number = buildDemoValue,
): PnlMonthGrid {
  const totalDays = daysInMonth(monthDate);
  const leadingBlanks = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1,
  ).getDay();
  const cells: PnlDayCell[] = [];

  for (let day = 1; day <= totalDays; day += 1) {
    if (day > resolvedDayLimit) {
      cells.push({ day, state: "future", value: null });
      continue;
    }

    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    const value = getValue(date);
    cells.push({
      day,
      state: value >= 0 ? "gain" : "loss",
      value,
    });
  }

  return {
    id: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
    label: monthDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    leadingBlanks,
    cells,
  };
}

export function buildDemoPnlPage(pageIndex: number): PnlMonthGrid[] {
  const months: PnlMonthGrid[] = [];
  for (let i = 0; i < MONTHS_PER_PAGE; i += 1) {
    const monthDate = addMonths(START_MONTH, pageIndex * MONTHS_PER_PAGE + i);
    const limit =
      i === 2
        ? Math.min(7 + pageIndex * 2, daysInMonth(monthDate))
        : daysInMonth(monthDate);
    months.push(buildPnlMonthGrid(monthDate, limit));
  }
  return months;
}

function cellClassName(state: PnlDayState) {
  if (state === "gain") {
    return "border border-[#bae6d4] bg-[#dcfce7] text-[#166534]";
  }
  if (state === "loss") {
    return "border border-[#fecaca] bg-[#fee2e2] text-[#991b1b]";
  }
  return "border border-[#edf0f5] bg-[#f6f8fb] text-[#c0c6d4]";
}

export default function PnlCalendar({
  months,
  page,
  defaultPage = 0,
  pageCount = DEFAULT_PAGE_COUNT,
  onPageChange,
  title = "PnL Calendar",
  className,
  onDayClick,
}: PnlCalendarProps) {
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
  const activePage = page ?? uncontrolledPage;
  const resolvedMonths = useMemo(
    () => months ?? buildDemoPnlPage(activePage),
    [months, activePage],
  );

  function setPage(next: number) {
    if (page === undefined) {
      setUncontrolledPage(next);
    }
    onPageChange?.(next);
  }

  return (
    <div
      className={cn(
        "w-full max-w-[1120px] rounded-[18px] border border-[#e6e9ef] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-[24px] font-bold tracking-[-0.02em] text-[#111827]">
          {title}
        </h2>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[14px] text-[#6b7280]">
            {activePage + 1} / {pageCount}
          </span>
          <button
            aria-label="Previous page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={activePage === 0}
            onClick={() => setPage(Math.max(0, activePage - 1))}
            type="button"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            aria-label="Next page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={activePage >= pageCount - 1}
            onClick={() => setPage(Math.min(pageCount - 1, activePage + 1))}
            type="button"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {resolvedMonths.map((month) => (
          <section key={month.id}>
            <h3 className="font-mono text-[14px] font-semibold text-[#1f2937]">
              {month.label}
            </h3>
            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {WEEK_DAYS.map((day) => (
                <span
                  className="pb-1 text-center text-[11px] font-medium uppercase tracking-[0.04em] text-[#9ca3af]"
                  key={day}
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1.5">
              {Array.from({ length: month.leadingBlanks }, (_, i) => (
                <div
                  className="h-[48px] rounded-[10px] border border-transparent"
                  key={`${month.id}-blank-${i}`}
                />
              ))}

              {month.cells.map((cell) => {
                const interactive = Boolean(onDayClick) && cell.state !== "future";
                const cellClasses = cn(
                  "flex h-[48px] w-full flex-col justify-between rounded-[10px] px-1.5 py-1.5",
                  cellClassName(cell.state),
                  interactive &&
                    "cursor-pointer transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8162ff]",
                );

                if (interactive) {
                  return (
                    <button
                      className={cellClasses}
                      key={`${month.id}-${cell.day}`}
                      onClick={() => onDayClick?.(month.id, cell)}
                      type="button"
                    >
                      <span className="text-center text-[12px] font-semibold leading-none">
                        {cell.day}
                      </span>
                      <span className="text-center text-[11px] font-semibold leading-none tracking-[-0.01em]">
                        {formatPnl(cell.value)}
                      </span>
                    </button>
                  );
                }

                return (
                  <div className={cellClasses} key={`${month.id}-${cell.day}`}>
                    <span className="text-center text-[12px] font-semibold leading-none">
                      {cell.day}
                    </span>
                    <span className="text-center text-[11px] font-semibold leading-none tracking-[-0.01em]">
                      {formatPnl(cell.value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
