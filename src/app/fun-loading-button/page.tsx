import ComponentShell from "@/components/ComponentShell";
import FunLoadingButton from "@/components/FunLoadingButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the FUN loading button.`;

const PROMPT_CONTENT = `Recreate the button loading state from Jakub Antalik's @FUN X video:
- Start as a wide light pill labeled "Withdraw"
- On click, transition into a dark translucent pill labeled "Processing"
- Add a compact spinner to the left of the label
- Add a glossy sweep that moves across the button during processing
- Keep the button inside a dark transaction breakdown panel for context
- Finish with a short completed state before returning to idle
- Use a real button element, aria-busy, visible focus styling, and reduced-motion support.`;

export default function FunLoadingButtonPage() {
  return (
    <ComponentShell
      title="FUN Loading Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 px-4 py-8">
        <section className="w-full max-w-[430px] rounded-[26px] border border-white/10 bg-[#151515] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="rounded-[16px] border border-white/10 bg-[#1b1b1c] text-sm text-white/92">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-white/58">Transaction breakdown</span>
              <span>$0.29 ^</span>
            </div>
            <div className="grid gap-3 px-4 py-4">
              <div className="flex items-center justify-between gap-6">
                <span className="text-white/54">Rate</span>
                <span>1.000 USDC.e = 1.000 USDC</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-white/54">Network cost</span>
                <span>&lt;$0.05</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-white/54">Price impact</span>
                <span>0.16%</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-white/54">Max slippage</span>
                <span>0.50%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center border-t border-white/10 pt-4">
            <FunLoadingButton />
          </div>
        </section>
      </div>
    </ComponentShell>
  );
}
