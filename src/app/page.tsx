import { existsSync, statSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import {
  componentSourceRegistry,
  type ComponentSourceId,
} from "@/lib/componentSourceRegistry";

type ComponentCard = {
  href: string;
  title: string;
  description: string;
  color: string;
  status?: "Latest" | "WIP" | "Experience";
};

type ComponentCardWithUpdatedAt = ComponentCard & {
  updatedAt: Date;
  updatedAtLabel: string;
  updatedAtMs: number;
};

const components: ComponentCard[] = [
  {
    href: "/ultramock-metallic-button",
    title: "Ultramock Metallic Button",
    description: "Chrome subscription CTA with pointer-following sheen, sparkles, and tactile squircle surface.",
    color: "#c7cdd3",
    status: "Latest",
  },
  {
    href: "/slide-to-convert-button",
    title: "Slide To Convert Button",
    description: "Swipe-to-confirm conversion pill with a draggable white thumb and gently moving lucide arrows.",
    color: "#f8fafc",
    status: "Latest",
  },
  {
    href: "/floating-toolbar-tooltip",
    title: "Floating Toolbar Tooltip",
    description: "Video-inspired top-right floating toolbar with a sliding active icon surface and morphing tooltip.",
    color: "#111217",
    status: "Latest",
  },
  {
    href: "/buttons",
    title: "Button Components",
    description: "Parallel gallery of every button demo with preview cards and View links that open each component in a new tab.",
    color: "#5d3ae9",
    status: "Latest",
  },
  {
    href: "/track-status-button",
    title: "Track Status Button",
    description: "Glossy purple Track Status CTA with a wide molded surface and oversized white text.",
    color: "#7a2fd2",
    status: "Latest",
  },
  {
    href: "/fix-action-buttons",
    title: "Fix Action Buttons",
    description: "Stacked Apply Fix and Preview Fix controls with green glow and dark elevated treatment.",
    color: "#08c78d",
    status: "Latest",
  },
  {
    href: "/glossy-icon-buttons",
    title: "Glossy Icon Buttons",
    description: "Purple, black, and green glossy icon buttons recreated from the shared stacked reference image.",
    color: "#6255d5",
    status: "Latest",
  },
  {
    href: "/lime-alert-rule-button",
    title: "Lime Alert Rule Button",
    description: "Bright lime Add Alert Rule CTA with plus icon, rounded border, and soft raised finish.",
    color: "#a3e635",
    status: "Latest",
  },
  {
    href: "/preview-deploy-buttons",
    title: "Preview Deploy Buttons",
    description: "Paired Preview and Deploy buttons with white lifted and dark glossy visual treatments.",
    color: "#2d2d34",
    status: "Latest",
  },
  {
    href: "/earn-button",
    title: "Earn Button",
    description: "Oversized glossy green Earn pill with a filled rewards icon and cropped reference-inspired stance.",
    color: "#006b36",
    status: "Latest",
  },
  {
    href: "/numberflow",
    title: "NumberFlow",
    description: "Animated number transitions — currency, percent, compact, countdown, continuous, trend, and stepper variants.",
    color: "#8162ff",
    status: "Latest",
  },
  {
    href: "/floatingdock",
    title: "Floating Component Dock",
    description: "Bottom-center floating utility dock with component menu, copy actions, and theme switcher.",
    color: "#1F2937",
    status: "WIP",
  },
  {
    href: "/datepicker",
    title: "Date Picker",
    description:
      "Timeline ruler with drag-to-resize, NL text input, and granularity panels.",
    color: "#3B82F6",
    status: "Experience",
  },
  {
    href: "/svgtoc",
    title: "SVG Curved TOC",
    description: "Interactive table of contents with cubic Bezier connectors, clip-path animation, and offset-path demos.",
    color: "#8162ff",
    status: "Latest",
  },
  {
    href: "/mathcurveloaders",
    title: "Math Curve Loaders",
    description: "Animated loading spinners based on mathematical curves — rose, Lissajous, hypotrochoid, and more.",
    color: "#8162ff",
    status: "Experience",
  },
  {
    href: "/chainselector",
    title: "Chain Selector",
    description: "Horizontal pill bar for switching between blockchain networks.",
    color: "#5d3ae9",
    status: "WIP",
  },
  {
    href: "/nfttable",
    title: "NFT Collections Table",
    description: "Sortable table with volume, floor price, owners, supply columns.",
    color: "#22A06B",
    status: "WIP",
  },
  {
    href: "/avatarcreator",
    title: "Avatar Creator",
    description: "Split-tone avatar builder with swatch picker, shuffle action, and custom color add.",
    color: "#9B4EE8",
    status: "WIP",
  },
  {
    href: "/pnlcalendar",
    title: "PnL Calendar",
    description: "Monthly trading calendar with positive/negative day heatmap and paged navigation.",
    color: "#0EA5A4",
    status: "WIP",
  },
  {
    href: "/peektext",
    title: "Peektext",
    description: "Inline text hover reveal that expands a tiny image with smooth transition.",
    color: "#E11D48",
    status: "Latest",
  },
  {
    href: "/canvasgallery",
    title: "Canvas Gallery",
    description: "3D image canvas with pan, zoom, click-to-select, side panel, and minimap. Built with React Three Fiber + Drei.",
    color: "#6366f1",
    status: "Latest",
  },
  {
    href: "/performancebutton",
    title: "Performance Button",
    description: "Pixel-perfect recreation of the performance.dev Subscribe button — dark pill with two-layer shadow and inset gradient ring.",
    color: "#0a0d1a",
    status: "Latest",
  },
  {
    href: "/figma-properties-button",
    title: "Figma Properties Button",
    description: "Reusable dark gradient button built from the shared Figma radius, shadow, and opacity properties.",
    color: "#323232",
    status: "Latest",
  },
  {
    href: "/fun-loading-button",
    title: "FUN Loading Button",
    description: "Video-inspired transaction button with glossy loading sweep, spinner, and completed state.",
    color: "#2f2f30",
    status: "Latest",
  },
  {
    href: "/light-gradient-button",
    title: "Light Gradient Button",
    description: "Figma-spec light gray hug button with subtle gradient, inset highlight, and soft shadow.",
    color: "#d4d4d4",
    status: "Latest",
  },
  {
    href: "/orange-add-view-button",
    title: "Orange Add View Button",
    description: "Supplied orange Add View button with layered outer and inset shadows.",
    color: "#ea580c",
    status: "Latest",
  },
  {
    href: "/buy-now-glow-button",
    title: "Buy Now Glow Button",
    description: "Cyan glowing Buy Now button recreated from the dark mobile finance screenshot.",
    color: "#13f5d0",
    status: "Latest",
  },
];

const statusStyles: Record<NonNullable<ComponentCard["status"]>, string> = {
  Latest: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Experience: "border-sky-200 bg-sky-50 text-sky-700",
  WIP: "border-amber-200 bg-amber-50 text-amber-700",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function getComponentUpdatedAt(href: string) {
  const sourceFiles = componentSourceRegistry[href as ComponentSourceId];

  if (!sourceFiles) {
    return new Date(0);
  }

  const newestMs = sourceFiles.reduce((latest, filePathSegments) => {
    const absolutePath = path.join(process.cwd(), ...filePathSegments);

    if (!existsSync(absolutePath)) {
      return latest;
    }

    return Math.max(latest, statSync(absolutePath).mtimeMs);
  }, 0);

  return new Date(newestMs);
}

const sortedComponents: ComponentCardWithUpdatedAt[] = components
  .map((component) => {
    const updatedAt = getComponentUpdatedAt(component.href);

    return {
      ...component,
      updatedAt,
      updatedAtLabel: dateFormatter.format(updatedAt),
      updatedAtMs: updatedAt.getTime(),
    };
  })
  .sort((a, b) => {
    if (b.updatedAtMs !== a.updatedAtMs) {
      return b.updatedAtMs - a.updatedAtMs;
    }

    return a.title.localeCompare(b.title);
  });

const totalCount = sortedComponents.length;
const latestCount = sortedComponents.filter((c) => c.status === "Latest").length;

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-gray-200/60 px-6 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Image
            src="/proteus-logo.svg"
            alt="Proteus logo"
            width={1329}
            height={400}
            className="h-auto w-[180px] sm:w-[220px]"
            priority
          />
          <p className="mt-3 text-sm text-gray-500">
            Component Collection by Yamparala Rahul · Design Engineer
          </p>
          <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-gray-400">
            <span>{totalCount} components</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="text-emerald-600">{latestCount} latest</span>
          </div>
        </div>
      </header>

      {/* Component grid */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <ol className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedComponents.map((comp, idx) => (
            <li className="min-w-0" key={comp.href}>
              <Link
                href={comp.href}
                className="group relative flex h-full min-h-[184px] flex-col rounded-lg border border-gray-200/70 bg-white/55 p-5 transition-[background-color,border-color,transform] duration-150 ease-out hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8162ff]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="shrink-0 font-mono text-[11px] text-gray-400">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
                      style={{
                        backgroundColor: comp.color,
                        boxShadow: `0 0 0 1px ${comp.color}33`,
                      }}
                    />
                  </div>
                  {comp.status ? (
                    <span
                      className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusStyles[comp.status]}`}
                    >
                      {comp.status}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 min-w-0 flex-1">
                  <h2 className="text-lg font-semibold leading-tight text-gray-900 transition-colors group-hover:text-[#5d3ae9]">
                    {comp.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-gray-400">
                    Updated {comp.updatedAtLabel}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {comp.description}
                  </p>
                </div>

                <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors group-hover:text-[#8162ff]">
                  <span>View component</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M5.5 3L10.5 8L5.5 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
