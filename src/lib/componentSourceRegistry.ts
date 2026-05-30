export const componentSourceRegistry = {
  "/numberflow": [["src", "app", "numberflow", "page.tsx"]],
  "/floatingdock": [
    ["src", "components", "FloatingComponentDock.tsx"],
    ["src", "app", "floatingdock", "page.tsx"],
  ],
  "/datepicker": [
    ["src", "components", "TimelineDatePicker.tsx"],
    ["src", "components", "timeline-date-picker", "constants.ts"],
    ["src", "components", "timeline-date-picker", "panels.tsx"],
    ["src", "lib", "parseDateInput.ts"],
    ["src", "app", "datepicker", "page.tsx"],
  ],
  "/svgtoc": [["src", "app", "svgtoc", "page.tsx"]],
  "/mathcurveloaders": [["src", "app", "mathcurveloaders", "page.tsx"]],
  "/chainselector": [["src", "app", "chainselector", "page.tsx"]],
  "/nfttable": [["src", "app", "nfttable", "page.tsx"]],
  "/avatarcreator": [["src", "app", "avatarcreator", "page.tsx"]],
  "/pnlcalendar": [["src", "app", "pnlcalendar", "page.tsx"]],
  "/peektext": [
    ["src", "components", "Peektext.tsx"],
    ["src", "app", "peektext", "page.tsx"],
  ],
  "/canvasgallery": [
    ["src", "components", "CanvasGallery.tsx"],
    ["src", "app", "canvasgallery", "page.tsx"],
  ],
  "/floating-toolbar-tooltip": [
    ["src", "components", "FloatingToolbarTooltip.tsx"],
    ["src", "components", "FloatingToolbarTooltip.module.css"],
    ["src", "app", "floating-toolbar-tooltip", "page.tsx"],
  ],
  "/slide-to-convert-button": [
    ["src", "components", "SlideToConvertButton.tsx"],
    ["src", "components", "SlideToConvertButton.module.css"],
    ["src", "app", "slide-to-convert-button", "page.tsx"],
  ],
  "/ultramock-metallic-button": [
    ["src", "components", "UltramockMetallicButton.tsx"],
    ["src", "components", "UltramockMetallicButton.module.css"],
    ["src", "app", "ultramock-metallic-button", "page.tsx"],
  ],
  "/fun-loading-button": [
    ["src", "components", "FunLoadingButton.tsx"],
    ["src", "components", "FunLoadingButton.module.css"],
    ["src", "app", "fun-loading-button", "page.tsx"],
  ],
  "/buttons": [["src", "app", "buttons", "page.tsx"]],
  "/track-status-button": [
    ["src", "components", "TrackStatusButton.tsx"],
    ["src", "components", "TrackStatusButton.module.css"],
    ["src", "app", "track-status-button", "page.tsx"],
  ],
  "/fix-action-buttons": [
    ["src", "components", "FixActionButtons.tsx"],
    ["src", "components", "FixActionButtons.module.css"],
    ["src", "app", "fix-action-buttons", "page.tsx"],
  ],
  "/performancebutton": [
    ["src", "components", "PerformanceButton.tsx"],
    ["src", "components", "PerformanceButton.module.css"],
    ["src", "app", "performancebutton", "page.tsx"],
  ],
  "/figma-properties-button": [
    ["src", "components", "FigmaPropertiesButton.tsx"],
    ["src", "components", "FigmaPropertiesButton.module.css"],
    ["src", "app", "figma-properties-button", "page.tsx"],
  ],
  "/light-gradient-button": [
    ["src", "components", "LightGradientButton.tsx"],
    ["src", "components", "LightGradientButton.module.css"],
    ["src", "app", "light-gradient-button", "page.tsx"],
  ],
  "/orange-add-view-button": [
    ["src", "components", "OrangeAddViewButton.tsx"],
    ["src", "app", "orange-add-view-button", "page.tsx"],
  ],
  "/buy-now-glow-button": [
    ["src", "components", "BuyNowGlowButton.tsx"],
    ["src", "components", "BuyNowGlowButton.module.css"],
    ["src", "app", "buy-now-glow-button", "page.tsx"],
  ],
  "/glossy-icon-buttons": [
    ["src", "components", "GlossyIconButtons.tsx"],
    ["src", "components", "GlossyIconButtons.module.css"],
    ["src", "app", "glossy-icon-buttons", "page.tsx"],
  ],
  "/lime-alert-rule-button": [
    ["src", "components", "LimeAlertRuleButton.tsx"],
    ["src", "components", "LimeAlertRuleButton.module.css"],
    ["src", "app", "lime-alert-rule-button", "page.tsx"],
  ],
  "/preview-deploy-buttons": [
    ["src", "components", "PreviewDeployButtons.tsx"],
    ["src", "components", "PreviewDeployButtons.module.css"],
    ["src", "app", "preview-deploy-buttons", "page.tsx"],
  ],
  "/earn-button": [
    ["src", "components", "EarnButton.tsx"],
    ["src", "components", "EarnButton.module.css"],
    ["src", "app", "earn-button", "page.tsx"],
  ],
} as const;

export type ComponentSourceId = keyof typeof componentSourceRegistry;
export type ComponentSourceFile = readonly string[];
