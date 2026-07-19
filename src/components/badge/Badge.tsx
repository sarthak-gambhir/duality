import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  /** `solid` is filled, `outline` is bordered only. */
  variant?: "solid" | "outline";
  /** Control size. */
  size?: "sm" | "md" | "lg";
  /** Show a leading status dot (a two-color square). */
  dot?: boolean;
  /** Render a numeric count, overflowing to `max+`. Takes over the content. */
  count?: number;
  /** Overflow threshold for `count`. Defaults to `99`. */
  max?: number;
  /** Render the badge even when `count` is `0`. */
  showZero?: boolean;
  /** Show a remove control (chip/tag use) and call this when pressed. */
  onRemove?: () => void;
  /** Accessible label for the remove control. */
  removeLabel?: string;
}

/** Small inline chip / tag. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = "solid",
    size = "sm",
    dot,
    count,
    max = 99,
    showZero,
    onRemove,
    removeLabel = "Remove",
    className,
    children,
    ...rest
  },
  ref,
) {
  const hasCount = count != null;
  if (hasCount && count === 0 && !showZero) return null;

  const countLabel = hasCount
    ? count > max
      ? `${max}+`
      : String(count)
    : null;

  return (
    <span
      ref={ref}
      className={cx(
        "du_badge",
        `du_badge_${variant}`,
        `du_badge_${size}`,
        onRemove && "du_badge_removable",
        className,
      )}
      {...rest}
    >
      {dot && <span className="du_badge_dot" aria-hidden="true" />}
      {countLabel ?? children}
      {onRemove && (
        <button
          type="button"
          className="du_badge_remove"
          aria-label={removeLabel}
          onClick={onRemove}
        >
          &times;
        </button>
      )}
    </span>
  );
});
