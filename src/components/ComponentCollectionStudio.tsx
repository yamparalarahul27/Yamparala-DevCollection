"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import type { ComponentListItem } from "@/components/ComponentCollectionList";
import ComponentCardPreview from "@/components/ComponentCardPreview";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "proteus-last-component";
const ALL_SECTION = "All";

const CATEGORY_ORDER = [
  "Buttons",
  "Inputs & Controls",
  "Data & Charts",
  "Navigation & Layout",
  "Text & Typography",
  "Visual Effects",
  "Experiments",
];

const statusDot: Record<NonNullable<ComponentListItem["status"]>, string> = {
  Latest: "bg-emerald-500",
  Experience: "bg-sky-500",
  WIP: "bg-amber-500",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function slugFromHref(href: string) {
  return href.replace(/^\//, "");
}

function hrefFromSlug(slug: string) {
  return `/${slug.replace(/^\//, "")}`;
}

function updateParam(key: "q" | "section" | "c", value: string | null) {
  const url = new URL(window.location.href);
  if (!value) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  window.dispatchEvent(new Event("proteus-component-search-change"));
}

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("proteus-component-search-change", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("proteus-component-search-change", callback);
  };
}

function readParam(key: string) {
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

export default function ComponentCollectionStudio({
  components,
  stats,
}: {
  components: ComponentListItem[];
  stats: { total: number; categories: number; latest: number };
}) {
  const query = useSyncExternalStore(
    subscribe,
    () => readParam("q"),
    () => "",
  );
  const section = useSyncExternalStore(
    subscribe,
    () => readParam("section") || ALL_SECTION,
    () => ALL_SECTION,
  );
  const selectedSlug = useSyncExternalStore(
    subscribe,
    () => readParam("c"),
    () => "",
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const restoredRef = useRef(false);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return components.filter((component) => {
      if (
        section !== ALL_SECTION &&
        (section === "Other"
          ? CATEGORY_ORDER.includes(component.category)
          : component.category !== section)
      ) {
        return false;
      }
      if (!q) return true;
      return [component.title, component.description, component.category, component.status ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [components, query, section]);

  const availableCategories = useMemo(() => {
    const known = CATEGORY_ORDER.filter((category) =>
      components.some((component) => component.category === category),
    );
    const hasOther = components.some(
      (component) => !CATEGORY_ORDER.includes(component.category),
    );
    return hasOther ? [...known, "Other"] : known;
  }, [components]);

  const selected = useMemo(() => {
    if (!selectedSlug) return null;
    return (
      components.find((component) => slugFromHref(component.href) === selectedSlug) ??
      null
    );
  }, [components, selectedSlug]);

  useEffect(() => {
    if (selectedSlug) {
      window.localStorage.setItem(STORAGE_KEY, selectedSlug);
      return;
    }
    if (restoredRef.current) {
      return;
    }
    restoredRef.current = true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && components.some((c) => slugFromHref(c.href) === stored)) {
      updateParam("c", stored);
    }
  }, [components, selectedSlug]);

  const selectComponent = (href: string) => {
    updateParam("c", slugFromHref(href));
    setShowListOnMobile(false);
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Enter", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-component-row]"),
    );
    if (!buttons.length) return;
    const activeIndex = Math.max(
      0,
      buttons.findIndex((button) => button === document.activeElement),
    );
    const last = buttons.length - 1;
    if (event.key === "Enter") {
      buttons[activeIndex]?.click();
      return;
    }
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowUp"
            ? activeIndex <= 0
              ? last
              : activeIndex - 1
            : activeIndex >= last
              ? 0
              : activeIndex + 1;
    buttons[next]?.focus();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-[1400px] flex-col gap-4 lg:flex-row lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-[var(--proteus-border)] lg:bg-[var(--surface)] lg:shadow-[var(--proteus-shadow)]">
      <aside
        className={cn(
          "flex w-full flex-col border-[var(--proteus-border)] bg-[var(--surface)] lg:border-r",
          sidebarOpen ? "lg:w-[340px]" : "lg:w-14",
          selected && !showListOnMobile ? "hidden lg:flex" : "flex",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[var(--proteus-border)] px-3 py-3">
          {sidebarOpen ? (
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                Components
              </p>
              <p className="truncate text-sm text-[var(--text-secondary)]">
                {stats.total} · {stats.categories} cats · {stats.latest} latest
              </p>
            </div>
          ) : null}
          <button
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="ml-auto inline-flex size-9 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            onClick={() => setSidebarOpen((open) => !open)}
            type="button"
          >
            {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>

        {sidebarOpen ? (
          <>
            <div className="border-b border-[var(--proteus-border)] px-3 py-3">
              <label className="sr-only" htmlFor="studio-search">
                Search components
              </label>
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
                />
                <input
                  autoComplete="off"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-9 text-sm outline-none focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-900/10"
                  id="studio-search"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    updateParam("q", event.target.value || null)
                  }
                  placeholder="Search title, category, status"
                  type="search"
                  value={query}
                />
                {query ? (
                  <button
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100"
                    onClick={() => updateParam("q", null)}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>

              <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
                {[ALL_SECTION, ...availableCategories].map((label) => {
                  const active = section === label;
                  return (
                    <button
                      className={cn(
                        "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        active
                          ? "border-gray-950 bg-gray-950 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                      )}
                      key={label}
                      onClick={() =>
                        updateParam("section", label === ALL_SECTION ? null : label)
                      }
                      type="button"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto px-2 py-2"
              onKeyDown={handleListKeyDown}
              role="listbox"
              aria-label="Component list"
            >
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-gray-500">
                  No components match.
                </p>
              ) : (
                filtered.map((component) => {
                  const active = selected?.href === component.href;
                  return (
                    <button
                      aria-selected={active}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left outline-none transition-colors",
                        active
                          ? "bg-gray-950 text-white"
                          : "hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900/15",
                      )}
                      data-component-row=""
                      key={component.href}
                      onClick={() => selectComponent(component.href)}
                      role="option"
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: component.color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {component.title}
                      </span>
                      {component.status ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            statusDot[component.status],
                            active && "ring-2 ring-white/30",
                          )}
                          title={component.status}
                        />
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : null}
      </aside>

      <section
        className={cn(
          "flex min-w-0 flex-1 flex-col bg-[var(--surface-muted)]",
          selected && !showListOnMobile ? "flex" : selected ? "hidden lg:flex" : "flex",
        )}
      >
        {selected ? (
          <>
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--proteus-border)] bg-[var(--surface)] px-4 py-3">
              <button
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 lg:hidden"
                onClick={() => setShowListOnMobile(true)}
                type="button"
              >
                Back to list
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold text-gray-950">
                    {selected.title}
                  </h2>
                  {selected.status ? (
                    <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-600">
                      {selected.status}
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-xs text-gray-500">{selected.category}</p>
              </div>
              <Link
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-950 px-3 py-2 text-xs font-medium text-white"
                href={selected.href}
              >
                Open full page
                <ArrowUpRight size={14} />
              </Link>
              <a
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700"
                href={selected.href}
                rel="noreferrer"
                target="_blank"
              >
                New tab
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="relative min-h-[520px] flex-1 lg:min-h-0">
              <iframe
                className="absolute inset-0 h-full w-full border-0 bg-white"
                src={hrefFromSlug(slugFromHref(selected.href))}
                title={`${selected.title} preview`}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
            <div className="max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                Proteus studio
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-950">
                Pick a component to preview
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Browse the sidebar, search by name or status, and load a live
                in-page preview. Shareable via <code className="text-gray-700">?c=slug</code>.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.14em] text-gray-400">
                <span>{stats.total} components</span>
                <span>·</span>
                <span>{stats.categories} categories</span>
                <span>·</span>
                <span className="text-emerald-600">{stats.latest} latest</span>
              </div>
            </div>
            <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
              {components.slice(0, 6).map((component) => (
                <button
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  key={component.href}
                  onClick={() => selectComponent(component.href)}
                  type="button"
                >
                  <div className="h-20 border-b border-gray-100">
                    <ComponentCardPreview
                      color={component.color}
                      href={component.href}
                    />
                  </div>
                  <p className="truncate px-2.5 py-2 text-xs font-medium text-gray-800">
                    {component.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
