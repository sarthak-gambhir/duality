import { type ReactNode } from "react";
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
  /** Visual state; filled marker for complete/current. */
  status?: "complete" | "current" | "upcoming";
}

export interface TimelineProps {
  /** Events in display order. */
  items: TimelineItem[];
  className?: string;
}

/** Vertical event list with pixel markers and connectors. */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cx("du_timeline", className)}>
      {items.map((item, index) => (
        <li
          key={item.id}
          className="du_timeline_item"
          data-status={item.status ?? "complete"}
        >
          <div className="du_timeline_rail" aria-hidden="true">
            <span className="du_timeline_marker" />
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
              <div className="du_timeline_description">{item.description}</div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
