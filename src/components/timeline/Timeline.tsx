import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";

export interface TimelineItem {
  /** Stable identity. */
  id: string;
  /** Event heading. */
  title: ReactNode;
  /** Optional timestamp / meta line. */
  time?: ReactNode;
  /** Optional supporting text. */
  description?: ReactNode;
  /** Visual state; filled marker for complete/current, shaped for error/warning. */
  status?: "complete" | "current" | "upcoming" | "error" | "warning";
  /** Custom marker content (overrides the default status marker). */
  icon?: ReactNode;
}

export interface TimelineProps extends ComponentPropsWithoutRef<"ol"> {
  /** Events in display order. */
  items: TimelineItem[];
}

/** Vertical event list with pixel markers and connectors. */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  function Timeline({ items, className, ...rest }, ref) {
    return (
      <ol ref={ref} className={cx("du_timeline", className)} {...rest}>
        {items.map((item, index) => (
          <li
            key={item.id}
            className="du_timeline_item"
            data-status={item.status ?? "complete"}
          >
            <div className="du_timeline_rail" aria-hidden="true">
              {item.icon != null ? (
                <span className="du_timeline_marker du_timeline_marker_icon">
                  {item.icon}
                </span>
              ) : (
                <span className="du_timeline_marker" />
              )}
              {index < items.length - 1 && (
                <span className="du_timeline_connector" />
              )}
            </div>
            <div className="du_timeline_content">
              <div className="du_timeline_header">
                <span className="du_timeline_title">{item.title}</span>
                {item.time != null && (
                  <span className="du_timeline_time">{item.time}</span>
                )}
              </div>
              {item.description != null && (
                <div className="du_timeline_description">
                  {item.description}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    );
  },
);
