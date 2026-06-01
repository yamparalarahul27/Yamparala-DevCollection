import ComponentShell from "@/components/ComponentShell";
import ScrollMaskScroller from "@/components/ScrollMaskScroller";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Scroll mask scroller.`;

const PROMPT_CONTENT = `Create a copyable CSS scroll masking component as a progressive enhancement.
- Build a normal accessible scroll container first.
- Add mask-repeat: no-repeat and leave scrollbar space using calc(100% - 10px).
- Use scroll-linked CSS animation with animation-timeline: scroll(self), animation-range: 0 1rem, and mask-composite: exclude.
- Include reduced-motion handling and a browser fallback when scroll timelines are not available.`;

export default function ScrollMaskScrollerPage() {
  return (
    <ComponentShell
      title="Scroll Mask Scroller"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <ScrollMaskScroller />
    </ComponentShell>
  );
}
