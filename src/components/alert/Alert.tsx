import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";

export interface AlertProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "title"
> {
  /** Severity. Signalled by marker shape + border style, never by color. */
  tone?: "info" | "warning" | "error";
  /** Optional bold heading above the body. */
  title?: ReactNode;
}

/** Callout box. Tone is conveyed by a pixel marker and border style. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = "info", title, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role={tone === "error" ? "alert" : "status"}
      className={cx("du_alert", `du_alert_${tone}`, className)}
      {...rest}
    >
      <span className="du_alert_marker" aria-hidden="true" />
      <div className="du_alert_content">
        {title != null && <div className="du_alert_title">{title}</div>}
        <div className="du_alert_body">{children}</div>
      </div>
    </div>
  );
});
