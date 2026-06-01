import ComponentShell from "@/components/ComponentShell";
import CssRingText from "@/components/CssRingText";

const CODE_CONTENT = `Use Copy Code to load the current local source for the CSS ring text component.`;

const PROMPT_CONTENT = `Create a CSS trig ring text component inspired by Jhey Tompkins' CSS ring text CodePen.
- Split the supplied text into characters in React.
- Pass --index and --total CSS variables to each character.
- Use CSS trigonometric functions to calculate the radius from the step angle.
- Position characters around a circular path using rotate, translate, and counter-rotation.
- Include a subtle spin animation and reduced-motion fallback.`;

export default function CssRingTextPage() {
  return (
    <ComponentShell
      title="CSS Ring Text"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <CssRingText />
    </ComponentShell>
  );
}
