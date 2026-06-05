import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AvatarStyle = CSSProperties & Record<`--${string}`, string | number>;

export type ProfileAvatarProps = {
  bottom?: string;
  children?: ReactNode;
  className?: string;
  dithered?: boolean;
  label?: string;
  size?: number | string;
  top?: string;
};

function getSizeValue(size: number | string) {
  return typeof size === "number" ? `${size}px` : size;
}

export default function ProfileAvatar({
  bottom = "#ad73ee",
  children,
  className,
  dithered = false,
  label,
  size = 104,
  top = "#9b4ee8",
}: ProfileAvatarProps) {
  const resolvedSize = getSizeValue(size);
  const textSize =
    typeof size === "number"
      ? `${Math.max(14, size * 0.3)}px`
      : "clamp(1.25rem, 8vw, 2.6rem)";

  return (
    <div
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full",
        "shadow-[0_16px_28px_rgba(15,23,42,0.12)]",
        className,
      )}
      role={label ? "img" : undefined}
      style={
        {
          "--avatar-bottom": bottom,
          "--avatar-text-size": textSize,
          "--avatar-top": top,
          background:
            "radial-gradient(circle at 32% 18%, rgba(255,255,255,0.46), transparent 34%), linear-gradient(180deg, var(--avatar-top) 0 51%, var(--avatar-bottom) 51% 100%)",
          height: resolvedSize,
          width: resolvedSize,
        } as AvatarStyle
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-full ring-1 ring-inset ring-white/35"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_68%_78%,rgba(0,0,0,0.16),transparent_42%)]"
      />

      {dithered ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full opacity-65 mix-blend-soft-light"
            style={{
              WebkitMaskImage:
                "linear-gradient(155deg, #000 0 58%, transparent 94%)",
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.86) 0 0.7px, transparent 0.86px)",
              backgroundPosition: "0 0",
              backgroundSize: "5px 5px",
              maskImage:
                "linear-gradient(155deg, #000 0 58%, transparent 94%)",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full opacity-30 mix-blend-multiply"
            style={{
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0 18%, #000 56%, transparent 100%)",
              backgroundImage:
                "radial-gradient(circle, rgba(15,23,42,0.72) 0 0.62px, transparent 0.78px)",
              backgroundPosition: "2px 2px",
              backgroundSize: "4px 4px",
              maskImage:
                "linear-gradient(180deg, transparent 0 18%, #000 56%, transparent 100%)",
            }}
          />
        </>
      ) : null}

      {children ? (
        <span
          className="relative z-10 font-semibold leading-none tracking-[0.02em] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)]"
          style={{ fontSize: "var(--avatar-text-size)" }}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
}
