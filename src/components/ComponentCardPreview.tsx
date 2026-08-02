"use client";

import type { CSSProperties, ReactNode } from "react";
import BuyNowGlowButton from "@/components/BuyNowGlowButton";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import CssRingText from "@/components/CssRingText";
import DotShimmerEffect from "@/components/DotShimmerEffect";
import EarnButton from "@/components/EarnButton";
import FigmaPropertiesButton from "@/components/FigmaPropertiesButton";
import FixActionButtons from "@/components/FixActionButtons";
import FloatingToolbarTooltip from "@/components/FloatingToolbarTooltip";
import FunLoadingButton from "@/components/FunLoadingButton";
import GlassButton from "@/components/GlassButton";
import GlassCard from "@/components/GlassCard";
import GlossyButton from "@/components/GlossyButton";
import GlossyIconButtonStack from "@/components/GlossyIconButtons";
import GlowTypingInput from "@/components/GlowTypingInput";
import LightGradientButton from "@/components/LightGradientButton";
import LimeAlertRuleButton from "@/components/LimeAlertRuleButton";
import { OrangeAddViewButton } from "@/components/OrangeAddViewButton";
import PerformanceButton from "@/components/PerformanceButton";
import PointerdownCursorButton from "@/components/PointerdownCursorButton";
import ProfileAvatar from "@/components/ProfileAvatar";
import PreviewDeployButtons from "@/components/PreviewDeployButtons";
import ScrollMaskScroller from "@/components/ScrollMaskScroller";
import SlideToConvertButton from "@/components/SlideToConvertButton";
import TrackStatusButton from "@/components/TrackStatusButton";
import UltramockMetallicButton from "@/components/UltramockMetallicButton";
import styles from "./ComponentCardPreview.module.css";

type PreviewStyle = CSSProperties & Record<`--${string}`, string | number>;

function ScaledPreview({
  children,
  scale = 0.58,
}: {
  children: ReactNode;
  scale?: number;
}) {
  return (
    <div
      className={styles.scaled}
      style={{ "--preview-scale": scale } as PreviewStyle}
    >
      <div className={styles.scaledInner}>{children}</div>
    </div>
  );
}

function MiniTimeline() {
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineTrack}>
        <span />
        <span />
      </div>
      <div className={styles.timelineTicks}>
        {Array.from({ length: 14 }).map((_, index) => (
          <i key={index} />
        ))}
      </div>
    </div>
  );
}

