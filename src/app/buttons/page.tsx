import type { ReactNode } from "react";
import Link from "next/link";
import BuyNowGlowButton from "@/components/BuyNowGlowButton";
import ComponentShell from "@/components/ComponentShell";
import EarnButton from "@/components/EarnButton";
import FigmaPropertiesButton from "@/components/FigmaPropertiesButton";
import FixActionButtons from "@/components/FixActionButtons";
import FunLoadingButton from "@/components/FunLoadingButton";
import GlossyIconButtonStack from "@/components/GlossyIconButtons";
import LightGradientButton from "@/components/LightGradientButton";
import LimeAlertRuleButton from "@/components/LimeAlertRuleButton";
import { OrangeAddViewButton } from "@/components/OrangeAddViewButton";
import PerformanceButton from "@/components/PerformanceButton";
import PreviewDeployButtons from "@/components/PreviewDeployButtons";
import SlideToConvertButton from "@/components/SlideToConvertButton";
import TrackStatusButton from "@/components/TrackStatusButton";

type ButtonDemo = {
  description: string;
  href: string;
  preview: ReactNode;
  previewClassName?: string;
  title: string;
};

const buttonDemos: ButtonDemo[] = [
  {
    title: "Slide To Convert Button",
    href: "/slide-to-convert-button",
    description: "Swipe-to-confirm conversion pill with animated lucide arrows.",
    preview: <SlideToConvertButton />,
    previewClassName: "bg-[#050505]",
  },
  {
    title: "Track Status Button",
    href: "/track-status-button",
    description: "Glossy purple Track Status CTA with raised white text.",
    preview: <TrackStatusButton />,
  },
  {
    title: "Fix Action Buttons",
    href: "/fix-action-buttons",
    description: "Stacked Apply Fix and Preview Fix actions on a dark repair surface.",
    preview: <FixActionButtons />,
    previewClassName: "min-h-[260px] bg-[#171823] px-5",
  },
  {
    title: "Glossy Icon Buttons",
    href: "/glossy-icon-buttons",
    description: "Purple, black, and green glossy icon buttons from the stacked reference.",
    preview: <GlossyIconButtonStack />,
    previewClassName: "min-h-[380px]",
  },
  {
    title: "Lime Alert Rule Button",
    href: "/lime-alert-rule-button",
    description: "Bright lime Add Alert Rule CTA with a soft raised edge.",
    preview: <LimeAlertRuleButton />,
  },
  {
    title: "Preview Deploy Buttons",
    href: "/preview-deploy-buttons",
    description: "Paired Preview and Deploy buttons with lifted white and dark treatments.",
    preview: <PreviewDeployButtons />,
  },
  {
    title: "Earn Button",
    href: "/earn-button",
    description: "Glossy green Earn pill with a filled rewards mark.",
    preview: <EarnButton />,
    previewClassName: "bg-[#efeddb]",
  },
  {
    title: "Buy Now Glow Button",
    href: "/buy-now-glow-button",
    description: "Cyan glowing Buy Now CTA from the dark mobile finance screenshot.",
    preview: <BuyNowGlowButton />,
    previewClassName: "bg-[#070511]",
  },
  {
    title: "Orange Add View Button",
    href: "/orange-add-view-button",
    description: "Supplied orange Add View button with layered shadows.",
    preview: <OrangeAddViewButton />,
  },
  {
    title: "FUN Loading Button",
    href: "/fun-loading-button",
    description: "Animated transaction button with processing and completed states.",
    preview: <FunLoadingButton />,
    previewClassName: "bg-[#1f2026]",
  },
  {
    title: "Light Gradient Button",
    href: "/light-gradient-button",
    description: "Light gray hug button with a subtle Figma-style gradient.",
    preview: <LightGradientButton>Continue</LightGradientButton>,
  },
  {
    title: "Figma Properties Button",
    href: "/figma-properties-button",
    description: "Dark gradient button built from the shared Figma shadow properties.",
    preview: <FigmaPropertiesButton>Continue</FigmaPropertiesButton>,
  },
  {
    title: "Performance Button",
    href: "/performancebutton",
    description: "Dark Subscribe pill recreated from performance.dev.",
    preview: <PerformanceButton>Subscribe</PerformanceButton>,
    previewClassName: "bg-[#f4f6fb]",
  },
];

const CODE_CONTENT = `import Link from "next/link";
import BuyNowGlowButton from "@/components/BuyNowGlowButton";
import EarnButton from "@/components/EarnButton";
import FigmaPropertiesButton from "@/components/FigmaPropertiesButton";
import FixActionButtons from "@/components/FixActionButtons";
import FunLoadingButton from "@/components/FunLoadingButton";
import GlossyIconButtonStack from "@/components/GlossyIconButtons";
import LightGradientButton from "@/components/LightGradientButton";
import LimeAlertRuleButton from "@/components/LimeAlertRuleButton";
import { OrangeAddViewButton } from "@/components/OrangeAddViewButton";
import PerformanceButton from "@/components/PerformanceButton";
import PreviewDeployButtons from "@/components/PreviewDeployButtons";
import SlideToConvertButton from "@/components/SlideToConvertButton";
import TrackStatusButton from "@/components/TrackStatusButton";

export default function ButtonOverview() {
  return (
    <section>
      <SlideToConvertButton />
      <TrackStatusButton />
      <FixActionButtons />
      <GlossyIconButtonStack />
      <LimeAlertRuleButton />
      <PreviewDeployButtons />
      <EarnButton />
      <BuyNowGlowButton />
      <OrangeAddViewButton />
      <FunLoadingButton />
      <LightGradientButton>Continue</LightGradientButton>
      <FigmaPropertiesButton>Continue</FigmaPropertiesButton>
      <PerformanceButton>Subscribe</PerformanceButton>
      <Link href="/glossy-icon-buttons" target="_blank" rel="noopener noreferrer">
        View
      </Link>
    </section>
  );
}`;

const PROMPT_CONTENT = `Create a Next.js page that previews every button component in a responsive grid:
- Show all button demos in parallel cards rather than a stacked list.
- Include a text "View" link/button on each card.
- Each View link opens that individual button route in a new tab.
- Keep previews scaled safely inside their containers and preserve real button semantics for the components.`;

export default function ButtonsPage() {
  return (
    <ComponentShell
      title="Button Components"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <section className="w-full max-w-7xl px-1 py-4 sm:px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {buttonDemos.map((button) => (
            <article
              className="flex min-h-[318px] flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              key={button.href}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-tight text-gray-950">
                    {button.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                    {button.description}
                  </p>
                </div>
                <Link
                  aria-label={`View ${button.title} in a new tab`}
                  className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-[#5d3ae9] underline-offset-4 transition-colors hover:text-[#3f2bb3] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5d3ae9]"
                  href={button.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View
                </Link>
              </div>

              <div
                className={[
                  "mt-4 flex min-h-[244px] flex-none items-center justify-center overflow-visible rounded-md border border-gray-100 bg-white px-5 py-8",
                  button.previewClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {button.preview}
              </div>
            </article>
          ))}
        </div>
      </section>
    </ComponentShell>
  );
}
