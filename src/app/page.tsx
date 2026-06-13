import { existsSync, statSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import ComponentCollectionList from "@/components/ComponentCollectionList";
import {
  componentSourceRegistry,
  type ComponentSourceId,
} from "@/lib/componentSourceRegistry";

type ComponentCategory =
  | "Buttons"
  | "Inputs & Controls"
  | "Data & Charts"
  | "Navigation & Layout"
  | "Text & Typography"
  | "Visual Effects"
  | "Experiments";

type ComponentCard = {
  href: string;
  title: string;
  description: string;
  color: string;
  status?: "Latest" | "WIP" | "Experience";
};

type ComponentCardWithUpdatedAt = ComponentCard & {
  category: ComponentCategory;
  updatedAtLabel: string;
  updatedAtMs: number;
};

const components: ComponentCard[] = [
  {
    href: "/glow-typing-input",
    title: "Glow Typing Input",
    description: "Editable dark pill input with a measured custom gradient caret and violet bloom.",
    color: "#e9a5ff",
    status: "Latest",
  },
  {
    href: "/connect-wallet-button",
    title: "Connect Wallet Button",
    description: "Compact cyan glass wallet CTA with a dark dotted-arrow action block and tactile hover motion.",
    color: "#9ee8fb",
    status: "Latest",
  },
  {
    href: "/chart-components",
    title: "Chart Components",
    description: "Glossy segmented donut, cropped radial growth arc, and neon 3D bar chart components.",
    color: "#a855f7",
    status: "Latest",
  },
  {
    href: "/pointerdown-cursor-button",
    title: "Pointerdown Cursor Button",
    description: "Tactile custom-cursor button that swaps to a pressed pointer asset on active press.",
    color: "#111111",
    status: "Latest",
  },
  {
    href: "/scroll-mask-scroller",
    title: "Scroll Mask Scroller",
    description: "CSS scroll masking pattern with scrollbar space, scroll-timeline enhancement, and native fallback.",
    color: "#2563eb",
    status: "Latest",
  },
  {
    href: "/article-scroll-rail",
    title: "Article Scroll Rail",
    description: "Making Software inspired article progress rail with clickable ticks, section labels, and mobile progress bar.",
    color: "#2563eb",
    status: "Latest",
  },
  {
    href: "/css-ring-text",
    title: "CSS Ring Text",
    description: "Jhey-inspired circular text component using CSS trigonometric radius and per-character variables.",
    color: "#6d5dfc",
    status: "Latest",
  },
  {
    href: "/dot-shimmer-effect",
    title: "Dot Shimmer Effect",
    description: "Portable vanilla WebGL square grid with a cursor-trail shimmer wave behind any content.",
    color: "#f5f5f5",
    status: "Latest",
  },
  {
    href: "/siri-glsl-wave",
    title: "Siri GLSL Wave",
    description: "Vanilla WebGL Siri-style wave and fluid dots shaders with responsive canvas sizing.",
    color: "#5b7cfa",
    status: "Latest",
  },
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
    description: "Reusable dithered-gradient profile avatar builder with swatches, shuffle, and custom color add.",
    color: "#9B4EE8",
    status: "Latest",
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

const componentCategories: Partial<Record<string, ComponentCategory>> = {
  "/article-scroll-rail": "Navigation & Layout",
  "/avatarcreator": "Inputs & Controls",
  "/buttons": "Buttons",
  "/buy-now-glow-button": "Buttons",
  "/canvasgallery": "Experiments",
  "/chainselector": "Inputs & Controls",
  "/chart-components": "Data & Charts",
  "/connect-wallet-button": "Buttons",
  "/css-ring-text": "Text & Typography",
  "/datepicker": "Inputs & Controls",
  "/dot-shimmer-effect": "Visual Effects",
  "/earn-button": "Buttons",
  "/figma-properties-button": "Buttons",
  "/fix-action-buttons": "Buttons",
  "/floating-toolbar-tooltip": "Visual Effects",
  "/floatingdock": "Navigation & Layout",
  "/fun-loading-button": "Buttons",
  "/glossy-icon-buttons": "Buttons",
  "/glow-typing-input": "Inputs & Controls",
  "/light-gradient-button": "Buttons",
  "/lime-alert-rule-button": "Buttons",
  "/mathcurveloaders": "Visual Effects",
  "/nfttable": "Data & Charts",
  "/numberflow": "Data & Charts",
  "/orange-add-view-button": "Buttons",
  "/peektext": "Text & Typography",
  "/performancebutton": "Buttons",
  "/pnlcalendar": "Data & Charts",
  "/pointerdown-cursor-button": "Buttons",
  "/preview-deploy-buttons": "Buttons",
  "/scroll-mask-scroller": "Navigation & Layout",
  "/siri-glsl-wave": "Visual Effects",
  "/slide-to-convert-button": "Buttons",
  "/svgtoc": "Navigation & Layout",
  "/track-status-button": "Buttons",
  "/ultramock-metallic-button": "Buttons",
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
      category: componentCategories[component.href] ?? "Experiments",
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
const categoryCount = new Set(sortedComponents.map((c) => c.category)).size;

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
            <span>{categoryCount} categories</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="text-emerald-600">{latestCount} latest</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <ComponentCollectionList components={sortedComponents} />
      </main>
    </div>
  );
}
