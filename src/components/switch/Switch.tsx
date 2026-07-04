import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";

export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type"
> {
  /** Text shown next to the switch. */
  label?: ReactNode;
}

/** Two-color toggle switch built on a native checkbox with `role="switch"`. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className, ...rest },
  ref,
) {
  return (
    <label
      className={cx(
        "du_switch",
        rest.disabled && "du_switch_disabled",
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className="du_switch_input"
        {...rest}
      />
      <span className="du_switch_track" aria-hidden="true">
        <span className="du_switch_thumb" />
      </span>
      {label != null && <span className="du_switch_label">{label}</span>}
    </label>
  );
});
