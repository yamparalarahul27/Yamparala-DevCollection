"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Shuffle, Sparkles } from "lucide-react";
import ComponentShell from "@/components/ComponentShell";
import ProfileAvatar from "@/components/ProfileAvatar";

type AvatarSwatch = {
  id: string;
  top: string;
  bottom: string;
};

type AvatarRenderStyle = "smooth" | "dithered";

const PRESET_SWATCHES: AvatarSwatch[] = [
  { id: "orange", top: "#ff7a17", bottom: "#ff9b3f" },
  { id: "purple", top: "#9b4ee8", bottom: "#ad73ee" },
  { id: "blue", top: "#5d8de8", bottom: "#8ab8f5" },
  { id: "charcoal", top: "#62626d", bottom: "#787884" },
  { id: "silver", top: "#c8c8ca", bottom: "#dddddf" },
  { id: "sage", top: "#afc39e", bottom: "#c5d7b8" },
  { id: "lavender", top: "#bcadd8", bottom: "#d3c8e8" },
  { id: "pink", top: "#e79ebd", bottom: "#f1bed5" },
  { id: "peach", top: "#e8a19c", bottom: "#f2c2be" },
  { id: "mint", top: "#37cc9b", bottom: "#6fddb4" },
  { id: "rose", top: "#ef6b85", bottom: "#f59daf" },
  { id: "sun", top: "#f2c707", bottom: "#f2de86" },
];

const CODE_CONTENT = `Use Copy Code to load the current local source for the Avatar Creator and reusable ProfileAvatar component.`;

const PROMPT_CONTENT = `Build an Avatar Creator panel in Next.js with a reusable ProfileAvatar component.

Requirements:
- Render a large circular avatar preview from top and bottom gradient colors.
- Include an optional dithered gradient mode made from CSS dot layers.
- Show a swatch palette of circular split-color avatar options.
- Selected swatch has a visible selection ring.
- Add a rounded Shuffle button that randomly selects a swatch.
- Include a dashed circular "+" slot that opens a custom-color popover.
- Popover includes "Top" and "Bottom" color pickers plus an "Add" button.
- On Add, append the new swatch to the palette and select it.
- Close popover on outside click or Escape, and keep keyboard focus states visible.
- Style should match a clean soft card aesthetic with subtle shadows and gray background.`;

const avatarStyleOptions: Array<{
  label: string;
  value: AvatarRenderStyle;
}> = [
  { label: "Dithered", value: "dithered" },
  { label: "Smooth", value: "smooth" },
];

