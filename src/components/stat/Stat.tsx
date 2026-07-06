import { type ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface StatProps {
  /** Descriptive label above the value. */
  label: ReactNode;
  /** The primary metric. */
  value: ReactNode;
  /** Optional change indicator shown below the value. */
  delta?: ReactNode;
  /** Direction of the delta; shown as an arrow shape (not color). */
  deltaDirection?: "up" | "down" | "neutral";
  className?: string;
}

const ARROW: Record<"up" | "down" | "neutral", string> = {
  up: "\u25B2",
  down: "\u25BC",
  neutral: "\u25AC",
};

const DIRECTION_LABEL: Record<"up" | "down" | "neutral", string> = {
  up: "increase",
  down: "decrease",
  neutral: "no change",
};

/** Compact metric display: label, value, and an optional directional delta. */
export function Stat({
  label,
  value,
  delta,
  deltaDirection,
  className,
}: StatProps) {
  return (
    <div className={cx("du_stat", className)}>
      <div className="du_stat_label">{label}</div>
      <div className="du_stat_value">{value}</div>
      {delta != null && (
        <div className="du_stat_delta">
          {deltaDirection && (
            <span
              className="du_stat_delta_arrow"
              aria-label={DIRECTION_LABEL[deltaDirection]}
              role="img"
            >
              {ARROW[deltaDirection]}
            </span>
          )}
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
}
