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

interface StackOwnProps {
  className?: string;
  /** Space between children, as a `--space-*` step. */
  gap?: SpaceStep;
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch";
  /** Main-axis distribution. */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Allow wrapping to multiple lines. Defaults to false. */
  wrap?: boolean;
}

export type StackProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  StackOwnProps
>;

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
} as const;

function StackImpl<T extends ElementType = "div">(
  { as, gap = 4, align, justify, wrap, className, style, ...rest }: StackProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "div") as ElementType;
  const vars = {
    "--du-gap": `var(--space-${gap})`,
    ...(align ? { alignItems: alignMap[align] } : {}),
    ...(justify ? { justifyContent: justifyMap[justify] } : {}),
    ...(wrap ? { flexWrap: "wrap" } : {}),
    ...style,
  } as CSSProperties;

  return (
    <Component
      ref={ref}
      className={cx("du_stack", className)}
      style={vars}
      {...rest}
    />
  );
}

/** Vertical flex layout with token-based spacing. Renders a `div` by default. */
export const Stack = forwardRef(StackImpl) as <T extends ElementType = "div">(
  props: StackProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
