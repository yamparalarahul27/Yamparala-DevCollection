"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PlaygroundControl =
  | {
      type: "select";
      id: string;
      label: string;
      value: string;
      options: Array<{ label: string; value: string }>;
      onChange: (value: string) => void;
    }
  | {
      type: "toggle";
      id: string;
      label: string;
      value: boolean;
      onChange: (value: boolean) => void;
    }
  | {
      type: "text";
      id: string;
      label: string;
      value: string;
      placeholder?: string;
      onChange: (value: string) => void;
    };

export type PropsPlaygroundProps = {
  title?: string;
  description?: string;
  controls: PlaygroundControl[];
  children: ReactNode;
  className?: string;
  stageClassName?: string;
};

export default function PropsPlayground({
  title = "Props playground",
  description,
  controls,
  children,
  className,
  stageClassName,
}: PropsPlaygroundProps) {
  return (
    <div
      className={cn(
        "grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_240px]",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-h-[280px] items-center justify-center rounded-2xl border border-[var(--proteus-border)] bg-[var(--surface)] p-6 shadow-[var(--proteus-shadow)] sm:p-10",
          stageClassName,
        )}
      >
        {children}
      </div>

      <aside className="rounded-2xl border border-[var(--proteus-border)] bg-[var(--surface)] p-4 shadow-[var(--proteus-shadow)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          {title}
        </p>
        {description ? (
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}

        <div className="mt-4 space-y-3">
          {controls.map((control) => {
            if (control.type === "toggle") {
              return (
                <label
                  key={control.id}
                  className="flex items-center justify-between gap-3 text-[13px] text-[var(--foreground)]"
                >
                  <span>{control.label}</span>
                  <input
                    checked={control.value}
                    className="h-4 w-4 accent-[var(--accent-purple)]"
                    onChange={(event) => control.onChange(event.target.checked)}
                    type="checkbox"
                  />
                </label>
              );
            }

            if (control.type === "text") {
              return (
                <label
                  key={control.id}
                  className="block text-[12px] text-[var(--text-secondary)]"
                >
                  {control.label}
                  <input
                    className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-muted)] px-2.5 py-1.5 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--accent-purple)]"
                    onChange={(event) => control.onChange(event.target.value)}
                    placeholder={control.placeholder}
                    type="text"
                    value={control.value}
                  />
                </label>
              );
            }

            return (
              <label
                key={control.id}
                className="block text-[12px] text-[var(--text-secondary)]"
              >
                {control.label}
                <select
                  className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-muted)] px-2.5 py-1.5 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--accent-purple)]"
                  onChange={(event) => control.onChange(event.target.value)}
                  value={control.value}
                >
                  {control.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
