import { ArrowRight, Check, Layers3 } from "lucide-react";
import ComponentShell from "@/components/ComponentShell";
import GlassButton from "@/components/GlassButton";
import GlassCard from "@/components/GlassCard";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Glass button and card components.`;

const PROMPT_CONTENT = `Create reusable GlassButton and GlassCard components from this extracted HTML/CSS recipe:
- CTA button dimensions around 217px by 46px with a 99px pill radius.
- Transparent glass fill using the 182.51deg low-opacity gradient.
- Layered drop shadows, backdrop-filter blur(10px), clipped overflow, and a gradient-border pseudo element.
- Support the larger navbar pill variant around 309px wide with 1px gradient border.
- Add a subtle noise overlay equivalent to the original ::after filter.
- Build a matching card component that uses the same frosted surface, gradient border, blur, shadow depth, and noise texture.
- Keep real button/link semantics, visible focus states, responsive sizing, and reduced-motion support.`;

export default function GlassComponentsPage() {
  return (
    <ComponentShell
      title="Glass Button & Card"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <section className="w-full max-w-5xl px-1 py-4 sm:px-4">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-[#07080d] px-5 py-7 text-white shadow-[0_30px_90px_rgba(0,0,0,0.22)] sm:p-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_72px),linear-gradient(180deg,#0d1018,#15151a_42%,#08090e)]"
          />
          <div
            aria-hidden="true"
            className="absolute left-[-8%] top-[14%] -z-10 h-20 w-[46%] rotate-[-13deg] bg-[#ef4444]/35 blur-[1px]"
          />
          <div
            aria-hidden="true"
            className="absolute right-[-6%] top-[28%] -z-10 h-24 w-[42%] rotate-[16deg] bg-[#22c55e]/30 blur-[1px]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[16%] left-[28%] -z-10 h-16 w-[38%] rotate-[5deg] bg-[#f59e0b]/28 blur-[1px]"
          />

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="grid gap-5">
              <GlassButton href="/buttons" trailing={<ArrowRight />}>
                Launch stack
              </GlassButton>

              <GlassButton
                href="/"
                leading={<Layers3 />}
                size="nav"
                trailing={<ArrowRight />}
              >
                Component library
              </GlassButton>

              <div className="flex flex-wrap gap-3">
                <GlassButton>Primary action</GlassButton>
                <GlassButton disabled>Syncing</GlassButton>
              </div>
            </div>

            <GlassCard
              description="Monitor launch readiness, review pending work, and move the release forward from one compact surface."
              eyebrow="Release desk"
              footer={
                <>
                  <GlassButton href="/glass-components" trailing={<ArrowRight />}>
                    Open preview
                  </GlassButton>
                </>
              }
              title="Signal layer"
            >
              <div className="grid gap-3">
                {["Signal quality", "Review queue", "Launch state"].map(
                  (item) => (
                    <div
                      className="flex items-center justify-between gap-5 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                      key={item}
                    >
                      <span className="text-sm font-medium text-white/72">
                        {item}
                      </span>
                      <span className="inline-grid size-7 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/18">
                        <Check aria-hidden="true" size={15} />
                      </span>
                    </div>
                  ),
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </ComponentShell>
  );
}
