import ComponentShell from "@/components/ComponentShell";
import TrackStatusButton from "@/components/TrackStatusButton";

const CODE_CONTENT = `import TrackStatusButton from "@/components/TrackStatusButton";

export default function Example() {
  return <TrackStatusButton />;
}`;

const PROMPT_CONTENT = `Create the glossy purple "Track Status" button from the shared image:
- Wide rounded rectangle with a violet gradient and broad molded top highlight.
- Large white Track Status text, centered with no wrapping.
- Use a real button element, keyboard focus, hover/active states, responsive sizing, and reduced-motion support.`;

export default function TrackStatusButtonPage() {
  return (
    <ComponentShell
      title="Track Status Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[420px] w-full items-center justify-center bg-white px-6 py-16">
        <TrackStatusButton />
      </div>
    </ComponentShell>
  );
}
