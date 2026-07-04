import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface InputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size"
> {
  /** Marks the field invalid (border-style change + `aria-invalid`). */
  invalid?: boolean;
  /** Control size. */
  inputSize?: "sm" | "md" | "lg";
}

/** Single-line text field. Invalid state shows a dashed border, not color. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    invalid,
    inputSize = "md",
    className,
    "aria-invalid": ariaInvalid,
    ...rest
  },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={cx(
        "du_input",
        `du_input_${inputSize}`,
        invalid && "du_input_invalid",
        className,
      )}
      {...rest}
    />
  );
});
