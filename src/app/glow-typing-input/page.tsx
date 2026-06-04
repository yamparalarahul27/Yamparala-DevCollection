import ComponentShell from "@/components/ComponentShell";
import GlowTypingInput from "@/components/GlowTypingInput";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Glow Typing Input component.`;

const PROMPT_CONTENT = `Create a reusable glowing typing input inspired by the shared image:
- Large dark pill surface with a muted plus icon on the left.
- Real editable input where the user can type.
- Hide the native caret and render a custom gradient caret with warm top, white center, violet bottom glow, and soft bloom under the caret.
- The custom caret should follow the input selection/cursor position while typing or clicking in the text.
- Support controlled and uncontrolled value usage, accessible label, focus/hover states, mobile sizing, and reduced-motion-safe CSS.`;

export default function GlowTypingInputPage() {
  return (
    <ComponentShell
      title="Glow Typing Input"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <section className="grid min-h-[520px] w-full max-w-5xl place-items-center rounded-lg bg-black px-5 py-16 shadow-[0_34px_120px_rgba(0,0,0,0.28)] sm:px-10">
        <GlowTypingInput autoFocus />
      </section>
    </ComponentShell>
  );
}
