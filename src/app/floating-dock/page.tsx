"use client";

import ComponentShell from "@/components/ComponentShell";

const CODE_CONTENT = `Use Copy Code to load the current local source for the floating dock component.`;

const PROMPT_CONTENT = `Create a floating bottom-center component dock used across all component pages with:
- Components dropdown
- Copy Code action
- Copy Prompt action
- Light / Dark theme switch only
Add credit to https://x.com/chalaska.`;

const FEATURES = [
  "Components menu with links from the shared registry",
  "Copy Code opens the source sheet via ComponentShell",
  "Copy Prompt opens the prompt sheet",
  "Light / Dark theme switch persisted in localStorage",
] as const;

export default function FloatingDockPage() {
  return (
    <ComponentShell
      title="Floating Component Dock"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <section className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          Navigation & Layout
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#111827] sm:text-2xl">
          Live dock is the chrome below
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6b7280] sm:text-base">
          FloatingComponentDock is mounted by ComponentShell on every demo page.
          Use the bottom-center bar on this page to open the Components menu, copy
          source/prompt, or switch theme.
        </p>

        <ul className="mt-5 space-y-2">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="rounded-xl bg-[#f8fafc] px-4 py-3 text-sm text-[#374151]"
            >
              {feature}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm text-[#6b7280]">
          Credit:{" "}
          <a
            href="https://x.com/chalaska"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#374151]"
          >
            @chalaska
          </a>
        </p>
      </section>
    </ComponentShell>
  );
}
