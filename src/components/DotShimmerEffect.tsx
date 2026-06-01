"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const TRAIL_LENGTH = 64;

const VERTEX_SHADER = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_density;
uniform float u_intensity;
uniform float u_ambient;
uniform float u_trailRadius;
uniform float u_trailDecay;
uniform vec3 u_background;
uniform vec3 u_squareColor;
uniform vec3 u_trail[${TRAIL_LENGTH}];

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float squareMask(vec2 p, float halfSize) {
  vec2 d = abs(p);
  float box = max(d.x, d.y);
  return 1.0 - smoothstep(halfSize * 0.82, halfSize, box);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 centered = (uv - 0.5) * aspect;

  float vignette = smoothstep(1.05, 0.18, length(centered));
  float grain = (hash21(gl_FragCoord.xy + floor(u_time * 24.0)) - 0.5) * 0.010;
  vec3 color = u_background * (0.85 + 0.15 * vignette) + grain;

  // Trail glow at this fragment (one loop per fragment, not per square).
  // Each trail point: xy = normalized pos, z = age in seconds (z < 0 = empty).
  float trailGlow = 0.0;
  for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
    vec3 tp = u_trail[i];
    if (tp.z < 0.0) continue;
    float d = length((uv - tp.xy) * aspect);
    float spatial = exp(-pow(d / u_trailRadius, 2.0));
    // Streak fades to zero by ~500ms; the cursor head stays bright because
    // trail[0] is always age=0 and max() in this loop wins.
    float lifetimeFade = 1.0 - smoothstep(0.1, 0.5, tp.z);
    float temporal = exp(-tp.z * u_trailDecay) * lifetimeFade;
    trailGlow = max(trailGlow, spatial * temporal);
  }

  // Square pixel-cell grid: base count on both axes, X scaled by aspect so
  // cells are guaranteed square in pixel space regardless of stage aspect.
  float baseGrid = 48.0 * u_density;
  vec2 grid = vec2(baseGrid * aspect.x, baseGrid);
  vec2 cell = uv * grid;
  vec2 id = floor(cell);
  vec2 local = fract(cell);

  float dots = 0.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 cellId = id + offset;
      float seed = hash21(cellId);
      float seed2 = hash21(cellId + 17.7);
      vec2 squareCenter = offset + 0.5;
      float halfSize = 0.20;
      float mask = squareMask(local - squareCenter, halfSize);

      // Sparse twinkle: ~12% of squares blink very gently at ambient.
      float isBlinker = step(0.88, seed);
      float twinkle = isBlinker *
        (0.5 + 0.5 * sin(u_time * 1.6 + seed2 * 6.2831)) * 0.45;
      float ambient = u_ambient * (1.0 + twinkle);

      float presence = ambient + trailGlow * u_intensity;
      dots += mask * presence;
    }
  }

  dots = clamp(dots, 0.0, 1.2);
  vec3 shimmer = mix(u_squareColor * 0.55, u_squareColor, smoothstep(0.15, 0.85, dots));
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
  const squareRgb = useMemo(() => hexToRgb(dotColor), [dotColor]);

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
    const densityLocation = context.getUniformLocation(program, "u_density");
    const intensityLocation = context.getUniformLocation(program, "u_intensity");
    const ambientLocation = context.getUniformLocation(program, "u_ambient");
    const trailRadiusLocation = context.getUniformLocation(program, "u_trailRadius");
    const trailDecayLocation = context.getUniformLocation(program, "u_trailDecay");
    const backgroundLocation = context.getUniformLocation(program, "u_background");
    const squareColorLocation = context.getUniformLocation(program, "u_squareColor");
    const trailLocation = context.getUniformLocation(program, "u_trail");

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

    // Trail buffer: flat [x0, y0, age0, x1, y1, age1, ...]. age < 0 = empty.
    const trail = new Float32Array(TRAIL_LENGTH * 3);
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trail[i * 3 + 2] = -1;
    }

    const raw = { x: 0.5, y: 0.5 };
    const tip = { x: 0.5, y: 0.5 };
    let hovering = false;
    let animationFrame = 0;
    let disposed = false;
    let lastTime = performance.now();
    const start = lastTime;

    const TRAIL_RADIUS = 0.13;
    const BASE_TRAIL_DECAY = 1.4;
    const AMBIENT = 0.055;
    const CURSOR_SMOOTHING = 0.25;

    function updatePointer(event: PointerEvent) {
      const rect = target.getBoundingClientRect();
      raw.x = (event.clientX - rect.left) / Math.max(1, rect.width);
      raw.y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      hovering = true;
    }

    function onPointerEnter(event: PointerEvent) {
      updatePointer(event);
      tip.x = raw.x;
      tip.y = raw.y;

      if (prefersReducedMotion.matches) {
        renderStatic();
      }
    }

    function onPointerMove(event: PointerEvent) {
      updatePointer(event);

      if (prefersReducedMotion.matches) {
        renderStatic();
      }
    }

    function onPointerLeave() {
      hovering = false;

      if (prefersReducedMotion.matches) {
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          trail[i * 3 + 2] = -1;
        }
        renderStatic();
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

    function uploadUniforms(timeSeconds: number) {
      context.useProgram(program);
      context.uniform2f(resolutionLocation, targetCanvas.width, targetCanvas.height);
      context.uniform1f(timeLocation, timeSeconds);
      context.uniform1f(densityLocation, dotScale);
      context.uniform1f(intensityLocation, intensity);
      context.uniform1f(ambientLocation, AMBIENT);
      context.uniform1f(trailRadiusLocation, TRAIL_RADIUS);
      context.uniform1f(trailDecayLocation, BASE_TRAIL_DECAY * Math.max(0.2, speed));
      context.uniform3f(backgroundLocation, backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]);
      context.uniform3f(squareColorLocation, squareRgb[0], squareRgb[1], squareRgb[2]);
      context.uniform3fv(trailLocation, trail);
      context.drawArrays(context.TRIANGLES, 0, 3);
    }

    // For prefers-reduced-motion: render a single frame with a static halo
    // at the cursor (no streak, no continuous animation, no twinkle ramp).
    function renderStatic() {
      if (disposed) return;
      resize();

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        trail[i * 3 + 2] = -1;
      }
      if (hovering) {
        trail[0] = raw.x;
        trail[1] = raw.y;
        trail[2] = 0;
      }

      uploadUniforms(2.9);
    }

    function render(now: number) {
      if (disposed) return;

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      resize();

      // Smooth tip toward raw cursor (frame-rate aware lerp).
      const lerpAmount = 1 - Math.pow(1 - CURSOR_SMOOTHING, Math.max(1, dt * 60));
      tip.x += (raw.x - tip.x) * lerpAmount;
      tip.y += (raw.y - tip.y) * lerpAmount;

      if (hovering) {
        for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
          trail[i * 3] = trail[(i - 1) * 3];
          trail[i * 3 + 1] = trail[(i - 1) * 3 + 1];
          trail[i * 3 + 2] = trail[(i - 1) * 3 + 2];
        }
        trail[0] = tip.x;
        trail[1] = tip.y;
        trail[2] = 0;
      }

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        if (trail[i * 3 + 2] >= 0) {
          trail[i * 3 + 2] += dt;
        }
      }

      uploadUniforms((now - start) / 1000);

      animationFrame = window.requestAnimationFrame(render);
    }

    const observer = new ResizeObserver(() => {
      if (prefersReducedMotion.matches) renderStatic();
    });
    observer.observe(target);
    target.addEventListener("pointerenter", onPointerEnter);
    target.addEventListener("pointermove", onPointerMove);
    target.addEventListener("pointerleave", onPointerLeave);

    if (prefersReducedMotion.matches) {
      renderStatic();
    } else {
      animationFrame = window.requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      target.removeEventListener("pointerenter", onPointerEnter);
      target.removeEventListener("pointermove", onPointerMove);
      target.removeEventListener("pointerleave", onPointerLeave);
      context.deleteBuffer(positionBuffer);
      context.deleteProgram(program);
    };
  }, [backgroundRgb, squareRgb, dotScale, intensity, speed]);

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
