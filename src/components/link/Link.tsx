import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export type LinkProps = ComponentPropsWithoutRef<"a">;

/** Text link: underlined by default, inverts on hover. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, ...rest },
  ref,
) {
  return <a ref={ref} className={cx("du_link", className)} {...rest} />;
});
