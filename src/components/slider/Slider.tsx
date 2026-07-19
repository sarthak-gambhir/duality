import {
  forwardRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";

/** A tick mark on the track: a bare value, or a value with a visible caption. */
export type SliderMark = number | { value: number; label?: ReactNode };

export interface SliderProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type"
> {
  /** Marks the control invalid. */
  invalid?: boolean;
  /** Called with the new numeric value (alongside native `onChange`). */
  onValueChange?: (value: number) => void;
  /** Show a value bubble above the thumb. */
  showValue?: boolean;
  /** Formats the value bubble and limit labels. Defaults to `String(value)`. */
  formatValue?: (value: number) => string;
  /** Label shown under the start of the track. */
  minLabel?: ReactNode;
  /** Label shown under the end of the track. */
  maxLabel?: ReactNode;
  /** Tick marks rendered along the track. */
  marks?: SliderMark[];
}

// Thumb width (matches slider.scss). Used to nudge overlays so they line up with
// the thumb center, which a native range keeps inset by half a thumb at each end.
const THUMB = 14;

const toNum = (v: unknown, fallback: number): number => {
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
};

function normalizeMarks(
  marks: SliderMark[] | undefined,
): { value: number; label?: ReactNode }[] {
  if (!marks) return [];
  return marks.map((mark) =>
    typeof mark === "number" ? { value: mark } : mark,
  );
}

/** Two-color range slider built on a native `input[type=range]`. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    invalid,
    className,
    "aria-invalid": ariaInvalid,
    onValueChange,
    showValue,
    formatValue = (v) => String(v),
    minLabel,
    maxLabel,
    marks,
    value,
    defaultValue,
    onChange,
    min = 0,
    max = 100,
    ...rest
  },
  ref,
) {
  const minNum = toNum(min, 0);
  const maxNum = toNum(max, 100);
  // A native range with no value defaults to the midpoint; mirror that so the
  // value bubble and marks line up with the thumb before any interaction.
  const midpoint = minNum + (maxNum - minNum) / 2;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<number>(() =>
    toNum(value ?? defaultValue, midpoint),
  );
  const current = isControlled ? toNum(value, midpoint) : internal;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const num = Number(event.target.value);
    if (!isControlled) setInternal(num);
    onChange?.(event);
    onValueChange?.(num);
  };

  const input = (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={cx("du_slider", invalid && "du_slider_invalid", className)}
      onChange={handleChange}
      {...rest}
    />
  );

  const enhanced =
    showValue || marks != null || minLabel != null || maxLabel != null;
  if (!enhanced) return input;

  const span = maxNum - minNum || 1;
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - minNum) / span) * 100));
  // Left position that tracks the native thumb center. A range thumb's center
  // travels inset from each track end by half a thumb *plus* the track border
  // (box-sizing: border-box), so include both or marks drift toward the ends.
  const anchor = (v: number) => {
    const p = pct(v);
    return `calc(${p}% + ${(50 - p) / 50} * (${THUMB / 2}px + var(--border-width)))`;
  };

  const normalizedMarks = normalizeMarks(marks);
  const hasMarkLabels = normalizedMarks.some((mark) => mark.label != null);

  return (
    <div className="du_slider_root">
      <div className="du_slider_input_wrap">
        {input}
        {marks != null &&
          normalizedMarks.map((mark) => (
            <span
              key={`mark-${mark.value}`}
              className="du_slider_mark"
              data-active={mark.value <= current || undefined}
              style={{ left: anchor(mark.value) }}
              aria-hidden="true"
            />
          ))}
        {showValue && (
          <span
            className="du_slider_value"
            style={{ left: anchor(current) }}
            aria-hidden="true"
          >
            {formatValue(current)}
          </span>
        )}
      </div>
      {hasMarkLabels && (
        <div className="du_slider_mark_labels" aria-hidden="true">
          {normalizedMarks.map((mark) =>
            mark.label != null ? (
              <span
                key={`mark-label-${mark.value}`}
                className="du_slider_mark_label"
                style={{ left: anchor(mark.value) }}
              >
                {mark.label}
              </span>
            ) : null,
          )}
        </div>
      )}
      {(minLabel != null || maxLabel != null) && (
        <div className="du_slider_limits" aria-hidden="true">
          <span className="du_slider_limit">{minLabel}</span>
          <span className="du_slider_limit">{maxLabel}</span>
        </div>
      )}
    </div>
  );
});
