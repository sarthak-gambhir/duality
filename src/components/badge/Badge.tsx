import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  /** `solid` is filled, `outline` is bordered only. */
  variant?: "solid" | "outline";
}

/** Small inline chip / tag. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "solid", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx("du_badge", `du_badge_${variant}`, className)}
      {...rest}
    />
  );
});
