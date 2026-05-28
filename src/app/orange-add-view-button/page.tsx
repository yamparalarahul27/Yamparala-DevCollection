import ComponentShell from "@/components/ComponentShell";
import { OrangeAddViewButton } from "@/components/OrangeAddViewButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the orange Add View button.`;

const PROMPT_CONTENT = `Create the supplied Orange Add View button as a reusable React component:
- bg-orange-600, white text, border-white/40, rounded-xl
- px-10 py-2.5, text-base, leading-none, font-normal, tracking -0.02em
- Shadows: 0 18px 36px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.20), inset 0 0 6px 2px rgba(255,255,255,0.24), and 0 0 0 1px var(--color-orange-600)
- Keep the exact Add View label, use a real button, and add accessible focus/disabled states.`;

export default function OrangeAddViewButtonPage() {
  return (
    <ComponentShell
      title="Orange Add View Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-9 px-4 py-8">
        <div className="flex min-h-[190px] w-full items-center justify-center rounded-[22px] border border-orange-100 bg-[#fff8f2] shadow-sm">
          <OrangeAddViewButton />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <OrangeAddViewButton />
          <OrangeAddViewButton disabled />
        </div>
      </div>
    </ComponentShell>
  );
}
