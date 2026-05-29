import ComponentShell from "@/components/ComponentShell";
import PreviewDeployButtons from "@/components/PreviewDeployButtons";

const CODE_CONTENT = `import PreviewDeployButtons from "@/components/PreviewDeployButtons";

export default function Example() {
  return <PreviewDeployButtons />;
}`;

const PROMPT_CONTENT = `Create the shared Preview and Deploy button pair:
- White Preview button with an eye icon, gray icon color, rounded border, and lifted bottom shadow.
- Dark Deploy button with a check-circle icon, glossy gradient, black border, and bottom depth.
- Keep both as real buttons with matching height, icon spacing, focus-visible styling, hover/active states, wrapping on small screens, and reduced-motion support.`;

export default function PreviewDeployButtonsPage() {
  return (
    <ComponentShell
      title="Preview Deploy Buttons"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[360px] w-full items-center justify-center bg-white px-6 py-16">
        <PreviewDeployButtons />
      </div>
    </ComponentShell>
  );
}
