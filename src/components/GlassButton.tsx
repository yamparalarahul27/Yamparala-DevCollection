import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./GlassComponents.module.css";

type GlassButtonBaseProps = {
  children?: ReactNode;
  className?: string;
  leading?: ReactNode;
  size?: "cta" | "nav";
  trailing?: ReactNode;
};

type GlassButtonElementProps =
  | (GlassButtonBaseProps &
      ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: undefined;
      })
  | (GlassButtonBaseProps &
      AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      });

export type GlassButtonProps = GlassButtonElementProps;

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

function omitProps(props: object, keys: string[]) {
  const elementProps = { ...props } as Record<string, unknown>;

  keys.forEach((key) => {
    delete elementProps[key];
  });

  return elementProps;
}

function ButtonInner({
  children,
  leading,
  trailing,
}: {
  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <>
      {leading ? (
        <span aria-hidden="true" className={styles.buttonIcon}>
          {leading}
        </span>
      ) : null}
      <span className={styles.buttonContent}>{children}</span>
      {trailing ? (
        <span aria-hidden="true" className={styles.buttonIcon}>
          {trailing}
        </span>
      ) : null}
    </>
  );
}

export default function GlassButton(props: GlassButtonProps) {
  const {
    children = "Request access",
    className,
    leading,
    size = "cta",
    trailing,
  } = props;
  const glassClassName = cx(
    styles.glassButton,
    size === "nav" && styles.nav,
    className,
  );

  if (typeof props.href === "string") {
    const anchorProps = omitProps(props, [
      "children",
      "className",
      "leading",
      "size",
      "trailing",
    ]) as unknown as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

    return (
      <a {...anchorProps} className={glassClassName}>
        <ButtonInner leading={leading} trailing={trailing}>
          {children}
        </ButtonInner>
      </a>
    );
  }

  const buttonProps = omitProps(props, [
    "children",
    "className",
    "href",
    "leading",
    "size",
    "trailing",
    "type",
  ]) as unknown as ButtonHTMLAttributes<HTMLButtonElement>;
  const type = props.type ?? "button";

  return (
    <button {...buttonProps} className={glassClassName} type={type}>
      <ButtonInner leading={leading} trailing={trailing}>
        {children}
      </ButtonInner>
    </button>
  );
}
