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
  /** Replaces the default tone marker (e.g. a custom pixel icon). */
  icon?: ReactNode;
  /** Action slot (e.g. a Button/Link) shown at the trailing edge. */
  action?: ReactNode;
  /** Show a close button and call this when pressed. */
  onDismiss?: () => void;
  /** Accessible label for the close button. */
  dismissLabel?: string;
}

/** Callout box. Tone is conveyed by a pixel marker and border style. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    tone = "info",
    title,
    icon,
    action,
    onDismiss,
    dismissLabel = "Dismiss",
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      role={tone === "error" ? "alert" : "status"}
      className={cx("du_alert", `du_alert_${tone}`, className)}
      {...rest}
    >
      {icon != null ? (
        <span className="du_alert_icon" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <span className="du_alert_marker" aria-hidden="true" />
      )}
      <div className="du_alert_content">
        {title != null && <div className="du_alert_title">{title}</div>}
        <div className="du_alert_body">{children}</div>
      </div>
      {action != null && <div className="du_alert_action">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          className="du_alert_close"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          &times;
        </button>
      )}
    </div>
  );
});