export default function AvatarCreatorPage() {
  const [customSwatches, setCustomSwatches] = useState<AvatarSwatch[]>([]);
  const [selectedSwatchId, setSelectedSwatchId] = useState("purple");
  const [avatarRenderStyle, setAvatarRenderStyle] =
    useState<AvatarRenderStyle>("dithered");
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [draftTop, setDraftTop] = useState("#082357");
  const [draftBottom, setDraftBottom] = useState("#334679");
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = "custom-avatar-colors";
  const isDithered = avatarRenderStyle === "dithered";

  const allSwatches = useMemo(
    () => [...PRESET_SWATCHES, ...customSwatches],
    [customSwatches],
  );

  const selectedSwatch =
    allSwatches.find((swatch) => swatch.id === selectedSwatchId) ??
    allSwatches[0];

  useEffect(() => {
    if (!showAddPopover) {
      return;
    }

    popoverRef.current?.focus();

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        addButtonRef.current?.contains(target)
      ) {
        return;
      }
      setShowAddPopover(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowAddPopover(false);
        addButtonRef.current?.focus();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showAddPopover]);

  function closePopover() {
    setShowAddPopover(false);
  }

  function handleShuffle() {
    if (allSwatches.length === 0) {
      return;
    }

    const candidates =
      allSwatches.length > 1
        ? allSwatches.filter((swatch) => swatch.id !== selectedSwatchId)
        : allSwatches;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const nextSwatch = candidates[randomIndex];
    if (!nextSwatch) {
      return;
    }

    setSelectedSwatchId(nextSwatch.id);
    closePopover();
  }

  function handleAddSwatch() {
    const newSwatch: AvatarSwatch = {
      id: `custom-${crypto.randomUUID()}`,
      top: draftTop,
      bottom: draftBottom,
    };

    setCustomSwatches((prev) => [...prev, newSwatch]);
    setSelectedSwatchId(newSwatch.id);
    closePopover();
  }

  return (
    <ComponentShell
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
      title="Avatar Creator"
    >
      <div className="w-full max-w-[620px] rounded-[28px] border border-white/80 bg-[#f9fafb] px-5 py-6 shadow-[0_20px_38px_rgba(15,23,42,0.05)] sm:px-9 sm:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[15px] font-semibold uppercase tracking-[0.05em] text-[#85858a] sm:text-[17px]">
            Avatar Creator
          </h2>

          <div
            aria-label="Avatar render style"
            className="inline-flex w-fit rounded-full border border-[#e5e5e8] bg-white p-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            role="group"
          >
            {avatarStyleOptions.map((option) => {
              const selected = option.value === avatarRenderStyle;
              return (
                <button
                  aria-pressed={selected}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b4ee8] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    selected
                      ? "bg-[#191a1f] text-white shadow-[0_1px_2px_rgba(15,23,42,0.16)]"
                      : "text-[#74747a] hover:bg-[#f4f4f6] hover:text-[#34343a]"
                  }`}
                  key={option.value}
                  onClick={() => setAvatarRenderStyle(option.value)}
                  type="button"
                >
                  {option.value === "dithered" ? (
                    <Sparkles aria-hidden="true" size={14} strokeWidth={2} />
                  ) : null}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-8">
          <ProfileAvatar
            bottom={selectedSwatch.bottom}
            dithered={isDithered}
            label={`${selectedSwatch.id} avatar preview`}
            size="clamp(92px,24vw,112px)"
            top={selectedSwatch.top}
          />
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#dddddf] bg-white px-5 py-[9px] text-[15px] font-medium text-[#5f6066] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#f4f4f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b4ee8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9fafb] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 sm:px-6 sm:py-[10px] sm:text-[16px]"
            onClick={handleShuffle}
            type="button"
          >
            <Shuffle aria-hidden="true" size={16} strokeWidth={2} />
            Shuffle
          </button>
        </div>

        <div className="relative mt-7 sm:mt-9">
          <div className="grid w-fit grid-cols-4 gap-2.5 sm:max-w-[560px] sm:grid-cols-7 sm:gap-x-[14px] sm:gap-y-[14px]">
            {allSwatches.map((swatch) => {
              const selected = swatch.id === selectedSwatchId;
              return (
                <button
                  aria-label={`Select ${swatch.id} color pair`}
                  aria-pressed={selected}
                  className={`relative flex h-[54px] w-[54px] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b4ee8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9fafb] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 sm:h-[60px] sm:w-[60px] ${
                    selected
                      ? "ring-2 ring-[#b574f0] ring-offset-2 ring-offset-[#f9fafb]"
                      : "ring-1 ring-transparent"
                  }`}
                  key={swatch.id}
                  onClick={() => {
                    setSelectedSwatchId(swatch.id);
                    closePopover();
                  }}
                  type="button"
                >
                  <ProfileAvatar
                    bottom={swatch.bottom}
                    dithered={isDithered}
                    size="clamp(50px, 14vw, 58px)"
                    top={swatch.top}
                  />
                </button>
              );
            })}

            <button
              aria-controls={showAddPopover ? popoverId : undefined}
              aria-expanded={showAddPopover}
              aria-haspopup="dialog"
              aria-label="Add custom avatar colors"
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-2 border-dashed border-[#d4d4d6] bg-transparent text-[#bfc0c5] transition-colors hover:border-[#b4b5bc] hover:text-[#8f9098] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b4ee8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9fafb] sm:h-[60px] sm:w-[60px]"
              onClick={() => setShowAddPopover((prev) => !prev)}
              ref={addButtonRef}
              type="button"
            >
              <Plus aria-hidden="true" size={28} strokeWidth={1.8} />
            </button>
          </div>

          {showAddPopover ? (
            <div
              aria-label="Custom avatar colors"
              className="absolute bottom-full left-0 z-20 mb-3 w-[214px] max-w-[calc(100vw-48px)] rounded-[18px] border border-white/80 bg-white p-4 shadow-[0_18px_34px_rgba(15,23,42,0.16)] focus:outline-none sm:w-[226px] sm:p-5 md:bottom-auto md:left-full md:top-0 md:mb-0 md:ml-4"
              id={popoverId}
              ref={popoverRef}
              role="dialog"
              tabIndex={-1}
            >
              <div
                aria-hidden="true"
                className="absolute -bottom-[7px] right-[32px] hidden h-[14px] w-[14px] rotate-45 rounded-[3px] border-b border-r border-white/80 bg-white sm:block md:-left-[7px] md:bottom-auto md:right-auto md:top-[44px] md:border-b-0 md:border-l md:border-t"
              />

              <div className="space-y-4">
                <label className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-[#74747a] sm:text-[15px]">
                    Top
                  </span>
                  <span
                    className="relative h-9 w-[96px] rounded-[8px] border border-[#dddddf] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] focus-within:ring-2 focus-within:ring-[#9b4ee8] focus-within:ring-offset-2"
                    style={{ backgroundColor: draftTop }}
                  >
                    <input
                      aria-label="Top avatar color"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(event) => setDraftTop(event.target.value)}
                      type="color"
                      value={draftTop}
                    />
                  </span>
                </label>

                <label className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-[#74747a] sm:text-[15px]">
                    Bottom
                  </span>
                  <span
                    className="relative h-9 w-[96px] rounded-[8px] border border-[#dddddf] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] focus-within:ring-2 focus-within:ring-[#9b4ee8] focus-within:ring-offset-2"
                    style={{ backgroundColor: draftBottom }}
                  >
                    <input
                      aria-label="Bottom avatar color"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(event) => setDraftBottom(event.target.value)}
                      type="color"
                      value={draftBottom}
                    />
                  </span>
                </label>
              </div>

              <button
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-[12px] bg-[#191a1f] px-4 py-2.5 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b4ee8] focus-visible:ring-offset-2 sm:mt-5"
                onClick={handleAddSwatch}
                type="button"
              >
                Add
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </ComponentShell>
  );
}