function MiniTable() {
  return (
    <div className={styles.table}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function MiniCalendar() {
  return (
    <div className={styles.calendar}>
      {Array.from({ length: 28 }).map((_, index) => (
        <span key={index} style={{ opacity: 0.22 + (index % 5) * 0.13 }} />
      ))}
    </div>
  );
}

function MiniNetwork() {
  return (
    <div className={styles.network}>
      <svg viewBox="0 0 240 120" aria-hidden="true">
        <path d="M18 28C62 28 54 94 98 94C142 94 130 28 178 28C204 28 216 54 226 76" />
        <path d="M38 82C72 48 94 46 124 70C154 94 178 86 210 44" />
      </svg>
      <span />
      <span />
      <span />
    </div>
  );
}

function MiniDock() {
  return (
    <div className={styles.dock}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function MiniAvatar() {
  return (
    <ProfileAvatar
      bottom="#ad73ee"
      className={styles.avatar}
      dithered
      size={154}
      top="#9b4ee8"
    >
      RY
    </ProfileAvatar>
  );
}

function MiniLoader() {
  return (
    <div className={styles.loaders}>
      <span />
      <span />
      <span />
    </div>
  );
}

function MiniPills() {
  return (
    <div className={styles.pills}>
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function MiniGallery() {
  return (
    <div className={styles.gallery}>
      {Array.from({ length: 7 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function MiniNumberFlow() {
  return (
    <div className={styles.numberFlow}>
      <span>24,928</span>
      <i />
    </div>
  );
}

function MiniPeekText() {
  return (
    <div className={styles.peek}>
      <span />
      <strong />
    </div>
  );
}

function MiniFinancialCharts() {
  return (
    <div className={styles.financialCharts}>
      <div className={styles.miniDonut}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="40" />
          <path d="M60 20A40 40 0 0 1 94.6 80" />
          <path d="M92 84A40 40 0 0 1 48 98" />
          <path d="M44 97A40 40 0 0 1 22 52" />
        </svg>
      </div>
      <div className={styles.miniBars}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function MiniArticleRail() {
  return (
    <div className={styles.articleRailPreview}>
      <div className={styles.articleRailPage}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className={styles.articleRailTicks}>
        {Array.from({ length: 18 }).map((_, index) => (
          <i key={index} />
        ))}
        <b />
      </div>
    </div>
  );
}

function AbstractPreview() {
  return (
    <div className={styles.abstract}>
      <span />
      <span />
      <span />
    </div>
  );
}

export default function ComponentCardPreview({
  color,
  href,
}: {
  color: string;
  href: string;
}) {
  let preview: ReactNode;

  switch (href) {
    case "/glow-typing-input":
      preview = (
        <ScaledPreview scale={0.36}>
          <GlowTypingInput defaultValue="Let" />
        </ScaledPreview>
      );
      break;
    case "/chart-components":
      preview = <MiniFinancialCharts />;
      break;
    case "/connect-wallet-button":
      preview = (
        <ScaledPreview scale={0.86}>
          <ConnectWalletButton />
        </ScaledPreview>
      );
      break;
    case "/glass-components":
      preview = (
        <ScaledPreview scale={0.5}>
          <div className={styles.glassMini}>
            <GlassCard
              description="Ready check"
              eyebrow="Release"
              title="Signal"
            >
              <GlassButton>Open</GlassButton>
            </GlassCard>
          </div>
        </ScaledPreview>
      );
      break;
    case "/pointerdown-cursor-button":
      preview = <PointerdownCursorButton>Pointer Down</PointerdownCursorButton>;
      break;
    case "/scroll-mask-scroller":
      preview = (
        <ScaledPreview scale={0.42}>
          <ScrollMaskScroller />
        </ScaledPreview>
      );
      break;
    case "/article-scroll-rail":
      preview = <MiniArticleRail />;
      break;
    case "/css-ring-text":
      preview = (
        <ScaledPreview scale={0.4}>
          <CssRingText text="CSS RING TEXT CSS RING TEXT" />
        </ScaledPreview>
      );
      break;
    case "/dot-shimmer-effect":
      preview = (
        <div className={styles.dotShimmer}>
          <DotShimmerEffect height="100%" intensity={1.25} />
        </div>
      );
      break;
    case "/ultramock-metallic-button":
      preview = <UltramockMetallicButton />;
      break;
    case "/slide-to-convert-button":
      preview = (
        <ScaledPreview scale={0.7}>
          <SlideToConvertButton />
        </ScaledPreview>
      );
      break;
    case "/floating-toolbar-tooltip":
      preview = (
        <ScaledPreview scale={0.36}>
          <FloatingToolbarTooltip />
        </ScaledPreview>
      );
      break;
    case "/buttons":
      preview = (
        <div className={styles.buttonCluster}>
          <UltramockMetallicButton />
          <LightGradientButton>Preview</LightGradientButton>
        </div>
      );
      break;
    case "/track-status-button":
      preview = (
        <ScaledPreview scale={0.56}>
          <TrackStatusButton />
        </ScaledPreview>
      );
      break;
    case "/fix-action-buttons":
      preview = (
        <ScaledPreview scale={0.56}>
          <FixActionButtons />
        </ScaledPreview>
      );
      break;
    case "/glossy-icon-buttons":
      preview = (
        <ScaledPreview scale={0.62}>
          <GlossyIconButtonStack />
        </ScaledPreview>
      );
      break;
    case "/lime-alert-rule-button":
      preview = <LimeAlertRuleButton />;
      break;
    case "/preview-deploy-buttons":
      preview = (
        <ScaledPreview scale={0.62}>
          <PreviewDeployButtons />
        </ScaledPreview>
      );
      break;
    case "/earn-button":
      preview = (
        <ScaledPreview scale={0.56}>
          <EarnButton />
        </ScaledPreview>
      );
      break;
    case "/glossy-button":
      preview = <GlossyButton>Continue</GlossyButton>;
      break;
    case "/performance-button":
      preview = <PerformanceButton>Subscribe</PerformanceButton>;
      break;
    case "/figma-properties-button":
      preview = <FigmaPropertiesButton>Continue</FigmaPropertiesButton>;
      break;
    case "/fun-loading-button":
      preview = (
        <ScaledPreview scale={0.62}>
          <FunLoadingButton />
        </ScaledPreview>
      );
      break;
    case "/light-gradient-button":
      preview = <LightGradientButton>Continue</LightGradientButton>;
      break;
    case "/orange-add-view-button":
      preview = <OrangeAddViewButton />;
      break;
    case "/buy-now-glow-button":
      preview = (
        <ScaledPreview scale={0.72}>
          <BuyNowGlowButton />
        </ScaledPreview>
      );
      break;
    case "/date-picker":
      preview = <MiniTimeline />;
      break;
    case "/number-flow":
      preview = <MiniNumberFlow />;
      break;
    case "/floating-dock":
      preview = <MiniDock />;
      break;
    case "/svg-toc":
      preview = <MiniNetwork />;
      break;
    case "/math-curve-loaders":
      preview = <MiniLoader />;
      break;
    case "/chain-selector":
      preview = <MiniPills />;
      break;
    case "/nft-table":
      preview = <MiniTable />;
      break;
    case "/avatar-creator":
    case "/profile-avatar":
      preview = <MiniAvatar />;
      break;
    case "/pnl-calendar":
      preview = <MiniCalendar />;
      break;
    case "/peek-text":
      preview = <MiniPeekText />;
      break;
    case "/canvas-gallery":
      preview = <MiniGallery />;
      break;
    default:
      preview = <AbstractPreview />;
      break;
  }

  return (
    <div className={styles.preview} style={{ "--accent": color } as PreviewStyle}>
      {preview}
    </div>
  );
}
