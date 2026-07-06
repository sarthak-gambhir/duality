import { type ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface BannerProps {
  /** Severity. Signalled by marker shape + border style, never by color. */
  tone?: "info" | "warning" | "error";
  /** Optional bold heading. */
  title?: ReactNode;
  /** Banner message. */
  children?: ReactNode;
  /** Action slot (e.g. a Button) shown at the trailing edge. */
  action?: ReactNode;
  /** Show a close button and call this when pressed. */
  onDismiss?: () => void;
  /** Accessible label for the close button. */
  dismissLabel?: string;
  className?: string;
}

/** Full-width, page-level callout. Optionally dismissible with an action slot. */
export function Banner({
  tone = "info",
  title,
  children,
  action,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
}: BannerProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx("du_banner", `du_banner_${tone}`, className)}
    >
      <span className="du_banner_marker" aria-hidden="true" />
      <div className="du_banner_content">
        {title != null && <span className="du_banner_title">{title}</span>}
        {children != null && <span className="du_banner_body">{children}</span>}
      </div>
      {action != null && <div className="du_banner_action">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          className="du_banner_close"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          &times;
        </button>
      )}
    </div>
  );
}
