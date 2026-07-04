import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from 'react';
import { cx } from '../../utils/cx';

export interface ProgressProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Current value (ignored when indeterminate). */
  value?: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** Unknown-progress mode with an animated dither fill. */
  indeterminate?: boolean;
}

/** Two-color progress bar. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, max = 100, indeterminate = false, className, style, ...rest },
  ref,
) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      className={cx('du_progress', indeterminate && 'du_progress_indeterminate', className)}
      style={style}
      {...rest}
    >
      <div
        className="du_progress_fill"
        style={indeterminate ? undefined : ({ inlineSize: `${pct}%` } as CSSProperties)}
      />
    </div>
  );
});
