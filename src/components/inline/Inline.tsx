import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from "react";
import { cx } from "../../utils/cx";
import type { PolymorphicProps, PolymorphicRef } from "../../utils/polymorphic";
import type { SpaceStep } from "../../tokens/scale";

interface InlineOwnProps {
  className?: string;
  /** Space between children, as a `--space-*` step. */
  gap?: SpaceStep;
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Main-axis distribution. */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Allow wrapping to multiple lines. Defaults to true. */
  wrap?: boolean;
}

export type InlineProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  InlineOwnProps
>;

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
} as const;

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
} as const;

function InlineImpl<T extends ElementType = "div">(
  {
    as,
    gap = 3,
    align = "center",
    justify,
    wrap = true,
    className,
    style,
    ...rest
  }: InlineProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "div") as ElementType;
  const vars = {
    "--du-gap": `var(--space-${gap})`,
    alignItems: alignMap[align],
    flexWrap: wrap ? "wrap" : "nowrap",
    ...(justify ? { justifyContent: justifyMap[justify] } : {}),
    ...style,
  } as CSSProperties;

  return (
    <Component
      ref={ref}
      className={cx("du_inline", className)}
      style={vars}
      {...rest}
    />
  );
}

/**
 * Horizontal flex layout with token-based spacing and optional wrapping.
 * Renders a `div` by default; use `as` for semantic elements (`nav`, `ul`, ...).
 */
export const Inline = forwardRef(InlineImpl) as <T extends ElementType = "div">(
  props: InlineProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
