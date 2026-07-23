import {
  forwardRef,
  Fragment,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";

export interface KbdProps extends ComponentPropsWithoutRef<"kbd"> {
  /** Render a key combo: each entry becomes its own `<kbd>` cap. */
  keys?: string[];
  /** Separator shown between combo keys. Defaults to `"+"`. */
  separator?: ReactNode;
}

/** Keyboard key hint with a pixel border. Pass `keys` to render a combo. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, separator = "+", className, children, ...rest },
  ref,
) {
  if (keys && keys.length > 0) {
    return (
      <kbd ref={ref} className={cx("du_kbd_combo", className)} {...rest}>
        {keys.map((key, i) => (
          <Fragment key={`${key}-${i}`}>
            {i > 0 && (
              <span className="du_kbd_sep" aria-hidden="true">
                {separator}
              </span>
            )}
            <kbd className="du_kbd">{key}</kbd>
          </Fragment>
        ))}
      </kbd>
    );
  }

  return (
    <kbd ref={ref} className={cx("du_kbd", className)} {...rest}>
      {children}
    </kbd>
  );
});
