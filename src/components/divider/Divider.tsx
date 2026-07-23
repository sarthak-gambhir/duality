import {
  forwardRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import type { PolymorphicProps, PolymorphicRef } from "../../utils/polymorphic";

interface DividerOwnProps {
  className?: string;
  /** Line direction. Defaults to horizontal. */
  orientation?: "horizontal" | "vertical";
  /** Optional centered label with a rule on each side (horizontal only). */
  label?: ReactNode;
  /** Purely visual rule: drop the `separator` role. Defaults to false. */
  decorative?: boolean;
}

export type DividerProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  DividerOwnProps
>;

function DividerImpl<T extends ElementType = "div">(
  {
    as,
    orientation = "horizontal",
    label,
    decorative = false,
    className,
    children,
    ...rest
  }: DividerProps<T>,
  ref: ForwardedRef<Element>,
) {
  const content = label ?? children;
  const roleProps = decorative
    ? { role: "none" as const }
    : { role: "separator" as const, "aria-orientation": orientation };

  // Labeled dividers need a flow container, so they cannot be an <hr>.
  if (content != null) {
    const LabeledTag = (as ?? "div") as ElementType;
    return (
      <LabeledTag
        ref={ref}
        {...roleProps}
        className={cx(
          "du_divider",
          "du_divider_labeled",
          orientation === "vertical" && "du_divider_vertical",
          className,
        )}
        {...rest}
      >
        <span className="du_divider_line" aria-hidden="true" />
        <span className="du_divider_label">{content}</span>
        <span className="du_divider_line" aria-hidden="true" />
      </LabeledTag>
    );
  }

  // Unlabeled: a horizontal rule is a semantic <hr> by default; vertical stays a
  // div (an <hr> is inherently horizontal).
  const Tag = (as ??
    (orientation === "horizontal" ? "hr" : "div")) as ElementType;
  return (
    <Tag
      ref={ref}
      {...roleProps}
      className={cx(
        "du_divider",
        orientation === "vertical" && "du_divider_vertical",
        className,
      )}
      {...rest}
    />
  );
}

/** A one-pixel-family rule drawn in the foreground color. */
export const Divider = forwardRef(DividerImpl) as <
  T extends ElementType = "div",
>(
  props: DividerProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
