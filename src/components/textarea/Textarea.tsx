import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  /** Marks the field invalid (border-style change + `aria-invalid`). */
  invalid?: boolean;
}

/** Multi-line text field sharing the Input styling. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { invalid, className, "aria-invalid": ariaInvalid, ...rest },
    ref,
  ) {
    return (
      <textarea
        ref={ref}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        className={cx(
          "du_input",
          "du_textarea",
          invalid && "du_input_invalid",
          className,
        )}
        {...rest}
      />
    );
  },
);
