import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";
import { useFormField } from "../form_field/FormFieldContext";
import { DisabledMessage } from "../form_field/disabledMessage";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import type { ControlSize } from "../../tokens/scale";

export interface InputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "prefix"
> {
  /** Marks the field invalid (border-style change + `aria-invalid`). */
  invalid?: boolean;
  /** Control size. */
  size?: ControlSize;
  /** Content rendered before the field (icon, unit, etc.). */
  prefix?: ReactNode;
  /** Content rendered after the field. */
  suffix?: ReactNode;
  /** Show a clear button that empties the field when it has a value. */
  clearable?: boolean;
  /** Called after the field is cleared. */
  onClear?: () => void;
  /** When disabled, reason shown in a persistent caption below the field. */
  disabledReason?: ReactNode;
}

const nativeValueSetter = () =>
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;

/** Single-line text field. Invalid state shows a dashed border, not color. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    invalid,
    size = "md",
    className,
    prefix,
    suffix,
    clearable,
    onClear,
    disabled,
    disabledReason,
    value,
    defaultValue,
    onChange,
    id,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedby,
    "aria-required": ariaRequired,
    "aria-errormessage": ariaErrorMessage,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const field = useFormField();
  const icons = useIcons();
  const disabledMsgId = useId();
  const isControlled = value !== undefined;
  const [uncontrolledHasValue, setUncontrolledHasValue] = useState(
    () => defaultValue != null && String(defaultValue).length > 0,
  );
  const hasValue = isControlled
    ? String(value ?? "").length > 0
    : uncontrolledHasValue;

  // Explicit props always win; the FormField context is a fallback.
  const resolvedId = id ?? field?.id;
  const showInvalid = invalid || field?.invalid || undefined;
  const invalidAttr = ariaInvalid ?? (showInvalid ? true : undefined);
  const requiredAttr = ariaRequired ?? (field?.required || undefined);
  const errorMessageAttr =
    ariaErrorMessage ?? (field?.invalid ? field?.errorId : undefined);
  const isDisabled = disabled ?? field?.disabled;
  const grouped = prefix != null || suffix != null || clearable;

  const resolvedReason = disabledReason ?? field?.disabledReason;
  const showDisabledReason = !!isDisabled && resolvedReason != null;
  const describedBy =
    cx(ariaDescribedby ?? field?.describedBy, showDisabledReason && disabledMsgId) ||
    undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledHasValue(event.target.value.length > 0);
    onChange?.(event);
  };

  const handleClear = () => {
    const el = innerRef.current;
    if (el) {
      nativeValueSetter()?.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.focus();
    }
    if (!isControlled) setUncontrolledHasValue(false);
    onClear?.();
  };

  if (!grouped) {
    return (
      <DisabledMessage
        active={showDisabledReason}
        id={disabledMsgId}
        reason={resolvedReason}
      >
        <input
          ref={mergeRefs(ref, innerRef)}
          id={resolvedId}
          aria-invalid={invalidAttr}
          aria-describedby={describedBy}
          aria-required={requiredAttr}
          aria-errormessage={errorMessageAttr}
          disabled={isDisabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cx(
            "du_input",
            `du_input_${size}`,
            showInvalid && "du_input_invalid",
            className,
          )}
          {...rest}
        />
      </DisabledMessage>
    );
  }

  return (
    <DisabledMessage
      active={showDisabledReason}
      id={disabledMsgId}
      reason={resolvedReason}
    >
      <span
      className={cx(
        "du_input_group",
        `du_input_group_${size}`,
        showInvalid && "du_input_group_invalid",
        isDisabled && "du_input_group_disabled",
        className,
      )}
    >
      {prefix != null && (
        <span className="du_input_affix du_input_prefix">{prefix}</span>
      )}
      <input
        ref={mergeRefs(ref, innerRef)}
        id={resolvedId}
        aria-invalid={invalidAttr}
        aria-describedby={describedBy}
        aria-required={requiredAttr}
        aria-errormessage={errorMessageAttr}
        disabled={isDisabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className="du_input_field"
        {...rest}
      />
      {clearable && hasValue && !isDisabled && (
        <button
          type="button"
          className="du_input_clear"
          aria-label="Clear"
          onClick={handleClear}
        >
          <Icon icon={icons.close} />
        </button>
      )}
      {suffix != null && (
        <span className="du_input_affix du_input_suffix">{suffix}</span>
      )}
      </span>
    </DisabledMessage>
  );
});
