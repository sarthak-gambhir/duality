import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from "react";
import { cx } from "../../utils/cx";
import type { PolymorphicProps, PolymorphicRef } from "../../utils/polymorphic";
import type { SizeToken, SpaceStep } from "../../tokens/scale";

interface ContainerOwnProps {
  className?: string;
  /** Max-width preset mapped to a `--container-*` token. Defaults to `lg`. */
  size?: SizeToken;
  /** Custom max content width in pixels. Overrides `size` when set. */
  maxWidth?: number;
  /** Horizontal padding, as a `--space-*` step. Defaults to 4. */
  padding?: SpaceStep;
}

export type ContainerProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  ContainerOwnProps
>;

function ContainerImpl<T extends ElementType = "div">(
  { as, size = "lg", maxWidth, padding, className, style, ...rest }: ContainerProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "div") as ElementType;
  const vars = {
    "--du-max": maxWidth != null ? `${maxWidth}px` : `var(--container-${size})`,
    ...(padding != null ? { "--du-pad": `var(--space-${padding})` } : {}),
    ...style,
  } as CSSProperties;

  return (
    <Component
      ref={ref}
      className={cx("du_container", className)}
      style={vars}
      {...rest}
    />
  );
}

/**
 * Centered, max-width page wrapper with horizontal padding. Renders a `div` by
 * default; use `as="main"` for the primary landmark.
 */
export const Container = forwardRef(ContainerImpl) as <
  T extends ElementType = "div",
>(
  props: ContainerProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
