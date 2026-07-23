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

interface BoxOwnProps {
  className?: string;
  /** Padding on all sides, as a `--space-*` step. */
  padding?: SpaceStep;
  /** Horizontal (inline) padding. Overrides `padding` on the inline axis. */
  paddingX?: SpaceStep;
  /** Vertical (block) padding. Overrides `padding` on the block axis. */
  paddingY?: SpaceStep;
  /** Draw a one-pixel foreground border. */
  border?: boolean;
  /** Apply the token radius (currently square in the two-color model). */
  radius?: boolean;
}

export type BoxProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  BoxOwnProps
>;

function BoxImpl<T extends ElementType = "div">(
  {
    as,
    padding,
    paddingX,
    paddingY,
    border,
    radius,
    className,
    style,
    ...rest
  }: BoxProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "div") as ElementType;
  const vars: Record<string, string> = {};
  if (padding != null) vars["--du-p"] = `var(--space-${padding})`;
  if (paddingX != null) vars["--du-px"] = `var(--space-${paddingX})`;
  if (paddingY != null) vars["--du-py"] = `var(--space-${paddingY})`;

  const mergedStyle =
    Object.keys(vars).length > 0
      ? ({ ...vars, ...style } as CSSProperties)
      : style;

  return (
    <Component
      ref={ref}
      className={cx(
        "du_box",
        border && "du_box_border",
        radius && "du_box_radius",
        className,
      )}
      style={mergedStyle}
      {...rest}
    />
  );
}

/** Polymorphic base element. Renders a `div` by default; use `as` to change it. */
export const Box = forwardRef(BoxImpl) as <T extends ElementType = "div">(
  props: BoxProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
