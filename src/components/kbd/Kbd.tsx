import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export type KbdProps = ComponentPropsWithoutRef<"kbd">;

/** Keyboard key hint with a pixel border. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, ...rest },
  ref,
) {
  return <kbd ref={ref} className={cx("du_kbd", className)} {...rest} />;
});
