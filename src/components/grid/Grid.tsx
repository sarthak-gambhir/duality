import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cx } from "../../utils/cx";
import type { SpaceStep } from "../../tokens/scale";

export interface GridProps extends ComponentPropsWithoutRef<"div"> {
  /** Number of equal-width columns. */
  columns?: number;
  /** Space between cells, as a `--space-*` step. */
  gap?: SpaceStep;
}

/** CSS grid with a fixed number of equal columns and token-based gaps. */
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 2, gap = 4, className, style, ...rest },
  ref,
) {
  const vars = {
    "--du-cols": String(columns),
    "--du-gap": `var(--space-${gap})`,
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={cx("du_grid", className)}
      style={vars}
      {...rest}
    />
  );
});
