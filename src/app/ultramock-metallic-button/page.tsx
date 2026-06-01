import ComponentShell from "@/components/ComponentShell";
import UltramockMetallicButton from "@/components/UltramockMetallicButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Ultramock metallic button.`;

const PROMPT_CONTENT = `Create a metallic subscription button inspired by the Ultramock button snippet:
- Real button semantics with a copy-paste friendly React component.
- Chrome gradient surface using the live site's 135deg metallic color stops.
- Squircle-xl shape with superellipse corner-shape support where available.
- A pointer-driven chrome sheen layer using --mx so the highlight follows mouse movement.
- Small sparkle highlights, tactile hover/active states, focus-visible ring, disabled state, and reduced-motion handling.`;

export default function UltramockMetallicButtonPage() {
  return (
    <ComponentShell
      title="Ultramock Metallic Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <section className="flex w-full max-w-2xl items-center justify-center px-4 py-20">
        <div className="flex min-h-[220px] w-full items-center justify-center rounded-lg border border-zinc-200 bg-[#f7f7f8] px-6 shadow-sm">
          <UltramockMetallicButton>Subscribe — $72/yr</UltramockMetallicButton>
        </div>
      </section>
    </ComponentShell>
  );
}
