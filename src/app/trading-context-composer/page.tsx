import ComponentShell from "@/components/ComponentShell";
import TradingContextComposerShowcase from "@/components/TradingContextComposerShowcase";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Trading Context Composer component.`;

const PROMPT_CONTENT = `Create a reusable AI trading chat composer that replicates the supplied motion reference frame by frame:
- Render the card and the composer as white silhouettes inside a gooey SVG filter (blur + alpha contrast) so the two shapes melt together like liquid when they overlap.
- Drive everything from a single gap value: the px distance between the card's bottom edge and the composer's top edge (negative values overlap and merge the shapes).
- Play the reveal/dismiss curves measured from the reference video: reveal overshoots ~38.6% at ~120ms and settles at ~340ms; dismissal drops in ~170ms with a slow relax tail. The gap value itself animates, so a scrubber thumb follows the motion.
- Keep card content on a separate unfiltered layer that fades and blurs only over the last stretch of travel while the composer text stays crisp.
- When the typed prompt contains Orders or Positions, reveal a portfolio context card from behind the composer with that exact motion.
- Show asset icon and name, futures uPnL or spot PnL, and portfolio coverage for each row, plus Orders, Positions, and Explain actions.
- Add a Gap scrubber (spring-following, like the reference), Debug layer view, Toggle control, and Replay action for inspecting the motion.
- Include a separate video-reference variant that preserves the original Notion connector content and compact dimensions 1:1.
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
