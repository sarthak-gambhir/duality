import {
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import type { ControlSize } from "../../tokens/scale";

export interface RatingProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onChange" | "defaultValue"
> {
  /** Current rating 0..max (controlled). */
  value?: number;
  /** Initial rating (uncontrolled). */
  defaultValue?: number;
  /** Called with the new rating. */
  onValueChange?: (value: number) => void;
  /** Number of blocks. */
  max?: number;
  /** Allow half-block (0.5) increments. */
  allowHalf?: boolean;
  /** Clicking the current value (or Home) resets to 0. */
  allowClear?: boolean;
  /** Renders as a non-interactive display. */
  readOnly?: boolean;
  /** Disables interaction and dithers the control. */
  disabled?: boolean;
  /** Control size. */
  size?: ControlSize;
  /** Name of a hidden input so the value participates in form submission. */
  name?: string;
  /** Accessible group label. */
  label?: ReactNode;
}

/**
 * Pixel-block rating. Fill (never color) conveys the value: filled blocks are
 * `--fg`, empty blocks are outlined, half blocks are split. Hover/focus previews.
 */
export function Rating({
  value,
  defaultValue,
  onValueChange,
  max = 5,
  allowHalf,
  allowClear,
  readOnly,
  disabled,
  size = "md",
  name,
  label,
  className,
  ...rest
}: RatingProps) {
  const [current, setCurrent] = useControllableState<number>({
    value,
    defaultValue: defaultValue ?? 0,
    onChange: onValueChange,
  });
  const [hover, setHover] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const icons = useIcons();

  const interactive = !readOnly && !disabled;
  const display = hover ?? current;
  const step = allowHalf ? 0.5 : 1;

  const valueFromPointer = (n: number, event: ReactMouseEvent): number => {
    if (!allowHalf) return n;
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientX - rect.left < rect.width / 2 ? n - 0.5 : n;
  };

  const commit = (next: number) => {
    if (!interactive) return;
    setCurrent(allowClear && next === current ? 0 : next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowUp")
      next = Math.min(max, current + step);
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      next = Math.max(0, current - step);
    else if (event.key === "Home") next = allowClear ? 0 : 1;
    else if (event.key === "End") next = max;
    else return;

    event.preventDefault();
    setCurrent(next);
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ??
        [],
    );
    const focusIndex = Math.max(0, Math.ceil(next) - 1);
    (items[focusIndex] ?? items[0])?.focus();
  };

  const blocks = Array.from({ length: max }, (_, i) => i + 1);
  const tabValue = current === 0 ? 1 : Math.ceil(current);
  const showLock = readOnly && !disabled;

  const stars = blocks.map((n) => {
    const filled = n <= display;
    const half = allowHalf && !filled && display >= n - 0.5 && display < n;
    return (
      <button
        key={n}
        type="button"
        role="radio"
        aria-checked={n === current}
        aria-label={`${n} of ${max}`}
        tabIndex={n === tabValue ? 0 : -1}
        disabled={!interactive}
        data-filled={filled || undefined}
        data-half={half || undefined}
        className="du_rating_item"
        onClick={(event) => commit(valueFromPointer(n, event))}
        onMouseMove={(event) =>
          interactive && setHover(valueFromPointer(n, event))
        }
      >
        {filled ? (
          <Icon icon={icons.starFilled} className="du_rating_star" />
        ) : half ? (
          <Icon icon={icons.starHalf} className="du_rating_star" />
        ) : (
          <Icon icon={icons.star} className="du_rating_star" />
        )}
      </button>
    );
  });

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={typeof label === "string" ? label : undefined}
      className={cx(
        "du_rating",
        `du_rating_${size}`,
        disabled && "du_rating_disabled",
        readOnly && !disabled && "du_rating_readonly",
        className,
      )}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(null)}
      {...rest}
    >
      {showLock ? (
        <>
          <span className="du_rating_lockbox" aria-hidden="true">
            <Icon icon={icons.lock} className="du_rating_lock" />
          </span>
          <div className="du_rating_track">{stars}</div>
        </>
      ) : (
        stars
      )}
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  );
}
