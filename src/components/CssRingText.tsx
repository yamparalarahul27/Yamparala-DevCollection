import type { CSSProperties } from "react";
import styles from "./CssRingText.module.css";

type CssVarStyle = CSSProperties & Record<`--${string}`, string | number>;

export default function CssRingText({
  text = "CSS RING TEXT CSS RING TEXT",
}: {
  text?: string;
}) {
  const characters = Array.from(text);

  return (
    <div className={styles.stage}>
      <div
        aria-label={text}
        className={styles.ring}
        style={{ "--total": characters.length } as CssVarStyle}
      >
        {characters.map((character, index) => (
          <span
            aria-hidden="true"
            className={styles.character}
            key={`${character}-${index}`}
            style={{ "--index": index } as CssVarStyle}
        >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </div>
    </div>
  );
}
