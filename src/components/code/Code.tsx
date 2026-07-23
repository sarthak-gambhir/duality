import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface CodeProps extends ComponentPropsWithoutRef<"code"> {
  /** Render a bordered `<pre><code>` block instead of an inline span. */
  block?: boolean;
}

/** Monospace code. Inline span by default; `block` renders a bordered `<pre>`. */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { block, className, children, ...rest },
  ref,
) {
  if (block) {
    return (
      <pre className={cx("du_code_block", className)}>
        <code ref={ref} className="du_code du_code_in_block" {...rest}>
          {children}
        </code>
      </pre>
    );
  }
  return (
    <code ref={ref} className={cx("du_code", className)} {...rest}>
      {children}
    </code>
  );
});
