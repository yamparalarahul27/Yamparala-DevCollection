import type { HTMLAttributes, ReactNode } from "react";
import styles from "./GlassComponents.module.css";

export type GlassCardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div";
  description?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  title?: ReactNode;
};

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export default function GlassCard({
  as: Tag = "article",
  children,
  className,
  description,
  eyebrow,
  footer,
  title,
  ...props
}: GlassCardProps) {
  return (
    <Tag className={cx(styles.glassCard, className)} {...props}>
      {eyebrow || title || description ? (
        <header className={styles.cardHeader}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </header>
      ) : null}

      {children ? <div className={styles.cardBody}>{children}</div> : null}

      {footer ? <footer className={styles.cardFooter}>{footer}</footer> : null}
    </Tag>
  );
}
