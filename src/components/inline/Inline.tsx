import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cx } from "../../utils/cx";
import type { SpaceStep } from "../../tokens/scale";

export interface InlineProps extends ComponentPropsWithoutRef<"div"> {
  /** Space between children, as a `--space-*` step. */
  gap?: SpaceStep;
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Main-axis distribution. */
  justify?: "start" | "center" | "end" | "between";
  /** Allow wrapping to multiple lines. Defaults to true. */
  wrap?: boolean;
}

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
} as const;

/** Horizontal flex layout with token-based spacing and optional wrapping. */
export const Inline = forwardRef<HTMLDivElement, InlineProps>(function Inline(
  {
    gap = 3,
    align = "center",
    justify,
    wrap = true,
    className,
    style,
    ...rest
  },
  ref,
) {
  const vars = {
    "--du-gap": `var(--space-${gap})`,
    alignItems: alignMap[align],
    flexWrap: wrap ? "wrap" : "nowrap",
    ...(justify ? { justifyContent: justifyMap[justify] } : {}),
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={cx("du_inline", className)}
      style={vars}
      {...rest}
    />
  );
});
