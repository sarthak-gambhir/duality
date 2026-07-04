import {
  forwardRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from "react";
import { cx } from "../../utils/cx";
import type { PolymorphicProps, PolymorphicRef } from "../../utils/polymorphic";

export type BoxProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  { className?: string }
>;

function BoxImpl<T extends ElementType = "div">(
  { as, className, ...rest }: BoxProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "div") as ElementType;
  return <Component ref={ref} className={cx("du_box", className)} {...rest} />;
}

/** Polymorphic base element. Renders a `div` by default; use `as` to change it. */
export const Box = forwardRef(BoxImpl) as <T extends ElementType = "div">(
  props: BoxProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
