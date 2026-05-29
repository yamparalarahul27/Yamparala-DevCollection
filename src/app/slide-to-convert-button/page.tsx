import ComponentShell from "@/components/ComponentShell";
import SlideToConvertButton from "@/components/SlideToConvertButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the slide to convert button.`;

const PROMPT_CONTENT = `Create a dark "Slide to convert" swipe button from the shared image:
- Dark rounded pill track with subtle diagonal highlights.
- White rounded thumb on the left.
- Use lucide-react ChevronRight icons for the arrow marks inside the thumb.
- Animate the arrows with a tiny continuous forward drift.
- Let users drag or swipe the thumb to the right to complete the action.
- Add keyboard support: Enter/Space completes, ArrowRight advances, ArrowLeft/Home/Escape reset.
- Show a short converted state and then reset for demo use.
- Include tactile hover, active, focus, disabled, and reduced-motion states.`;

export default function SlideToConvertButtonPage() {
  return (
    <ComponentShell
      title="Slide To Convert Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[420px] w-full items-center justify-center bg-[#050505] px-6 py-16">
        <SlideToConvertButton />
      </div>
    </ComponentShell>
  );
}
