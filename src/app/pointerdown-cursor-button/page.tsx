import ComponentShell from "@/components/ComponentShell";
import PointerdownCursorButton from "@/components/PointerdownCursorButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Pointerdown cursor button.`;

const PROMPT_CONTENT = `Create a tactile button component that uses a custom cursor asset and swaps to a pressed cursor asset on :active.
- Include pointer.svg and pointerdown.svg asset references.
- Add comments in the CSS showing where users can replace those cursor files.
- Keep real button semantics, focus-visible styles, hover lift, active press depth, and reduced-motion handling.
- Make the component self-contained and copy-paste friendly.`;

export default function PointerdownCursorButtonPage() {
  return (
    <ComponentShell
      title="Pointerdown Cursor Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <section className="flex min-h-[340px] w-full max-w-xl items-center justify-center rounded-lg border border-zinc-200 bg-[#f6f6f7] px-6 py-16 shadow-sm">
        <PointerdownCursorButton>Pointer Down</PointerdownCursorButton>
      </section>
    </ComponentShell>
  );
}
