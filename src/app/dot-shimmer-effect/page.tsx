import ComponentShell from "@/components/ComponentShell";
import DotShimmerEffect from "@/components/DotShimmerEffect";

const CODE_CONTENT = `Use Copy Code to load the current local source for the dot shimmer effect component.`;

const PROMPT_CONTENT = `Create a portable shimmer effect component inspired by the shared shimer.mp4 video:
- Use vanilla WebGL with embedded vertex and fragment shaders.
- Render a dark, grainy background with a strict grid of small uniform squares (pixel-square cells regardless of stage aspect).
- Most squares stay still at low ambient brightness; a sparse subset blinks very gently.
- On hover, leave a bright trail of lit squares that follows the cursor with a smoothed lag.
- The cursor head stays bright while stationary; the trailing streak fades to zero in ~500ms.
- Drive the trail by a 64-slot CPU ring buffer (xy + age) uploaded as a uniform array.
- Keep the effect behind arbitrary children so it can be pasted into any React site.
- Avoid external animation or WebGL libraries.
- Respect prefers-reduced-motion by rendering hover feedback without continuous motion.
- Include a non-WebGL fallback so the component still displays a dotted background.`;

export default function DotShimmerEffectPage() {
  return (
    <ComponentShell
      title="Dot Shimmer Effect"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[560px] w-full items-center justify-center px-5 py-12">
        <DotShimmerEffect
          className="w-full max-w-5xl border border-white/8 shadow-[0_34px_120px_rgba(0,0,0,0.45)]"
          dotScale={1.2}
          height={430}
          intensity={1.6}
          speed={1}
        />
      </div>
    </ComponentShell>
  );
}
