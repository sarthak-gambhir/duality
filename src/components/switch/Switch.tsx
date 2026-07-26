import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useFormField } from "../form_field/FormFieldContext";

export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type"
> {
  /** Text shown next to the switch. */
  label?: ReactNode;
}

/** Two-color toggle switch built on a native checkbox with `role="switch"`. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
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
  const field = useFormField();

  // Explicit props always win; the FormField context is a fallback.
  const resolvedId = id ?? field?.id;
  const isDisabled = disabled ?? field?.disabled;
  const describedBy = ariaDescribedby ?? field?.describedBy;
  const invalidAttr = ariaInvalid ?? (field?.invalid ? true : undefined);
  const requiredAttr = ariaRequired ?? (field?.required || undefined);

  return (
    <label
      className={cx(
        "du_switch",
        isDisabled && "du_switch_disabled",
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className="du_switch_input"
        id={resolvedId}
        disabled={isDisabled}
        aria-invalid={invalidAttr}
        aria-describedby={describedBy}
        aria-required={requiredAttr}
        {...rest}
      />
      <span className="du_switch_track" aria-hidden="true">
        <span className="du_switch_thumb" />
      </span>
      {label != null && <span className="du_switch_label">{label}</span>}
    </label>
  );
});
