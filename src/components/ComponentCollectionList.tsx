"use client";

import { type ChangeEvent, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";

export type ComponentListItem = {
  category: string;
  color: string;
  description: string;
  href: string;
  status?: "Latest" | "WIP" | "Experience";
  title: string;
  updatedAtLabel: string;
  updatedAtMs: number;
};

const CATEGORY_ORDER = [
  "Buttons",
  "Inputs & Controls",
  "Data & Charts",
  "Navigation & Layout",
  "Text & Typography",
  "Visual Effects",
  "Experiments",
];

const statusStyles: Record<NonNullable<ComponentListItem["status"]>, string> = {
  Latest: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Experience: "border-sky-200 bg-sky-50 text-sky-700",
  WIP: "border-amber-200 bg-amber-50 text-amber-700",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function updateSearchParam(query: string) {
  const url = new URL(window.location.href);
  const nextQuery = query.trim();

  if (nextQuery) {
    url.searchParams.set("q", nextQuery);
  } else {
    url.searchParams.delete("q");
  }

  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  window.dispatchEvent(new Event("proteus-component-search-change"));
}

function subscribeToSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("proteus-component-search-change", callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("proteus-component-search-change", callback);
  };
}

function getSearchSnapshot() {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

function getServerSearchSnapshot() {
  return "";
}

export default function ComponentCollectionList({
  components,
}: {
  components: ComponentListItem[];
}) {
  const query = useSyncExternalStore(
    subscribeToSearch,
    getSearchSnapshot,
    getServerSearchSnapshot,
  );

  const filteredComponents = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return components;
    }

    return components.filter((component) => {
      const searchable = [
        component.title,
        component.description,
        component.category,
        component.status ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [components, query]);

  const groupedComponents = useMemo(() => {
    const knownGroups = CATEGORY_ORDER.map((category) => ({
      category,
      items: filteredComponents.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);

    const uncategorized = filteredComponents.filter(
      (item) => !CATEGORY_ORDER.includes(item.category),
    );

    return uncategorized.length
      ? [...knownGroups, { category: "Other", items: uncategorized }]
      : knownGroups;
  }, [filteredComponents]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateSearchParam(event.target.value);
  };

  const clearSearch = () => {
    updateSearchParam("");
  };

  return (
    <section aria-labelledby="components-heading" className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-gray-200/70 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1
            className="text-2xl font-semibold tracking-normal text-gray-950"
            id="components-heading"
          >
            Components
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {filteredComponents.length} of {components.length} components
          </p>
        </div>

        <div className="w-full md:w-[360px]">
          <label
            className="mb-2 block text-sm font-medium text-gray-700"
            htmlFor="component-search"
          >
            Search components
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            />
            <input
              autoComplete="off"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-10 text-sm text-gray-900 shadow-sm outline-none transition-colors duration-150 ease-out placeholder:text-gray-400 focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-900/12"
              id="component-search"
              onChange={handleSearchChange}
              placeholder="Search by name, category, or status"
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors duration-150 ease-out hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
                onClick={clearSearch}
                type="button"
              >
                <X aria-hidden="true" size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {groupedComponents.length > 0 ? (
        <div className="space-y-9">
          {groupedComponents.map((group) => (
            <section aria-labelledby={`${group.category}-heading`} key={group.category}>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h2
                  className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500"
                  id={`${group.category}-heading`}
                >
                  {group.category}
                </h2>
                <span className="text-sm text-gray-400">
                  {group.items.length}
                </span>
              </div>

              <ol className="divide-y divide-gray-200/70 border-y border-gray-200/70">
                {group.items.map((component) => (
                  <li key={component.href}>
                    <Link
                      className="group grid gap-3 px-1 py-4 outline-none transition-colors duration-150 ease-out hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900/12 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-3"
                      href={component.href}
                    >
                      <div className="min-w-0">
                        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className="size-2.5 shrink-0 rounded-full ring-2 ring-white"
                            style={{
                              backgroundColor: component.color,
                              boxShadow: `0 0 0 1px ${component.color}33`,
                            }}
                          />
                          <h3 className="text-base font-semibold text-gray-950 transition-colors duration-150 ease-out group-hover:text-[#5d3ae9]">
                            {component.title}
                          </h3>
                          {component.status ? (
                            <span
                              className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[component.status]}`}
                            >
                              {component.status}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
                          {component.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400 sm:justify-end">
                        <span>Updated {component.updatedAtLabel}</span>
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[260px] flex-col items-center justify-center border-y border-gray-200/70 px-4 text-center">
          <p className="text-base font-semibold text-gray-950">
            No components found
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Try a different name, category, or status.
          </p>
          <button
            className="mt-5 min-h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 ease-out hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
            onClick={clearSearch}
            type="button"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
