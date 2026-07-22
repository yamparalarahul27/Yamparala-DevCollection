import ComponentShell from "@/components/ComponentShell";
import TradingContextComposerShowcase from "@/components/TradingContextComposerShowcase";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Trading Context Composer component.`;

const PROMPT_CONTENT = `Create a reusable AI trading chat composer based on the supplied motion reference:
- Begin as a clean AI chat input with a circular send action.
- When the typed prompt contains Orders or Positions, reveal a portfolio context card from behind the composer.
- Reverse the reference motion: translate the card upward, fade it in, remove a slight blur, briefly overshoot, and settle farther above the composer.
- Keep the composer anchored above the card in the stacking order so their rounded edges overlap during the reveal.
- Show asset icon and name, futures uPnL or spot PnL, and portfolio coverage for each row.
- Include Orders, Positions, and Explain actions.
- Add a Gap scrubber, Debug layer view, Toggle control, and Replay action for inspecting the motion.
- Include a separate video-reference variant that preserves the original Notion connector content and compact dimensions.
- Support controlled and uncontrolled input, loading/empty/error states, responsive sizing, keyboard focus, dark mode, and reduced motion.`;

export default function TradingContextComposerPage() {
  return (
    <ComponentShell
      title="Trading Context Composer"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <section className="grid min-h-[580px] w-full max-w-3xl place-items-center overflow-hidden px-4 py-10 sm:px-8">
        <TradingContextComposerShowcase />
      </section>
    </ComponentShell>
  );
}
