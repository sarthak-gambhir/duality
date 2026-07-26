import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";
import { useFormField } from "../form_field/FormFieldContext";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

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
  function Checkbox(
    {
      label,
      indeterminate = false,
      className,
      id,
      disabled,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedby,
      "aria-required": ariaRequired,
      ...rest
    },
    ref,
  ) {
    const innerRef = useRef<HTMLInputElement>(null);
    const icons = useIcons();
    const field = useFormField();

    // Explicit props always win; the FormField context is a fallback.
    const resolvedId = id ?? field?.id;
    const isDisabled = disabled ?? field?.disabled;
    const describedBy = ariaDescribedby ?? field?.describedBy;
    const invalidAttr = ariaInvalid ?? (field?.invalid ? true : undefined);
    const requiredAttr = ariaRequired ?? (field?.required || undefined);

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label
        className={cx(
          "du_checkbox",
          isDisabled && "du_checkbox_disabled",
          className,
        )}
      >
        <input
          ref={mergeRefs(innerRef, ref)}
          type="checkbox"
          className="du_checkbox_input"
          id={resolvedId}
          disabled={isDisabled}
          aria-invalid={invalidAttr}
          aria-describedby={describedBy}
          aria-required={requiredAttr}
          {...rest}
        />
        <span className="du_checkbox_box" aria-hidden="true">
          <Icon icon={icons.check} className="du_checkbox_check" />
          <Icon icon={icons.dash} className="du_checkbox_dash" />
        </span>
        {label != null && <span className="du_checkbox_label">{label}</span>}
      </label>
    );
  },
);
