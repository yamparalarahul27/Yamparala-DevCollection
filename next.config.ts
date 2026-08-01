import type { NextConfig } from "next";

const legacyRouteRedirects = [
  ["floatingdock", "floating-dock"],
  ["datepicker", "date-picker"],
  ["svgtoc", "svg-toc"],
  ["mathcurveloaders", "math-curve-loaders"],
  ["chainselector", "chain-selector"],
  ["nfttable", "nft-table"],
  ["avatarcreator", "avatar-creator"],
  ["pnlcalendar", "pnl-calendar"],
  ["peektext", "peek-text"],
  ["canvasgallery", "canvas-gallery"],
  ["performancebutton", "performance-button"],
  ["numberflow", "number-flow"],
] as const;

const nextConfig: NextConfig = {
  reactCompiler: true,
  // /api/component-source reads component source files from disk at request
  // time; make sure they ship with the serverless function bundle.
  outputFileTracingIncludes: {
    "/api/component-source": [
      "./src/**/*",
      "./public/pointer.svg",
      "./public/pointerdown.svg",
    ],
  },
  async redirects() {
    return legacyRouteRedirects.map(([from, to]) => ({
      source: `/${from}`,
      destination: `/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
