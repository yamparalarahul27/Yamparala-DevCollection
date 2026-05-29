import ComponentShell from "@/components/ComponentShell";
import FixActionButtons from "@/components/FixActionButtons";

const CODE_CONTENT = `import FixActionButtons from "@/components/FixActionButtons";

export default function Example() {
  return <FixActionButtons />;
}`;

const PROMPT_CONTENT = `Create the stacked Apply Fix and Preview Fix buttons from the shared image:
- Dark page/background context.
- Top green Apply Fix button with hammer icon, glow, soft border, and large white text.
- Bottom charcoal Preview Fix button with eye icon, raised border, and muted icon color.
- Use real button elements, consistent spacing, focus-visible states, responsive sizing, and reduced-motion support.`;

export default function FixActionButtonsPage() {
  return (
    <ComponentShell
      title="Fix Action Buttons"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[480px] w-full items-center justify-center bg-[#171823] px-6 py-16">
        <FixActionButtons />
      </div>
    </ComponentShell>
  );
}
