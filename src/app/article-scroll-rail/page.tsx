import ArticleScrollRail, {
  type ArticleScrollRailSection,
} from "@/components/ArticleScrollRail";
import ComponentShell from "@/components/ComponentShell";

const sections: ArticleScrollRailSection[] = [
  { id: "jpeg", label: "JPEG" },
  { id: "gif", label: "GIF" },
  { id: "png", label: "PNG" },
  { id: "webp", label: "WebP" },
  { id: "glossary", label: "Glossary" },
];

const CODE_CONTENT = `Use Copy Code to load the current local source for the Article Scroll Rail component.`;

const PROMPT_CONTENT = `Create a reusable React article scroll rail inspired by Making Software.
- Render a fixed right-side reading progress rail on desktop and a top progress bar on mobile.
- Generate compact tick marks with invisible click targets that jump to scroll percentages.
- Move a numeric marker based on window scroll progress.
- Position section labels by measuring headings against the full document height.
- Reveal section labels on rail hover/focus.
- Recalculate on resize/content changes with ResizeObserver.
- Use requestAnimationFrame for scroll updates and respect prefers-reduced-motion for smooth scrolling.`;

const bodyCopy = [
  "Compression is easiest to understand when the interface shows structure. A long article has its own geography: introduction, format sections, examples, glossary, and the quiet spaces between them.",
  "The rail treats that geography as a miniature map. It compresses the document into a fixed vertical meter and lets the reader see the current reading position without competing with the prose.",
  "Each tick is intentionally small. The surface is calm at rest, but the hit area is larger than the visible line so the control remains usable without making the page feel like a dashboard.",
  "The moving number is literal progress. It is calculated from the current scroll offset divided by the maximum scroll distance, then rendered as a compact decimal label.",
  "Section labels are placed by measuring each heading in document space. When the reader hovers the rail, those labels fade in where the sections exist inside the document.",
];

function DemoSection({
  children,
  id,
  title,
}: {
  children: React.ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section className="scroll-mt-24 border-t border-slate-200/80 pt-14" id={id}>
      <h3 className="font-serif text-2xl font-semibold tracking-[-0.01em] text-slate-950">
        {title}
      </h3>
      <div className="mt-6 space-y-5 text-[15px] leading-8 text-slate-700">
        {children}
      </div>
    </section>
  );
}

export default function ArticleScrollRailPage() {
  return (
    <ComponentShell
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
      title="Article Scroll Rail"
    >
      <div className="relative w-full max-w-5xl">
        <ArticleScrollRail sections={sections} />

        <article className="mx-auto min-h-[2800px] max-w-3xl rounded-[24px] border border-slate-200 bg-[#fbfbf8] px-6 py-12 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-10 lg:px-16">
          <header className="min-h-[58vh] content-center text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Data and Compression / Demo
            </p>
            <h2 className="mt-8 font-serif text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">
              Image compression.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
              A long-form article surface with a Making Software inspired
              scroll ruler, section map, and clickable progress ticks.
            </p>
          </header>

          <div className="space-y-16">
            <DemoSection id="jpeg" title="JPEG">
              {bodyCopy.map((copy, index) => (
                <p key={index}>{copy}</p>
              ))}
            </DemoSection>

            <DemoSection id="gif" title="GIF">
              {bodyCopy
                .slice()
                .reverse()
                .map((copy, index) => (
                  <p key={index}>{copy}</p>
                ))}
            </DemoSection>

            <DemoSection id="png" title="PNG">
              {bodyCopy.map((copy, index) => (
                <p key={index}>{copy}</p>
              ))}
              <div className="grid gap-3 pt-3 sm:grid-cols-3">
                {["Lossless", "Palette", "Filters"].map((label) => (
                  <div
                    className="rounded-[14px] border border-slate-200 bg-white/70 p-4"
                    key={label}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Small repeated detail makes the rail movement easier to
                      judge while the article scrolls.
                    </p>
                  </div>
                ))}
              </div>
            </DemoSection>

            <DemoSection id="webp" title="WebP">
              {bodyCopy
                .concat(bodyCopy.slice(0, 2))
                .map((copy, index) => (
                  <p key={index}>{copy}</p>
                ))}
            </DemoSection>

            <DemoSection id="glossary" title="Glossary">
              <dl className="space-y-5">
                {[
                  ["Progress", "Current scroll offset divided by total scrollable distance."],
                  ["Tick", "A visible one-pixel line with a larger invisible button."],
                  ["Section", "A heading measured against document height."],
                ].map(([term, description]) => (
                  <div key={term}>
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-slate-950">
                      {term}
                    </dt>
                    <dd className="mt-1 text-slate-600">{description}</dd>
                  </div>
                ))}
              </dl>
            </DemoSection>
          </div>
        </article>
      </div>
    </ComponentShell>
  );
}
