import {
  forwardRef,
  useId,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { useFormField } from "../form_field/FormFieldContext";
import { DisabledMessage } from "../form_field/DisabledMessage";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import type { ControlSize } from "../../tokens/scale";

export interface NumberInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  | "value"
  | "defaultValue"
  | "onChange"
  | "size"
  | "min"
  | "max"
  | "step"
  | "prefix"
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
  /** Step applied by PageUp/PageDown. Defaults to `step * 10`. */
  largeStep?: number;
  /** Decimal places to round to when committing. */
  precision?: number;
  /** Marks the field invalid (dashed border + `aria-invalid`). */
  invalid?: boolean;
  /** Control size. */
  size?: ControlSize;
  /** Hide the increment/decrement buttons. */
  hideSteppers?: boolean;
  /** Content rendered before the field (e.g. a currency symbol). */
  prefix?: ReactNode;
  /** Content rendered after the field (e.g. a unit). */
  suffix?: ReactNode;
  /** Name of a hidden input so the value participates in form submission. */
  name?: string;
  /** When disabled, reason shown in a persistent caption below the field. */
  disabledReason?: ReactNode;
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
      largeStep,
      precision,
      invalid,
      size = "md",
      hideSteppers,
      prefix,
      suffix,
      name,
      id,
      disabled,
      disabledReason,
      className,
      "aria-invalid": ariaInvalid,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      "aria-required": ariaRequired,
      "aria-errormessage": ariaErrorMessage,
      ...rest
    },
    ref,
  ) {
    const [current, setCurrent] = useControllableState<number | undefined>({
      value,
      defaultValue,
      onChange: onValueChange,
    });
    const icons = useIcons();
    const field = useFormField();
    const disabledMsgId = useId();

    // Explicit props always win; the FormField context is a fallback.
    const resolvedId = id ?? field?.id;
    const showInvalid = invalid || field?.invalid || undefined;
    const invalidAttr = ariaInvalid ?? (showInvalid ? true : undefined);
    const requiredAttr = ariaRequired ?? (field?.required || undefined);
    const errorMessageAttr =
      ariaErrorMessage ?? (field?.invalid ? field?.errorId : undefined);
    const isDisabled = disabled ?? field?.disabled;
    const resolvedReason = disabledReason ?? field?.disabledReason;
    const showDisabledReason = !!isDisabled && resolvedReason != null;
    const describedBy =
      cx(
        ariaDescribedby ?? field?.describedBy,
        showDisabledReason && disabledMsgId,
      ) || undefined;

    const clamp = (n: number): number => {
      let result = n;
      if (min !== undefined) result = Math.max(min, result);
      if (max !== undefined) result = Math.min(max, result);
      if (precision !== undefined) result = Number(result.toFixed(precision));
      return result;
    };

    const bigStep = largeStep ?? step * 10;

    const stepBy = (direction: 1 | -1, amount: number = step) => {
      const base = current ?? min ?? 0;
      setCurrent(clamp(base + direction * amount));
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
      if (isDisabled) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        stepBy(1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        stepBy(-1);
      } else if (event.key === "PageUp") {
        event.preventDefault();
        stepBy(1, bigStep);
      } else if (event.key === "PageDown") {
        event.preventDefault();
        stepBy(-1, bigStep);
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
      <DisabledMessage
        active={showDisabledReason}
        id={disabledMsgId}
        reason={resolvedReason}
      >
      <div
        className={cx(
          "du_number_input",
          `du_number_input_${size}`,
          showInvalid && "du_number_input_invalid",
          isDisabled && "du_number_input_disabled",
          className,
        )}
      >
        {!hideSteppers && (
          <button
            type="button"
            className="du_number_input_step"
            tabIndex={-1}
            aria-label="Decrease"
            disabled={isDisabled || atMin}
            onClick={() => stepBy(-1)}
          >
            <Icon icon={icons.dash} />
          </button>
        )}
        {prefix != null && (
          <span className="du_number_input_affix du_number_input_prefix">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          {...rest}
          id={resolvedId}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={current}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={invalidAttr}
          aria-required={requiredAttr}
          aria-errormessage={errorMessageAttr}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={describedBy}
          disabled={isDisabled}
          value={current ?? ""}
          className="du_number_input_field"
          onChange={onInputChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        {suffix != null && (
          <span className="du_number_input_affix du_number_input_suffix">
            {suffix}
          </span>
        )}
        {!hideSteppers && (
          <button
            type="button"
            className="du_number_input_step"
            tabIndex={-1}
            aria-label="Increase"
            disabled={isDisabled || atMax}
            onClick={() => stepBy(1)}
          >
            <Icon icon={icons.add} />
          </button>
        )}
        {name && <input type="hidden" name={name} value={current ?? ""} />}
      </div>
      </DisabledMessage>
    );
  },
);
