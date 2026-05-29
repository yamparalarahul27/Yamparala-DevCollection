import ComponentShell from "@/components/ComponentShell";
import LimeAlertRuleButton from "@/components/LimeAlertRuleButton";

const CODE_CONTENT = `import LimeAlertRuleButton from "@/components/LimeAlertRuleButton";

export default function Example() {
  return <LimeAlertRuleButton />;
}`;

const PROMPT_CONTENT = `Create a lime green "Add Alert Rule" button from the shared image:
- Rounded rectangle with a bright lime border and soft lime fill.
- Plus icon on the left, large dark text, and generous horizontal padding.
- Add subtle inner highlight, pressed depth shadow, hover/active states, keyboard focus, and mobile-safe sizing.`;

export default function LimeAlertRuleButtonPage() {
  return (
    <ComponentShell
      title="Lime Alert Rule Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[360px] w-full items-center justify-center bg-white px-6 py-16">
        <LimeAlertRuleButton />
      </div>
    </ComponentShell>
  );
}
