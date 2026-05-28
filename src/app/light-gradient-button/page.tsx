import ComponentShell from "@/components/ComponentShell";
import LightGradientButton from "@/components/LightGradientButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the light gradient button.`;

const PROMPT_CONTENT = `Create a reusable button from the first shared Figma row:
- Auto layout hug sizing around 80px wide and 40px tall
- 20px horizontal padding, 10px vertical padding, 8px item gap, clipped content
- Linear fill from #E5E5E5 at 0% to #E2E2E2 at 100%
- Inner shadow: 0 1px 0 rgba(255,255,255,0.33)
- Drop shadow: 0 3px 4px -1px rgba(0,0,0,0.15)
- Stroke/shadow: 0 0 0 1px #D4D4D4
- Soft rounded corners with iOS-like smoothing, real button semantics, focus state, and reduced-motion support.`;

export default function LightGradientButtonPage() {
  return (
    <ComponentShell
      title="Light Gradient Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-9 px-4 py-8">
        <div className="flex min-h-[180px] w-full items-center justify-center rounded-[22px] border border-black/[0.04] bg-white shadow-sm">
          <LightGradientButton>Open</LightGradientButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <LightGradientButton>Save</LightGradientButton>
          <LightGradientButton>Share</LightGradientButton>
          <LightGradientButton disabled>Paused</LightGradientButton>
        </div>
      </div>
    </ComponentShell>
  );
}
