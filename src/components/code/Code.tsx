import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export type CodeProps = ComponentPropsWithoutRef<"code">;

/** Inline monospace code span. */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { className, ...rest },
  ref,
) {
  return <code ref={ref} className={cx("du_code", className)} {...rest} />;
});
