import ComponentShell from "@/components/ComponentShell";
import EarnButton from "@/components/EarnButton";

const CODE_CONTENT = `import EarnButton from "@/components/EarnButton";

export default function Example() {
  return <EarnButton />;
}`;

const PROMPT_CONTENT = `Create the glossy green Earn pill button from the shared image:
- Oversized dark green capsule with a slight rotation.
- White hand-and-coins style icon on the left and large bold "Earn" text.
- Use layered green gradients, inner rim highlights, soft bottom shadow, accessible focus, real button semantics, and responsive sizing.`;

export default function EarnButtonPage() {
  return (
    <ComponentShell
      title="Earn Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[420px] w-full items-center justify-center bg-[#efeddb] px-6 py-16">
        <EarnButton />
      </div>
    </ComponentShell>
  );
}
