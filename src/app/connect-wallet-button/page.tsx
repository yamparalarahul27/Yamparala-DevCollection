import ComponentShell from "@/components/ComponentShell";
import ConnectWalletButton from "@/components/ConnectWalletButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Connect Wallet button component.`;

const PROMPT_CONTENT = `Create a compact Connect Wallet button inspired by the shared screenshot:
- Realistic web/mobile sizing, not oversized: around 260-294px wide and 54-58px tall.
- Cyan glassy face with subtle scanline/pixel texture and dark text.
- Dark square action block on the right with a dotted arrow/grid mark.
- Hover state brightens the cyan face, sweeps a sheen across the surface, and moves the dot arrow slightly to the right.
- Pressed state feels tactile with a small downward compression.
- Use a real button element, visible focus ring, disabled/connecting support, and reduced-motion-safe CSS.`;

export default function ConnectWalletButtonPage() {
  return (
    <ComponentShell
      title="Connect Wallet Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[220px] w-full max-w-lg items-center justify-center rounded-lg bg-[#030b0f] px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <ConnectWalletButton />
      </div>
    </ComponentShell>
  );
}
