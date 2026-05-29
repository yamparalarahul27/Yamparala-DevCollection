import ComponentShell from "@/components/ComponentShell";
import FloatingToolbarTooltip from "@/components/FloatingToolbarTooltip";

const CODE_CONTENT = `Use Copy Code to load the current local source for the floating toolbar tooltip component.`;

const PROMPT_CONTENT = `Create the floating toolbar and tooltip interaction from the shared toolbar video:
- Place a frosted floating toolbar in the top-right of a soft application card.
- Use four real icon buttons with a shared circular active surface that slides between icons.
- Show one black rounded tooltip below the active icon with a small top arrow.
- Make the tooltip morph position and width between labels like "More..." and "Use Floating Window".
- Add tactile hover, focus, and active states for every toolbar action.
- Support keyboard arrow movement inside the toolbar and visible focus styling.
- Respect reduced-motion by removing the slide/morph transitions.`;

export default function FloatingToolbarTooltipPage() {
  return (
    <ComponentShell
      title="Floating Toolbar Tooltip"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[520px] w-full items-center justify-center px-4 py-10">
        <FloatingToolbarTooltip />
      </div>
    </ComponentShell>
  );
}
