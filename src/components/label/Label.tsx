import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  /** Shows a required marker after the text. */
  required?: boolean;
}

/** Form label; associate with a control via `htmlFor`. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required, className, children, ...rest },
  ref,
) {
  return (
    <label ref={ref} className={cx("du_label", className)} {...rest}>
      {children}
      {required && (
        <span className="du_label_required" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
});
