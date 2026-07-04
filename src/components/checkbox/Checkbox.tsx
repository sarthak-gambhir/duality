import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";

export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type"
> {
  /** Text shown next to the box. */
  label?: ReactNode;
  /** Renders the mixed (indeterminate) state. */
  indeterminate?: boolean;
}

/** Two-color checkbox with a native input and a drawn pixel mark. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, indeterminate = false, className, ...rest }, ref) {
    const innerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label
        className={cx(
          "du_checkbox",
          rest.disabled && "du_checkbox_disabled",
          className,
        )}
      >
        <input
          ref={mergeRefs(innerRef, ref)}
          type="checkbox"
          className="du_checkbox_input"
          {...rest}
        />
        <span className="du_checkbox_box" aria-hidden="true" />
        {label != null && <span className="du_checkbox_label">{label}</span>}
      </label>
    );
  },
);
