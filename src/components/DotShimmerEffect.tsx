"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_intensity;
uniform float u_dotScale;
uniform vec2 u_pointer;
uniform float u_hover;
uniform vec3 u_background;
uniform vec3 u_dotColor;

varying vec2 v_uv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float dotMask(vec2 p, float radius) {
  return 1.0 - smoothstep(radius * 0.45, radius, length(p));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 centered = (uv - 0.5) * aspect;

  float vignette = smoothstep(0.95, 0.15, length(centered));
  float grain = hash21(gl_FragCoord.xy + floor(u_time * 24.0)) * 0.028;
  vec3 color = u_background * (0.82 + 0.18 * vignette) + grain;

  vec2 grid = vec2(54.0 * aspect.x, 36.0) * u_dotScale;
  vec2 cell = uv * grid;
  vec2 id = floor(cell);
  vec2 local = fract(cell);

  float dots = 0.0;
  vec2 pointer = clamp(u_pointer, vec2(0.0), vec2(1.0));
  float pointerDiagonal = pointer.x + pointer.y * 0.42;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 cellId = id + offset;
      float seed = hash21(cellId);
      float seed2 = hash21(cellId + 17.7);
      vec2 jitter = vec2(seed, seed2) - 0.5;
      vec2 dotCenter = offset + 0.5 + jitter * 0.42;
      vec2 dotUv = (cellId + dotCenter) / grid;

      float pointerDistance = length((dotUv - pointer) * aspect);
      float cursorCore = exp(-pow(pointerDistance / 0.12, 2.0));
      float cursorAura = exp(-pow(pointerDistance / 0.34, 2.0)) * 0.42;
      float diagonal = dotUv.x + dotUv.y * 0.42 + sin(dotUv.y * 8.0 + u_time * 0.55) * 0.024;
      float cursorSweep = exp(-pow((diagonal - pointerDiagonal) / 0.11, 2.0)) *
        exp(-pow(pointerDistance / 0.44, 2.0)) * 0.36;

      float edgeLift = smoothstep(0.28, 1.0, length((dotUv - 0.5) * aspect));
      float twinkle = 0.54 + 0.46 * sin(u_time * 2.1 + seed * 6.2831);
      float sparse = smoothstep(0.44, 1.0, seed);
      float radius = mix(0.035, 0.068, seed2);
      float mask = dotMask(local - dotCenter, radius);
      float hoverLight = (cursorCore * 1.65 + cursorAura + cursorSweep) * u_hover;
      float presence = (0.035 + hoverLight + edgeLift * 0.025) * sparse * twinkle;

      dots += mask * presence;
    }
  }

  float dust = smoothstep(0.992, 1.0, hash21(floor(gl_FragCoord.xy * 0.75))) * 0.18;
  dots += dust * (0.25 + 0.75 * vignette);
  dots = clamp(dots * u_intensity, 0.0, 1.0);

  vec3 shimmer = mix(u_dotColor * 0.48, u_dotColor, smoothstep(0.18, 0.85, dots));
  color += shimmer * dots;

  gl_FragColor = vec4(color, 1.0);
}
`;

type DotShimmerEffectProps = {
  background?: string;
  children?: ReactNode;
  className?: string;
  dotColor?: string;
  dotScale?: number;
  height?: CSSProperties["height"];
  intensity?: number;
  speed?: number;
  style?: CSSProperties;
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Unable to create WebGL shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(info);
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Unable to create WebGL program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown program error";
    gl.deleteProgram(program);
    throw new Error(info);
  }

  return program;
}

function hexToRgb(color: string) {
  const normalized = color.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const int = Number.parseInt(value, 16);

  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ] as const;
}

export default function DotShimmerEffect({
  background = "#111111",
  children,
  className,
  dotColor = "#f5f5f5",
  dotScale = 1,
  height = 420,
  intensity = 1,
  speed = 1,
  style,
}: DotShimmerEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGl, setHasWebGl] = useState(true);
  const backgroundRgb = useMemo(() => hexToRgb(background), [background]);
  const dotRgb = useMemo(() => hexToRgb(dotColor), [dotColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const target = wrapper;
    const targetCanvas = canvas;
    const gl = targetCanvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      stencil: false,
    });

    if (!gl) {
      setHasWebGl(false);
      return;
    }

    const context = gl;
    setHasWebGl(true);

    let program: WebGLProgram;
    try {
      program = createProgram(context);
    } catch {
      setHasWebGl(false);
      return;
    }

    const positionBuffer = context.createBuffer();
    const positionLocation = context.getAttribLocation(program, "a_position");
    const resolutionLocation = context.getUniformLocation(program, "u_resolution");
    const timeLocation = context.getUniformLocation(program, "u_time");
    const speedLocation = context.getUniformLocation(program, "u_speed");
    const intensityLocation = context.getUniformLocation(program, "u_intensity");
    const dotScaleLocation = context.getUniformLocation(program, "u_dotScale");
    const backgroundLocation = context.getUniformLocation(program, "u_background");
    const dotColorLocation = context.getUniformLocation(program, "u_dotColor");
    const pointerLocation = context.getUniformLocation(program, "u_pointer");
    const hoverLocation = context.getUniformLocation(program, "u_hover");

    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      context.STATIC_DRAW,
    );
    context.useProgram(program);
    context.enableVertexAttribArray(positionLocation);
    context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let disposed = false;
    const start = performance.now();
    const pointer = {
      hover: 0,
      targetHover: 0,
      x: 0.5,
      y: 0.5,
    };

    function updatePointer(event: PointerEvent) {
      const rect = target.getBoundingClientRect();

      pointer.x = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      pointer.targetHover = 1;

      if (prefersReducedMotion.matches) {
        pointer.hover = 1;
        render(performance.now());
      }
    }

    function leavePointer() {
      pointer.targetHover = 0;

      if (prefersReducedMotion.matches) {
        pointer.hover = 0;
        render(performance.now());
      }
    }

    function resize() {
      const rect = target.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const nextHeight = Math.max(1, Math.floor(rect.height * dpr));

      if (targetCanvas.width !== width || targetCanvas.height !== nextHeight) {
        targetCanvas.width = width;
        targetCanvas.height = nextHeight;
        context.viewport(0, 0, width, nextHeight);
      }
    }

    function render(now: number) {
      if (disposed) {
        return;
      }

      resize();
      const time = prefersReducedMotion.matches ? 2.9 : (now - start) / 1000;

      if (!prefersReducedMotion.matches) {
        const hoverEase = Math.min(1, 0.14 * Math.max(0.2, speed));
        pointer.hover += (pointer.targetHover - pointer.hover) * hoverEase;
      }

      context.useProgram(program);
      context.uniform2f(resolutionLocation, targetCanvas.width, targetCanvas.height);
      context.uniform1f(timeLocation, time);
      context.uniform1f(speedLocation, speed);
      context.uniform1f(intensityLocation, intensity);
      context.uniform1f(dotScaleLocation, dotScale);
      context.uniform2f(pointerLocation, pointer.x, pointer.y);
      context.uniform1f(hoverLocation, pointer.hover);
      context.uniform3f(backgroundLocation, backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]);
      context.uniform3f(dotColorLocation, dotRgb[0], dotRgb[1], dotRgb[2]);
      context.drawArrays(context.TRIANGLES, 0, 3);

      if (!prefersReducedMotion.matches) {
        animationFrame = window.requestAnimationFrame(render);
      }
    }

    const observer = new ResizeObserver(() => resize());
    observer.observe(target);
    target.addEventListener("pointerenter", updatePointer);
    target.addEventListener("pointermove", updatePointer);
    target.addEventListener("pointerleave", leavePointer);
    render(performance.now());

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      target.removeEventListener("pointerenter", updatePointer);
      target.removeEventListener("pointermove", updatePointer);
      target.removeEventListener("pointerleave", leavePointer);
      context.deleteBuffer(positionBuffer);
      context.deleteProgram(program);
    };
  }, [backgroundRgb, dotRgb, dotScale, intensity, speed]);

  return (
    <div
      className={className}
      ref={wrapperRef}
      style={{
        position: "relative",
        isolation: "isolate",
        minHeight: height,
        overflow: "hidden",
        borderRadius: 28,
        background,
        ...style,
      }}
    >
      <canvas
        aria-hidden="true"
        ref={canvasRef}
        style={{
          display: "block",
          height: "100%",
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
          width: "100%",
        }}
      />

      {!hasWebGl ? (
        <div
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,.16) 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(255,255,255,.12) 1px, transparent 2px)",
            backgroundSize: "18px 18px, 22px 22px",
            inset: 0,
            opacity: 0.7,
            position: "absolute",
          }}
        />
      ) : null}

      {children ? (
        <div
          style={{
            display: "grid",
            inset: 0,
            placeItems: "center",
            position: "absolute",
            zIndex: 1,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
