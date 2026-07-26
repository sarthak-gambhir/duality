import { createContext, useContext, type ReactNode } from "react";

/**
 * Field wiring shared by FormField with any control rendered inside it, so a
 * control can be used as a plain child (`<FormField><Input/></FormField>`)
 * without the render prop and still pick up `id` / describedby / invalid state.
 */
export interface FormFieldContextValue {
  /** Control id (matches the label's `htmlFor`). */
  id: string;
  /** Space-separated hint + error ids for `aria-describedby`. */
  describedBy?: string;
  /** Error message element id (for `aria-errormessage`). */
  errorId?: string;
  /** Whether the field currently has an error. */
  invalid: boolean;
  /** Whether the field is required. */
  required: boolean;
  /** Whether the field is disabled. */
  disabled: boolean;
  /** Reason the field is disabled, surfaced as a caption by the control. */
  disabledReason?: ReactNode;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null,
);

/** Read the enclosing FormField wiring, or `null` when used standalone. */
export function useFormField(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}
