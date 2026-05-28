import ComponentShell from "@/components/ComponentShell";
import GlossyIconButtonStack from "@/components/GlossyIconButtons";

const CODE_CONTENT = `import GlossyIconButtonStack from "@/components/GlossyIconButtons";

export default function Example() {
  return <GlossyIconButtonStack />;
}`;

const PROMPT_CONTENT = `Create a set of three glossy, oversized icon buttons from the shared image:
- Purple rounded button with "Button" text and a right arrow icon.
- Black rounded button with a plus icon and "Button" text.
- Green rounded button with a save icon and "Button" text.
- Use real button elements, strong inset highlights, bottom depth shadows, accessible focus states, responsive sizing, and reduced-motion support.`;

export default function GlossyIconButtonsPage() {
  return (
    <ComponentShell
      title="Glossy Icon Buttons"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[560px] w-full items-center justify-center bg-white px-6 py-16">
        <GlossyIconButtonStack />
      </div>
    </ComponentShell>
  );
}
