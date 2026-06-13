import ComponentShell from "@/components/ComponentShell";
import SiriGlslWave from "@/components/SiriGlslWave";

const CODE_CONTENT = `Use Copy Code to load the current local source for the Siri GLSL wave component.`;

const PROMPT_CONTENT = `Create a React component from the Siri GLSL reference:
- Use a canvas with vanilla WebGL, no animation libraries.
- Port the wave and fluid dots fragment shaders into TypeScript string constants.
- Provide a segmented control for switching between Wave and Fluid Dots.
- Handle shader compile/link errors with an inline fallback.
- Resize the canvas using ResizeObserver and keep the shader pixel ratio controlled for performance.
- Respect prefers-reduced-motion by rendering a static frame instead of running a continuous animation.
- Fit the component into the existing ComponentShell page pattern.`;

export default function SiriGlslWavePage() {
  return (
    <ComponentShell
      title="Siri GLSL Wave"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex min-h-[560px] w-full items-center justify-center px-5 py-12">
        <SiriGlslWave />
      </div>
    </ComponentShell>
  );
}
