import {
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

export interface RatingProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue"> {
  /** Current rating 0..max (controlled). */
  value?: number;
  /** Initial rating (uncontrolled). */
  defaultValue?: number;
  /** Called with the new rating. */
  onValueChange?: (value: number) => void;
  /** Number of blocks. */
  max?: number;
  /** Renders as a non-interactive display. */
  readOnly?: boolean;
  /** Control size. */
  size?: "sm" | "md" | "lg";
  /** Name of a hidden input so the value participates in form submission. */
  name?: string;
  /** Accessible group label. */
  label?: ReactNode;
}

/**
 * Pixel-block rating. Fill (never color) conveys the value: filled blocks are
 * `--fg`, empty blocks are outlined. Hover/focus previews up to that block.
 */
export function Rating({
  value,
  defaultValue,
  onValueChange,
  max = 5,
  readOnly,
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

  const display = hover ?? current;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;
    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowUp")
      next = Math.min(max, current + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      next = Math.max(0, current - 1);
    else if (event.key === "Home") next = 1;
    else if (event.key === "End") next = max;
    else return;

    event.preventDefault();
    setCurrent(next);
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ??
        [],
    );
    (items[next - 1] ?? items[0])?.focus();
  };

  const blocks = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={typeof label === "string" ? label : undefined}
      className={cx("du_rating", `du_rating_${size}`, className)}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(null)}
      {...rest}
    >
      {blocks.map((n) => {
        const filled = n <= display;
        const isTabStop = current === 0 ? n === 1 : n === current;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === current}
            aria-label={`${n} of ${max}`}
            tabIndex={isTabStop ? 0 : -1}
            disabled={readOnly}
            data-filled={filled || undefined}
            className="du_rating_item"
            onClick={() => setCurrent(n)}
            onMouseEnter={() => !readOnly && setHover(n)}
          />
        );
      })}
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  );
}
