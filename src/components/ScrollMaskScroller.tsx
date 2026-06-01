import styles from "./ScrollMaskScroller.module.css";

const defaultItems = [
  "The first row remains crisp while the top edge gently clears as you scroll.",
  "Masking leaves scrollbar space untouched so the track does not get faded out.",
  "The enhancement is CSS-only and still reads as a normal scroller in older browsers.",
  "Rows can be any content: settings, logs, messages, or dense dashboard events.",
  "A short scroll-linked animation changes the mask during the first local rem of scroll.",
  "The component keeps keyboard focus visible and preserves native wheel behavior.",
  "The scroll mask is deliberately subtle so content does not feel hidden.",
  "Use it around lists where clipping needs to feel polished instead of abrupt.",
  "The base mask works without scroll-timeline support.",
  "The final row is fully readable after the edge fade.",
];

export default function ScrollMaskScroller({ items = defaultItems }: { items?: string[] }) {
  return (
    <section className={styles.frame} aria-label="Scroll masked content">
      <div className={styles.scroller} tabIndex={0}>
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li className={styles.item} key={item}>
              <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
