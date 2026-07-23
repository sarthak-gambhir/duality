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

interface GridOwnProps {
  className?: string;
  /** Number of equal-width columns. Ignored when `minChildWidth` is set. */
  columns?: number;
  /**
   * Responsive auto-fit: pack as many columns as fit, each at least this many
   * pixels wide. Takes precedence over `columns`.
   */
  minChildWidth?: number;
  /** Space between cells, as a `--space-*` step. */
  gap?: SpaceStep;
  /** Block-axis alignment of cells within their tracks. */
  align?: "start" | "center" | "end" | "stretch";
  /** Inline-axis alignment of cells within their tracks. */
  justify?: "start" | "center" | "end" | "stretch";
}

export type GridProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  GridOwnProps
>;

function GridImpl<T extends ElementType = "div">(
  {
    as,
    columns = 2,
    minChildWidth,
    gap = 4,
    align,
    justify,
    className,
    style,
    ...rest
  }: GridProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "div") as ElementType;
  const cols =
    minChildWidth != null
      ? `repeat(auto-fill, minmax(min(${minChildWidth}px, 100%), 1fr))`
      : `repeat(${Math.max(1, Math.floor(columns))}, minmax(0, 1fr))`;

  const vars = {
    "--du-cols": cols,
    "--du-gap": `var(--space-${gap})`,
    ...(align ? { alignItems: align } : {}),
    ...(justify ? { justifyItems: justify } : {}),
    ...style,
  } as CSSProperties;

  return (
    <Component
      ref={ref}
      className={cx("du_grid", className)}
      style={vars}
      {...rest}
    />
  );
}

/**
 * CSS grid with token-based gaps. Fixed equal `columns` by default, or a
 * responsive auto-fit track when `minChildWidth` is set.
 */
export const Grid = forwardRef(GridImpl) as <T extends ElementType = "div">(
  props: GridProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
