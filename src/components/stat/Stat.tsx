import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import type { DualityIcons } from "../icon/icons";

export interface StatProps extends ComponentPropsWithoutRef<"div"> {
  /** Descriptive label above the value. */
  label: ReactNode;
  /** The primary metric. */
  value: ReactNode;
  /** Optional icon shown beside the label. */
  icon?: ReactNode;
  /** Optional change indicator shown below the value. */
  delta?: ReactNode;
  /** Direction of the delta; shown as an arrow shape (not color). */
  deltaDirection?: "up" | "down" | "neutral";
}

const DELTA_ICON: Record<"up" | "down" | "neutral", keyof DualityIcons> = {
  up: "deltaUp",
  down: "deltaDown",
  neutral: "deltaNeutral",
};

const DIRECTION_LABEL: Record<"up" | "down" | "neutral", string> = {
  up: "increase",
  down: "decrease",
  neutral: "no change",
};

/** Compact metric display: label, value, and an optional directional delta. */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, icon, delta, deltaDirection, className, ...rest },
  ref,
) {
  const icons = useIcons();
  return (
    <div ref={ref} className={cx("du_stat", className)} {...rest}>
      <div className="du_stat_label">
        {icon != null && (
          <span className="du_stat_icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {label}
      </div>
      <div className="du_stat_value">{value}</div>
      {delta != null && (
        <div className="du_stat_delta">
          {deltaDirection && (
            <Icon
              icon={icons[DELTA_ICON[deltaDirection]]}
              className="du_stat_delta_arrow"
              label={DIRECTION_LABEL[deltaDirection]}
            />
          )}
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
});

export type StatGroupProps = ComponentPropsWithoutRef<"div">;

/** Row of `Stat`s aligned and separated by dividers. */
export const StatGroup = forwardRef<HTMLDivElement, StatGroupProps>(
  function StatGroup({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        className={cx("du_stat_group", className)}
        {...rest}
      />
    );
  },
);
