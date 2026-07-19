import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cx } from "../../utils/cx";

export interface ProgressProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> {
  /** Current value (ignored when indeterminate). */
  value?: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** Unknown-progress mode with an animated dither fill. */
  indeterminate?: boolean;
  /** Control height. */
  size?: "sm" | "md" | "lg";
  /** Show a value label beside the bar (ignored when indeterminate). */
  showValue?: boolean;
  /** Formats the value label. Defaults to a rounded percentage. */
  formatValue?: (value: number, max: number) => string;
}

/** Two-color progress bar. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      value = 0,
      max = 100,
      indeterminate = false,
      size = "sm",
      showValue = false,
      formatValue = (v, m) => `${Math.round((v / m) * 100)}%`,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    // Clamp so a value outside [0, max] can never overflow the fill or report a
    // nonsensical aria-valuenow.
    const clamped = Math.max(0, Math.min(max, value));
    const pct = max === 0 ? 0 : (clamped / max) * 100;

    const bar = (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : clamped}
        className={cx(
          "du_progress",
          `du_progress_${size}`,
          indeterminate && "du_progress_indeterminate",
          className,
        )}
        style={style}
        {...rest}
      >
        <div
          className="du_progress_fill"
          style={
            indeterminate
              ? undefined
              : ({ inlineSize: `${pct}%` } as CSSProperties)
          }
        />
      </div>
    );

    if (!showValue || indeterminate) return bar;

    return (
      <div className="du_progress_root">
        {bar}
        <span className="du_progress_value" aria-hidden="true">
          {formatValue(clamped, max)}
        </span>
      </div>
    );
  },
);
