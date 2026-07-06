import { type ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface EmptyStateProps {
  /** Primary heading. */
  title: ReactNode;
  /** Supporting explanation. */
  description?: ReactNode;
  /** Optional visual/marker above the title. */
  icon?: ReactNode;
  /** Action slot (e.g. a Button) shown below the text. */
  action?: ReactNode;
  className?: string;
}

/** Centered placeholder for empty lists, searches, or first-run screens. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx("du_empty_state", className)}>
      {icon != null ? (
        <div className="du_empty_state_icon" aria-hidden="true">
          {icon}
        </div>
      ) : (
        <div className="du_empty_state_marker" aria-hidden="true" />
      )}
      <div className="du_empty_state_title">{title}</div>
      {description != null && (
        <div className="du_empty_state_description">{description}</div>
      )}
      {action != null && <div className="du_empty_state_action">{action}</div>}
    </div>
  );
}
