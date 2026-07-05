import {
  forwardRef,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

export interface NumberInputProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "value" | "defaultValue" | "onChange" | "size" | "min" | "max" | "step"
  > {
  /** Current value (controlled). */
  value?: number;
  /** Initial value (uncontrolled). */
  defaultValue?: number;
  /** Called with the new numeric value (or `undefined` when cleared). */
  onValueChange?: (value: number | undefined) => void;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Step applied by the buttons and arrow keys. */
  step?: number;
  /** Decimal places to round to when committing. */
  precision?: number;
  /** Marks the field invalid (dashed border + `aria-invalid`). */
  invalid?: boolean;
  /** Control size. */
  size?: "sm" | "md" | "lg";
  /** Name of a hidden input so the value participates in form submission. */
  name?: string;
}

/**
 * Stepper number field: `-` / `+` buttons flank a `role="spinbutton"` input.
 * Values clamp to `min`/`max` on commit; arrow keys and Home/End also step.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      precision,
      invalid,
      size = "md",
      name,
      id,
      disabled,
      className,
      "aria-invalid": ariaInvalid,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      ...rest
    },
    ref,
  ) {
    const [current, setCurrent] = useControllableState<number | undefined>({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    const clamp = (n: number): number => {
      let result = n;
      if (min !== undefined) result = Math.max(min, result);
      if (max !== undefined) result = Math.min(max, result);
      if (precision !== undefined) result = Number(result.toFixed(precision));
      return result;
    };

    const stepBy = (direction: 1 | -1) => {
      const base = current ?? min ?? 0;
      setCurrent(clamp(base + direction * step));
    };

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value.trim();
      if (raw === "") {
        setCurrent(undefined);
        return;
      }
      const parsed = Number(raw);
      // Don't clamp mid-typing; clamp on blur so partial input stays editable.
      if (!Number.isNaN(parsed)) setCurrent(parsed);
    };

    const onBlur = () => {
      if (current !== undefined) setCurrent(clamp(current));
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        stepBy(1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        stepBy(-1);
      } else if (event.key === "Home" && min !== undefined) {
        event.preventDefault();
        setCurrent(clamp(min));
      } else if (event.key === "End" && max !== undefined) {
        event.preventDefault();
        setCurrent(clamp(max));
      }
    };

    const atMin = min !== undefined && current !== undefined && current <= min;
    const atMax = max !== undefined && current !== undefined && current >= max;

    return (
      <div
        className={cx(
          "du_number_input",
          `du_number_input_${size}`,
          invalid && "du_number_input_invalid",
          className,
        )}
      >
        <button
          type="button"
          className="du_number_input_step"
          tabIndex={-1}
          aria-label="Decrease"
          disabled={disabled || atMin}
          onClick={() => stepBy(-1)}
        >
          <span aria-hidden="true">&minus;</span>
        </button>
        <input
          ref={ref}
          {...rest}
          id={id}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={current}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={ariaInvalid ?? (invalid || undefined)}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          disabled={disabled}
          value={current ?? ""}
          className="du_number_input_field"
          onChange={onInputChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="du_number_input_step"
          tabIndex={-1}
          aria-label="Increase"
          disabled={disabled || atMax}
          onClick={() => stepBy(1)}
        >
          <span aria-hidden="true">+</span>
        </button>
        {name && <input type="hidden" name={name} value={current ?? ""} />}
      </div>
    );
  },
);
