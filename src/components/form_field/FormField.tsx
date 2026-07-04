import { useId, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Label } from "../label/Label";

/** Props passed to the FormField render function for the wrapped control. */
export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

export interface FormFieldProps {
  /** Field label text. */
  label: ReactNode;
  /** Optional helper text shown below the label. */
  hint?: ReactNode;
  /** Error message; when set, the control is marked invalid. */
  error?: ReactNode;
  /** Marks the field required (visual marker only). */
  required?: boolean;
  /** Override the generated control id. */
  id?: string;
  className?: string;
  /** Render the control, spreading the provided a11y props onto it. */
  children: (props: FormFieldControlProps) => ReactNode;
}

/**
 * Composes a label, optional hint, and error around a single control, wiring
 * `id`, `aria-describedby`, and `aria-invalid` for accessibility.
 */
export function FormField({
  label,
  hint,
  error,
  required,
  id: idProp,
  className,
  children,
}: FormFieldProps) {
  const auto = useId();
  const id = idProp ?? `${auto}_control`;
  const hintId = hint != null ? `${auto}_hint` : undefined;
  const errorId = error != null ? `${auto}_error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("du_form_field", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {hint != null && (
        <div id={hintId} className="du_form_field_hint">
          {hint}
        </div>
      )}
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error != null ? true : undefined,
      })}
      {error != null && (
        <div id={errorId} role="alert" className="du_form_field_error">
          {error}
        </div>
      )}
    </div>
  );
}
