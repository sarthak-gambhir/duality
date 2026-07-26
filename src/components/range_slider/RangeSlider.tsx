import {
  forwardRef,
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

type Range = [number, number];

/** A tick mark on the track: a bare value, or a value with a visible caption. */
export type RangeSliderMark = number | { value: number; label?: ReactNode };

export interface RangeSliderProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onChange" | "defaultValue"
> {
  /** Current `[low, high]` values (controlled). */
  value?: Range;
  /** Initial `[low, high]` values (uncontrolled). */
  defaultValue?: Range;
  /** Called live with the new `[low, high]` values while dragging/keying. */
  onValueChange?: (value: Range) => void;
  /** Called once at the end of an interaction (pointer up / key press). */
  onValueCommit?: (value: Range) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Step applied by PageUp/PageDown. Defaults to `step * 10`. */
  largeStep?: number;
  /** Minimum number of steps that must remain between the two thumbs. */
  minStepsBetweenThumbs?: number;
  disabled?: boolean;
  invalid?: boolean;
  /** Accessible label for the lower thumb. */
  minLabel?: string;
  /** Accessible label for the upper thumb. */
  maxLabel?: string;
  /** Show a visible value label above each thumb. */
  showValues?: boolean;
  /** Show the min/max bounds as labels under the track ends. */
  showLimits?: boolean;
  /** Formats visible value/limit labels. Defaults to `String(value)`. */
  formatValue?: (value: number) => string;
  /** Produces `aria-valuetext` for each thumb. */
  getAriaValueText?: (value: number, thumb: "min" | "max") => string;
  /** Tick marks rendered along the track. */
  marks?: RangeSliderMark[];
  /**
   * When set, the `[low, high]` values are mirrored to two hidden inputs of this
   * name so the range participates in form submission (as an array).
   */
  name?: string;
}

function normalizeMarks(
  marks: RangeSliderMark[] | undefined,
): { value: number; label?: ReactNode }[] {
  if (!marks) return [];
  return marks.map((mark) =>
    typeof mark === "number" ? { value: mark } : mark,
  );
}

/**
 * Two-color dual-thumb range slider. Each thumb is a `role="slider"` control
 * with full keyboard support; a fill spans between them. Thumbs can't cross.
 */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  function RangeSlider(
    {
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  largeStep,
  minStepsBetweenThumbs = 0,
  disabled,
  invalid,
  minLabel = "Minimum",
  maxLabel = "Maximum",
  showValues,
  showLimits,
  formatValue = (v) => String(v),
  getAriaValueText,
  marks,
  name,
  className,
  ...rest
    },
    ref,
  ) {
  const [range, setRange] = useControllableState<Range>({
    value,
    defaultValue: defaultValue ?? [min, max],
    onChange: onValueChange,
  });
  const [low, high] = range;
  const span = max - min || 1;
  const bigStep = largeStep ?? step * 10;
  const gap = Math.max(0, minStepsBetweenThumbs) * step;
  // Clamp to [0, 100] so an out-of-range value can never render a thumb/fill
  // off the track (which would overflow the container).
  const pct = (v: number) =>
    Math.max(0, Math.min(100, ((v - min) / span) * 100));

  // When both thumbs overlap they stack, and the top one may be pinned against a
  // boundary (can't move), leaving its partner unreachable. Raise the thumb that
  // can still move: at the max end that's the low thumb, otherwise the high thumb.
  const frontThumb = low === high ? (high >= max ? 0 : 1) : null;

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);
  const latestRef = useRef<Range>(range);
  latestRef.current = range;

  const clampPair = (index: number, raw: number): Range => {
    const snapped = Math.round((raw - min) / step) * step + min;
    const bounded = Math.min(max, Math.max(min, snapped));
    return index === 0
      ? [Math.min(bounded, high - gap), high]
      : [low, Math.max(bounded, low + gap)];
  };

  const applyThumb = (index: number, raw: number): Range => {
    const pair = clampPair(index, raw);
    setRange(pair);
    latestRef.current = pair;
    return pair;
  };

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
        applyThumb(draggingRef.current, valueFromClientX(moveEvent.clientX));
      };
      const onUp = () => {
        draggingRef.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        onValueCommit?.(latestRef.current);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

  const onThumbKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const cur = index === 0 ? low : high;
      let next = cur;
      if (event.key === "ArrowRight" || event.key === "ArrowUp")
        next = cur + step;
      else if (event.key === "ArrowLeft" || event.key === "ArrowDown")
        next = cur - step;
      else if (event.key === "PageUp") next = cur + bigStep;
      else if (event.key === "PageDown") next = cur - bigStep;
      else if (event.key === "Home") next = min;
      else if (event.key === "End") next = max;
      else return;
      event.preventDefault();
      const pair = applyThumb(index, next);
      onValueCommit?.(pair);
    };

  const thumbs: Array<{
    index: number;
    value: number;
    label: string;
    which: "min" | "max";
    vmin: number;
    vmax: number;
  }> = [
    {
      index: 0,
      value: low,
      label: minLabel,
      which: "min",
      vmin: min,
      vmax: high,
    },
    {
      index: 1,
      value: high,
      label: maxLabel,
      which: "max",
      vmin: low,
      vmax: max,
    },
  ];

  const normalizedMarks = normalizeMarks(marks);

  return (
    <div
      ref={ref}
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
        {normalizedMarks.map((mark) => (
          <span
            key={`mark-${mark.value}`}
            className="du_range_slider_mark"
            data-active={
              (mark.value >= low && mark.value <= high) || undefined
            }
            style={{ left: `${pct(mark.value)}%` }}
            aria-hidden="true"
          />
        ))}
        {thumbs.map((thumb) => (
          <button
            key={thumb.index}
            type="button"
            role="slider"
            aria-label={thumb.label}
            aria-valuemin={thumb.vmin}
            aria-valuemax={thumb.vmax}
            aria-valuenow={thumb.value}
            aria-valuetext={getAriaValueText?.(thumb.value, thumb.which)}
            aria-orientation="horizontal"
            aria-invalid={invalid || undefined}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            className="du_range_slider_thumb"
            style={{
              left: `${pct(thumb.value)}%`,
              zIndex: thumb.index === frontThumb ? 2 : undefined,
            }}
            onPointerDown={onThumbPointerDown(thumb.index)}
            onKeyDown={onThumbKeyDown(thumb.index)}
          >
            {showValues && (
              <span className="du_range_slider_value" aria-hidden="true">
                {formatValue(thumb.value)}
              </span>
            )}
          </button>
        ))}
      </div>
      {normalizedMarks.some((mark) => mark.label != null) && (
        <div className="du_range_slider_mark_labels" aria-hidden="true">
          {normalizedMarks.map((mark) =>
            mark.label != null ? (
              <span
                key={`mark-label-${mark.value}`}
                className="du_range_slider_mark_label"
                style={{ left: `${pct(mark.value)}%` }}
              >
                {mark.label}
              </span>
            ) : null,
          )}
        </div>
      )}
      {showLimits && (
        <div className="du_range_slider_limits" aria-hidden="true">
          <span className="du_range_slider_limit">{formatValue(min)}</span>
          <span className="du_range_slider_limit">{formatValue(max)}</span>
        </div>
      )}
      {name && (
        <>
          <input type="hidden" name={name} value={low} />
          <input type="hidden" name={name} value={high} />
        </>
      )}
    </div>
  );
});
