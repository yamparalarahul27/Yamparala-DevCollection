import ComponentShell from "@/components/ComponentShell";
import BuyNowGlowButton from "@/components/BuyNowGlowButton";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Buy Now glow button.`;

const PROMPT_CONTENT = `Create a wide Buy Now button from the second shared mobile screenshot:
- Dark finance/product screen context
- Wide rectangular button with sharp corners
- Bright cyan/teal border, translucent teal fill, and strong glow/blur under the button
- White money icon in a circle on the left and large bold "Buy Now" label
- Keep a luminous but readable hover state, real button semantics, focus state, and reduced-motion support.`;

export default function BuyNowGlowButtonPage() {
  return (
    <ComponentShell
      title="Buy Now Glow Button"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex w-full max-w-xl justify-center px-4 py-8">
        <section className="w-full max-w-[500px] overflow-hidden border border-[#0c494a] bg-[#060511] text-white shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
          <div className="flex items-center gap-11 border-b border-white/10 px-8 py-5 text-2xl font-semibold text-white/35">
            <span className="flex items-center gap-2 text-white">
              <span className="h-2 w-2 rounded-full bg-[#12f5d0] shadow-[0_0_10px_rgba(18,245,208,0.9)]" />
              LIVE
            </span>
            <span>24H</span>
            <span>1W</span>
            <span>1M</span>
          </div>

          <div className="px-8 py-9">
            <h2 className="text-[30px] font-semibold">Your Balance</h2>
            <div className="mt-8 grid grid-cols-2 border border-white/12 px-4 py-5">
              <div>
                <p className="text-lg font-semibold text-white/28">Value</p>
                <p className="mt-4 text-2xl">$24,000.00</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white/28">Quantity</p>
                <p className="mt-4 text-2xl">240</p>
              </div>
            </div>

            <h3 className="mt-10 text-[30px] font-semibold">About</h3>
            <div className="mt-5">
              <BuyNowGlowButton />
            </div>
          </div>
        </section>
      </div>
    </ComponentShell>
  );
}
