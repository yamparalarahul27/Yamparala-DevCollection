import ComponentShell from "@/components/ComponentShell";
import FigmaPropertiesButton from "@/components/FigmaPropertiesButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Figma Properties button.`;

const PROMPT_CONTENT = `Create a reusable Next.js button component from these Figma appearance properties:
- 100% opacity
- 10px corner radius
- Linear dark gradient from #323232 at 0% to #222222 at 100%
- Inner shadow: 0 0.5px 1px 0 rgba(255,255,255,0.15)
- Inner shadow: 0 -1px 1.2px 0.35px #121212
- Drop shadow: 0 2px 4px -1px rgba(13,13,13,0.5)
- Drop shadow/stroke: 0 0 0 1px #333333
- Use a real button element, keep the hit target at least 40px tall, add focus-visible styling, and respect reduced motion.`;

export default function FigmaPropertiesButtonPage() {
  return (
    <ComponentShell
      title="Figma Properties Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-10 px-4 py-8">
        <div className="flex min-h-[180px] w-full items-center justify-center rounded-[22px] border border-black/[0.04] bg-white shadow-sm">
          <FigmaPropertiesButton>Continue</FigmaPropertiesButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <FigmaPropertiesButton>Confirm</FigmaPropertiesButton>
          <FigmaPropertiesButton>Save changes</FigmaPropertiesButton>
          <FigmaPropertiesButton disabled>Disabled</FigmaPropertiesButton>
        </div>
      </div>
    </ComponentShell>
  );
}
