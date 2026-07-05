import {
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

type Range = [number, number];

export interface RangeSliderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue"> {
  /** Current `[low, high]` values (controlled). */
  value?: Range;
  /** Initial `[low, high]` values (uncontrolled). */
  defaultValue?: Range;
  /** Called with the new `[low, high]` values. */
  onValueChange?: (value: Range) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  invalid?: boolean;
  /** Accessible label for the lower thumb. */
  minLabel?: string;
  /** Accessible label for the upper thumb. */
  maxLabel?: string;
}

/**
 * Two-color dual-thumb range slider. Each thumb is a `role="slider"` control
 * with full keyboard support; a fill spans between them. Thumbs can't cross.
 */
export function RangeSlider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  invalid,
  minLabel = "Minimum",
  maxLabel = "Maximum",
  className,
  ...rest
}: RangeSliderProps) {
  const [range, setRange] = useControllableState<Range>({
    value,
    defaultValue: defaultValue ?? [min, max],
    onChange: onValueChange,
  });
  const [low, high] = range;
  const span = max - min || 1;
  const pct = (v: number) => ((v - min) / span) * 100;

  // When both thumbs overlap they stack, and the top one may be pinned against a
  // boundary (can't move), leaving its partner unreachable. Raise the thumb that
  // can still move: at the max end that's the low thumb, otherwise the high thumb.
  const frontThumb = low === high ? (high >= max ? 0 : 1) : null;

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);

  const clampPair = (index: number, raw: number): Range => {
    const snapped = Math.round((raw - min) / step) * step + min;
    const bounded = Math.min(max, Math.max(min, snapped));
    return index === 0 ? [Math.min(bounded, high), high] : [low, Math.max(bounded, low)];
  };

  const setThumb = (index: number, raw: number) => setRange(clampPair(index, raw));

  const valueFromClientX = (clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return min;
    const ratio = (clientX - rect.left) / rect.width;
    return min + ratio * span;
  };

  const onThumbPointerDown =
    (index: number) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      event.preventDefault();
      (event.currentTarget as HTMLButtonElement).focus();
      draggingRef.current = index;

      const onMove = (moveEvent: PointerEvent) => {
        if (draggingRef.current === null) return;
        setThumb(draggingRef.current, valueFromClientX(moveEvent.clientX));
      };
      const onUp = () => {
        draggingRef.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

  const onThumbKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const cur = index === 0 ? low : high;
      let next = cur;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") next = cur + step;
      else if (event.key === "ArrowLeft" || event.key === "ArrowDown")
        next = cur - step;
      else if (event.key === "Home") next = min;
      else if (event.key === "End") next = max;
      else return;
      event.preventDefault();
      setThumb(index, next);
    };

  const thumbs: Array<{ index: number; value: number; label: string; vmin: number; vmax: number }> = [
    { index: 0, value: low, label: minLabel, vmin: min, vmax: high },
    { index: 1, value: high, label: maxLabel, vmin: low, vmax: max },
  ];

  return (
    <div
      className={cx(
        "du_range_slider",
        disabled && "du_range_slider_disabled",
        invalid && "du_range_slider_invalid",
        className,
      )}
      {...rest}
    >
      <div ref={trackRef} className="du_range_slider_track">
        <div
          className="du_range_slider_fill"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
        />
        {thumbs.map((thumb) => (
          <button
            key={thumb.index}
            type="button"
            role="slider"
            aria-label={thumb.label}
            aria-valuemin={thumb.vmin}
            aria-valuemax={thumb.vmax}
            aria-valuenow={thumb.value}
            aria-orientation="horizontal"
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            className="du_range_slider_thumb"
            style={{
              left: `${pct(thumb.value)}%`,
              zIndex: thumb.index === frontThumb ? 2 : undefined,
            }}
            onPointerDown={onThumbPointerDown(thumb.index)}
            onKeyDown={onThumbKeyDown(thumb.index)}
          />
        ))}
      </div>
    </div>
  );
}
