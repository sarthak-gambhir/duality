import { useId, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Label } from "../label/Label";
import { FormFieldContext } from "./FormFieldContext";
import type { DisabledTooltipFormatter } from "./disabledTooltip";

/** Props passed to the FormField render function for the wrapped control. */
export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
  "aria-errormessage"?: string;
  disabled?: true;
}

export interface FormFieldProps {
  /** Field label text. */
  label: ReactNode;
  /** Optional helper text shown below the label. */
  hint?: ReactNode;
  /** Error message; when set, the control is marked invalid. */
  error?: ReactNode;
  /** Marks the field required (visual marker + `aria-required` on the control). */
  required?: boolean;
  /** Disable the field: dims the label and forwards `disabled` to the control. */
  disabled?: boolean;
  /**
   * When the field is disabled, the reason shown in a hover tooltip on the
   * control (alongside its current value). Hover-only, since disabled controls
   * cannot receive focus.
   */
  disabledReason?: ReactNode;
  /** Override the default disabled-tooltip content formatting. */
  disabledTooltip?: DisabledTooltipFormatter;
  /** Override the generated control id. */
  id?: string;
  className?: string;
  /**
   * Render the control, spreading the provided a11y props onto it. Optional:
   * when omitted, children are rendered directly and controls that consume
   * {@link useFormField} pick up the same wiring from context.
   */
  children: ReactNode | ((props: FormFieldControlProps) => ReactNode);
}

/**
 * Composes a label, optional hint, and error around a single control, wiring
 * `id`, `aria-describedby`, `aria-invalid`/`aria-errormessage`, `aria-required`,
 * and `disabled` for accessibility. Works with a render prop (custom controls)
 * or with plain children via {@link FormFieldContext}.
 */
export function FormField({
  label,
  hint,
  error,
  required,
  disabled,
  disabledReason,
  disabledTooltip,
  id: idProp,
  className,
  children,
}: FormFieldProps) {
  const auto = useId();
  const id = idProp ?? `${auto}_control`;
  const hintId = hint != null ? `${auto}_hint` : undefined;
  const errorId = error != null ? `${auto}_error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = error != null;

  const controlProps: FormFieldControlProps = {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid || undefined,
    "aria-required": required || undefined,
    "aria-errormessage": invalid ? errorId : undefined,
    disabled: disabled || undefined,
  };

  return (
    <FormFieldContext.Provider
      value={{
        id,
        describedBy,
        errorId,
        invalid,
        required: !!required,
        disabled: !!disabled,
        disabledReason,
        disabledTooltip,
      }}
    >
      <div className={cx("du_form_field", className)}>
        <Label htmlFor={id} required={required} disabled={disabled}>
          {label}
        </Label>
        {hint != null && (
          <div id={hintId} className="du_form_field_hint">
            {hint}
          </div>
        )}
        {typeof children === "function" ? children(controlProps) : children}
        {error != null && (
          <div id={errorId} role="alert" className="du_form_field_error">
            {error}
          </div>
        )}
      </div>
    </FormFieldContext.Provider>
  );
}
