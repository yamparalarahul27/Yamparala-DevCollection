// Single source of truth for every component in the collection.
// Adding a component: create its page under src/app/<href>/, then add one
// entry here — the homepage cards, dock navigation, and the "view source"
// API all derive from this list.

export type ComponentCategory =
  | "Buttons"
  | "Inputs & Controls"
  | "Data & Charts"
  | "Navigation & Layout"
  | "Text & Typography"
  | "Visual Effects"
  | "Experiments";

export type ComponentStatus = "Latest" | "WIP" | "Experience";

/** Path segments relative to the repo root, e.g. ["src", "components", "Foo.tsx"]. */
export type ComponentSourceFile = readonly string[];

export type ComponentRegistryEntry = {
  href: string;
  title: string;
  /** Label shown in the floating dock; defaults to title. */
  navLabel?: string;
  description: string;
  color: string;
  category: ComponentCategory;
  status?: ComponentStatus;
  sourceFiles: readonly ComponentSourceFile[];
};

export const componentRegistry: readonly ComponentRegistryEntry[] = [
  {
    href: "/floatingdock",
    title: "Floating Component Dock",
    navLabel: "Floating Dock",
    description: "Bottom-center floating utility dock with component menu, copy actions, and theme switcher.",
    color: "#1F2937",
    category: "Navigation & Layout",
    status: "WIP",
    sourceFiles: [
      ["src", "components", "FloatingComponentDock.tsx"],
      ["src", "app", "floatingdock", "page.tsx"],
    ],
  },
  {
    href: "/datepicker",
    title: "Date Picker",
    description: "Timeline ruler with drag-to-resize, NL text input, and granularity panels.",
    color: "#3B82F6",
    category: "Inputs & Controls",
    status: "Experience",
    sourceFiles: [
      ["src", "components", "TimelineDatePicker.tsx"],
      ["src", "components", "timeline-date-picker", "constants.ts"],
      ["src", "components", "timeline-date-picker", "panels.tsx"],
      ["src", "lib", "parseDateInput.ts"],
      ["src", "app", "datepicker", "page.tsx"],
    ],
  },
  {
    href: "/svgtoc",
    title: "SVG Curved TOC",
    description: "Interactive table of contents with cubic Bezier connectors, clip-path animation, and offset-path demos.",
    color: "#8162ff",
    category: "Navigation & Layout",
    status: "Latest",
    sourceFiles: [
      ["src", "app", "svgtoc", "page.tsx"],
    ],
  },
  {
    href: "/mathcurveloaders",
    title: "Math Curve Loaders",
    description: "Animated loading spinners based on mathematical curves — rose, Lissajous, hypotrochoid, and more.",
    color: "#8162ff",
    category: "Visual Effects",
    status: "Experience",
    sourceFiles: [
      ["src", "app", "mathcurveloaders", "page.tsx"],
    ],
  },
  {
    href: "/chainselector",
    title: "Chain Selector",
    description: "Horizontal pill bar for switching between blockchain networks.",
    color: "#5d3ae9",
    category: "Inputs & Controls",
    status: "WIP",
    sourceFiles: [
      ["src", "app", "chainselector", "page.tsx"],
    ],
  },
  {
    href: "/nfttable",
    title: "NFT Collections Table",
    description: "Sortable table with volume, floor price, owners, supply columns.",
    color: "#22A06B",
    category: "Data & Charts",
    status: "WIP",
    sourceFiles: [
      ["src", "app", "nfttable", "page.tsx"],
    ],
  },
  {
    href: "/avatarcreator",
    title: "Avatar Creator",
    description: "Reusable dithered-gradient profile avatar builder with swatches, shuffle, and custom color add.",
    color: "#9B4EE8",
    category: "Inputs & Controls",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "ProfileAvatar.tsx"],
      ["src", "app", "avatarcreator", "page.tsx"],
    ],
  },
  {
    href: "/pnlcalendar",
    title: "PnL Calendar",
    description: "Monthly trading calendar with positive/negative day heatmap and paged navigation.",
    color: "#0EA5A4",
    category: "Data & Charts",
    status: "WIP",
    sourceFiles: [
      ["src", "app", "pnlcalendar", "page.tsx"],
    ],
  },
  {
    href: "/peektext",
    title: "Peektext",
    description: "Inline text hover reveal that expands a tiny image with smooth transition.",
    color: "#E11D48",
    category: "Text & Typography",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "Peektext.tsx"],
      ["src", "app", "peektext", "page.tsx"],
    ],
  },
  {
    href: "/canvasgallery",
    title: "Canvas Gallery",
    description: "3D image canvas with pan, zoom, click-to-select, side panel, and minimap. Built with React Three Fiber + Drei.",
    color: "#6366f1",
    category: "Experiments",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "CanvasGallery.tsx"],
      ["src", "app", "canvasgallery", "page.tsx"],
    ],
  },
  {
    href: "/glow-typing-input",
    title: "Glow Typing Input",
    description: "Editable dark pill input with a measured custom gradient caret and violet bloom.",
    color: "#e9a5ff",
    category: "Inputs & Controls",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "GlowTypingInput.tsx"],
      ["src", "components", "GlowTypingInput.module.css"],
      ["src", "app", "glow-typing-input", "page.tsx"],
    ],
  },
  {
    href: "/chart-components",
    title: "Chart Components",
    description: "Glossy segmented donut, cropped radial growth arc, and neon 3D bar chart components.",
    color: "#a855f7",
    category: "Data & Charts",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "FinancialCharts.tsx"],
      ["src", "components", "FinancialCharts.module.css"],
      ["src", "app", "chart-components", "page.tsx"],
    ],
  },
  {
    href: "/connect-wallet-button",
    title: "Connect Wallet Button",
    description: "Compact cyan glass wallet CTA with a dark dotted-arrow action block and tactile hover motion.",
    color: "#9ee8fb",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "ConnectWalletButton.tsx"],
      ["src", "components", "ConnectWalletButton.module.css"],
      ["src", "app", "connect-wallet-button", "page.tsx"],
    ],
  },
  {
    href: "/pointerdown-cursor-button",
    title: "Pointerdown Cursor Button",
    description: "Tactile custom-cursor button that swaps to a pressed pointer asset on active press.",
    color: "#111111",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "PointerdownCursorButton.tsx"],
      ["src", "components", "PointerdownCursorButton.module.css"],
      ["public", "pointer.svg"],
      ["public", "pointerdown.svg"],
      ["src", "app", "pointerdown-cursor-button", "page.tsx"],
    ],
  },
  {
    href: "/scroll-mask-scroller",
    title: "Scroll Mask Scroller",
    description: "CSS scroll masking pattern with scrollbar space, scroll-timeline enhancement, and native fallback.",
    color: "#2563eb",
    category: "Navigation & Layout",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "ScrollMaskScroller.tsx"],
      ["src", "components", "ScrollMaskScroller.module.css"],
      ["src", "app", "scroll-mask-scroller", "page.tsx"],
    ],
  },
  {
    href: "/article-scroll-rail",
    title: "Article Scroll Rail",
    description: "Making Software inspired article progress rail with clickable ticks, section labels, and mobile progress bar.",
    color: "#2563eb",
    category: "Navigation & Layout",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "ArticleScrollRail.tsx"],
      ["src", "components", "ArticleScrollRail.module.css"],
      ["src", "app", "article-scroll-rail", "page.tsx"],
    ],
  },
  {
    href: "/css-ring-text",
    title: "CSS Ring Text",
    description: "Jhey-inspired circular text component using CSS trigonometric radius and per-character variables.",
    color: "#6d5dfc",
    category: "Text & Typography",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "CssRingText.tsx"],
      ["src", "components", "CssRingText.module.css"],
      ["src", "app", "css-ring-text", "page.tsx"],
    ],
  },
  {
    href: "/dot-shimmer-effect",
    title: "Dot Shimmer Effect",
    description: "Portable vanilla WebGL square grid with a cursor-trail shimmer wave behind any content.",
    color: "#f5f5f5",
    category: "Visual Effects",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "DotShimmerEffect.tsx"],
      ["src", "app", "dot-shimmer-effect", "page.tsx"],
    ],
  },
  {
    href: "/siri-glsl-wave",
    title: "Siri GLSL Wave",
    description: "Vanilla WebGL Siri-style wave and fluid dots shaders with responsive canvas sizing.",
    color: "#5b7cfa",
    category: "Visual Effects",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "SiriGlslWave.tsx"],
      ["src", "app", "siri-glsl-wave", "page.tsx"],
    ],
  },
  {
    href: "/floating-toolbar-tooltip",
    title: "Floating Toolbar Tooltip",
    description: "Video-inspired top-right floating toolbar with a sliding active icon surface and morphing tooltip.",
    color: "#111217",
    category: "Visual Effects",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "FloatingToolbarTooltip.tsx"],
      ["src", "components", "FloatingToolbarTooltip.module.css"],
      ["src", "app", "floating-toolbar-tooltip", "page.tsx"],
    ],
  },
  {
    href: "/ultramock-metallic-button",
    title: "Ultramock Metallic Button",
    description: "Chrome subscription CTA with pointer-following sheen, sparkles, and tactile squircle surface.",
    color: "#c7cdd3",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "UltramockMetallicButton.tsx"],
      ["src", "components", "UltramockMetallicButton.module.css"],
      ["src", "app", "ultramock-metallic-button", "page.tsx"],
    ],
  },
  {
    href: "/slide-to-convert-button",
    title: "Slide To Convert Button",
    description: "Swipe-to-confirm conversion pill with a draggable white thumb and gently moving lucide arrows.",
    color: "#f8fafc",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "SlideToConvertButton.tsx"],
      ["src", "components", "SlideToConvertButton.module.css"],
      ["src", "app", "slide-to-convert-button", "page.tsx"],
    ],
  },
  {
    href: "/buttons",
    title: "Button Components",
    description: "Parallel gallery of every button demo with preview cards and View links that open each component in a new tab.",
    color: "#5d3ae9",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "app", "buttons", "page.tsx"],
    ],
  },
  {
    href: "/track-status-button",
    title: "Track Status Button",
    description: "Glossy purple Track Status CTA with a wide molded surface and oversized white text.",
    color: "#7a2fd2",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "TrackStatusButton.tsx"],
      ["src", "components", "TrackStatusButton.module.css"],
      ["src", "app", "track-status-button", "page.tsx"],
    ],
  },
  {
    href: "/fix-action-buttons",
    title: "Fix Action Buttons",
    description: "Stacked Apply Fix and Preview Fix controls with green glow and dark elevated treatment.",
    color: "#08c78d",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "FixActionButtons.tsx"],
      ["src", "components", "FixActionButtons.module.css"],
      ["src", "app", "fix-action-buttons", "page.tsx"],
    ],
  },
  {
    href: "/performancebutton",
    title: "Performance Button",
    description: "Pixel-perfect recreation of the performance.dev Subscribe button — dark pill with two-layer shadow and inset gradient ring.",
    color: "#0a0d1a",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "PerformanceButton.tsx"],
      ["src", "components", "PerformanceButton.module.css"],
      ["src", "app", "performancebutton", "page.tsx"],
    ],
  },
  {
    href: "/figma-properties-button",
    title: "Figma Properties Button",
    description: "Reusable dark gradient button built from the shared Figma radius, shadow, and opacity properties.",
    color: "#323232",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "FigmaPropertiesButton.tsx"],
      ["src", "components", "FigmaPropertiesButton.module.css"],
      ["src", "app", "figma-properties-button", "page.tsx"],
    ],
  },
  {
    href: "/fun-loading-button",
    title: "FUN Loading Button",
    description: "Video-inspired transaction button with glossy loading sweep, spinner, and completed state.",
    color: "#2f2f30",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "FunLoadingButton.tsx"],
      ["src", "components", "FunLoadingButton.module.css"],
      ["src", "app", "fun-loading-button", "page.tsx"],
    ],
  },
  {
    href: "/light-gradient-button",
    title: "Light Gradient Button",
    description: "Figma-spec light gray hug button with subtle gradient, inset highlight, and soft shadow.",
    color: "#d4d4d4",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "LightGradientButton.tsx"],
      ["src", "components", "LightGradientButton.module.css"],
      ["src", "app", "light-gradient-button", "page.tsx"],
    ],
  },
  {
    href: "/orange-add-view-button",
    title: "Orange Add View Button",
    description: "Supplied orange Add View button with layered outer and inset shadows.",
    color: "#ea580c",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "OrangeAddViewButton.tsx"],
      ["src", "app", "orange-add-view-button", "page.tsx"],
    ],
  },
  {
    href: "/buy-now-glow-button",
    title: "Buy Now Glow Button",
    description: "Cyan glowing Buy Now button recreated from the dark mobile finance screenshot.",
    color: "#13f5d0",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "BuyNowGlowButton.tsx"],
      ["src", "components", "BuyNowGlowButton.module.css"],
      ["src", "app", "buy-now-glow-button", "page.tsx"],
    ],
  },
  {
    href: "/glossy-icon-buttons",
    title: "Glossy Icon Buttons",
    description: "Purple, black, and green glossy icon buttons recreated from the shared stacked reference image.",
    color: "#6255d5",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "GlossyIconButtons.tsx"],
      ["src", "components", "GlossyIconButtons.module.css"],
      ["src", "app", "glossy-icon-buttons", "page.tsx"],
    ],
  },
  {
    href: "/lime-alert-rule-button",
    title: "Lime Alert Rule Button",
    description: "Bright lime Add Alert Rule CTA with plus icon, rounded border, and soft raised finish.",
    color: "#a3e635",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "LimeAlertRuleButton.tsx"],
      ["src", "components", "LimeAlertRuleButton.module.css"],
      ["src", "app", "lime-alert-rule-button", "page.tsx"],
    ],
  },
  {
    href: "/preview-deploy-buttons",
    title: "Preview Deploy Buttons",
    description: "Paired Preview and Deploy buttons with white lifted and dark glossy visual treatments.",
    color: "#2d2d34",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "PreviewDeployButtons.tsx"],
      ["src", "components", "PreviewDeployButtons.module.css"],
      ["src", "app", "preview-deploy-buttons", "page.tsx"],
    ],
  },
  {
    href: "/earn-button",
    title: "Earn Button",
    description: "Oversized glossy green Earn pill with a filled rewards icon and cropped reference-inspired stance.",
    color: "#006b36",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "EarnButton.tsx"],
      ["src", "components", "EarnButton.module.css"],
      ["src", "app", "earn-button", "page.tsx"],
    ],
  },
  {
    href: "/numberflow",
    title: "NumberFlow",
    description: "Animated number transitions — currency, percent, compact, countdown, continuous, trend, and stepper variants.",
    color: "#8162ff",
    category: "Data & Charts",
    status: "Latest",
    sourceFiles: [
      ["src", "app", "numberflow", "page.tsx"],
    ],
  },
  {
    href: "/glass-components",
    title: "Glass Button & Card",
    description: "Frosted CTA and card components using the extracted gradient border, blur, shadow, and noise recipe.",
    color: "#f8fafc",
    category: "Buttons",
    status: "Latest",
    sourceFiles: [
      ["src", "components", "GlassButton.tsx"],
      ["src", "components", "GlassCard.tsx"],
      ["src", "components", "GlassComponents.module.css"],
      ["src", "app", "glass-components", "page.tsx"],
    ],
  },
];

export const componentNavLinks: Array<{ href: string; label: string }> =
  componentRegistry.map((entry) => ({
    href: entry.href,
    label: entry.navLabel ?? entry.title,
  }));

export const componentSourceRegistry: Record<string, readonly ComponentSourceFile[]> =
  Object.fromEntries(componentRegistry.map((entry) => [entry.href, entry.sourceFiles]));
