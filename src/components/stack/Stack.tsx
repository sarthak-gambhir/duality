import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cx } from "../../utils/cx";
import type { SpaceStep } from "../../tokens/scale";

export interface StackProps extends ComponentPropsWithoutRef<"div"> {
  /** Space between children, as a `--space-*` step. */
  gap?: SpaceStep;
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch";
}

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

/** Vertical flex layout with token-based spacing. */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { gap = 4, align, className, style, ...rest },
  ref,
) {
  const vars = {
    "--du-gap": `var(--space-${gap})`,
    ...(align ? { alignItems: alignMap[align] } : {}),
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={cx("du_stack", className)}
      style={vars}
      {...rest}
    />
  );
});
