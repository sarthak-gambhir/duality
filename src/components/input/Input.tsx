import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";

export interface InputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "prefix"
> {
  /** Marks the field invalid (border-style change + `aria-invalid`). */
  invalid?: boolean;
  /** Control size. */
  size?: "sm" | "md" | "lg";
  /** Content rendered before the field (icon, unit, etc.). */
  prefix?: ReactNode;
  /** Content rendered after the field. */
  suffix?: ReactNode;
  /** Show a clear button that empties the field when it has a value. */
  clearable?: boolean;
  /** Called after the field is cleared. */
  onClear?: () => void;
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
    value,
    defaultValue,
    onChange,
    "aria-invalid": ariaInvalid,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const [uncontrolledHasValue, setUncontrolledHasValue] = useState(
    () => defaultValue != null && String(defaultValue).length > 0,
  );
  const hasValue = isControlled
    ? String(value ?? "").length > 0
    : uncontrolledHasValue;

  const invalidAttr = ariaInvalid ?? (invalid || undefined);
  const grouped = prefix != null || suffix != null || clearable;

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
      <input
        ref={ref}
        aria-invalid={invalidAttr}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={cx(
          "du_input",
          `du_input_${size}`,
          invalid && "du_input_invalid",
          className,
        )}
        {...rest}
      />
    );
  }

  return (
    <span
      className={cx(
        "du_input_group",
        `du_input_group_${size}`,
        invalid && "du_input_group_invalid",
        disabled && "du_input_group_disabled",
        className,
      )}
    >
      {prefix != null && (
        <span className="du_input_affix du_input_prefix">{prefix}</span>
      )}
      <input
        ref={mergeRefs(ref, innerRef)}
        aria-invalid={invalidAttr}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className="du_input_field"
        {...rest}
      />
      {clearable && hasValue && !disabled && (
        <button
          type="button"
          className="du_input_clear"
          aria-label="Clear"
          onClick={handleClear}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
      {suffix != null && (
        <span className="du_input_affix du_input_suffix">{suffix}</span>
      )}
    </span>
  );
});
