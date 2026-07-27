import {
  forwardRef,
  useId,
  useRef,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { useFormField } from "../form_field/FormFieldContext";
import { DisabledMessage } from "../form_field/DisabledMessage";

export interface PinInputProps {
  /** Number of cells. Defaults to 4. */
  length?: number;
  /** Assembled value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Called with the assembled string on every change. */
  onValueChange?: (value: string) => void;
  /** Called once every cell is filled. */
  onComplete?: (value: string) => void;
  /** Allowed characters. Defaults to `numeric`. */
  type?: "numeric" | "alphanumeric";
  /** Obscure entered characters. */
  mask?: boolean;
  disabled?: boolean;
  /** When disabled, reason shown in a persistent caption below the field. */
  disabledReason?: ReactNode;
  /** When set, the assembled value is mirrored to a hidden input of this name. */
  name?: string;
  /** Called when focus leaves the group (for form-library integration). */
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  id?: string;
  /** Base accessible name; each cell is labelled "<label>, digit N of M". */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  "aria-errormessage"?: string;
  className?: string;
}

function sanitize(raw: string, type: "numeric" | "alphanumeric"): string {
  const pattern = type === "numeric" ? /[^0-9]/g : /[^a-zA-Z0-9]/g;
  return raw.replace(pattern, "");
}

/** Segmented one-time-code entry with auto-advance, Backspace, and paste. */
export const PinInput = forwardRef<HTMLInputElement, PinInputProps>(
  function PinInput(
    {
      length = 4,
      value,
      defaultValue,
      onValueChange,
      onComplete,
      type = "numeric",
      mask,
      disabled,
      disabledReason,
      name,
      onBlur,
      id,
      "aria-label": ariaLabel = "Verification code",
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-errormessage": ariaErrorMessage,
      className,
    },
    forwardedRef,
  ) {
  const [current, setCurrent] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? "",
    onChange: onValueChange,
  });
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const field = useFormField();
  const disabledMsgId = useId();

  // Explicit props always win; the FormField context is a fallback.
  const resolvedId = id ?? field?.id;
  const showInvalid = field?.invalid || undefined;
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

  const chars = (current ?? "").slice(0, length).split("");
  const cellValue = (index: number) => chars[index] ?? "";

  const focusCell = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    refs.current[clamped]?.focus();
    refs.current[clamped]?.select();
  };

  const commit = (next: string) => {
    const value = next.slice(0, length);
    setCurrent(value);
    if (value.length === length) onComplete?.(value);
  };

  const setCharAt = (index: number, char: string) => {
    const arr = (current ?? "").slice(0, length).split("");
    while (arr.length < index) arr.push("");
    arr[index] = char;
    return arr.join("").slice(0, length);
  };

  const onChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const raw = sanitize(event.target.value, type);
    if (raw === "") {
      commit(setCharAt(index, ""));
      return;
    }
    // Use the last typed character so retyping over a filled cell works.
    const char = raw.slice(-1);
    commit(setCharAt(index, char));
    if (index < length - 1) focusCell(index + 1);
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Backspace":
        if (cellValue(index) === "" && index > 0) {
          event.preventDefault();
          commit(setCharAt(index - 1, ""));
          focusCell(index - 1);
        } else {
          commit(setCharAt(index, ""));
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusCell(index - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        focusCell(index + 1);
        break;
      default:
        break;
    }
  };

  const onPaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = sanitize(event.clipboardData.getData("text"), type);
    if (pasted === "") return;
    const arr = (current ?? "").slice(0, length).split("");
    while (arr.length < length) arr.push("");
    for (let i = 0; i < pasted.length && index + i < length; i += 1) {
      arr[index + i] = pasted[i]!;
    }
    const next = arr.join("").slice(0, length);
    commit(next);
    focusCell(Math.min(index + pasted.length, length - 1));
  };

  const onGroupBlur = (event: FocusEvent<HTMLDivElement>) => {
    // Only fire when focus leaves the whole group, not when moving between cells.
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onBlur?.(event);
    }
  };

  return (
    <DisabledMessage
      active={showDisabledReason}
      id={disabledMsgId}
      reason={resolvedReason}
    >
    <div
      role="group"
      id={resolvedId}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={describedBy}
      aria-invalid={invalidAttr}
      aria-required={requiredAttr}
      aria-errormessage={errorMessageAttr}
      className={cx("du_pin_input", className)}
      onBlur={onGroupBlur}
    >
      {name && <input type="hidden" name={name} value={current ?? ""} />}
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
            if (index === 0) {
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }
          }}
          type={mask ? "password" : "text"}
          inputMode={type === "numeric" ? "numeric" : "text"}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={isDisabled}
          aria-label={`${ariaLabel}, character ${index + 1} of ${length}`}
          className="du_pin_input_cell"
          value={cellValue(index)}
          onChange={(event) => onChange(index, event)}
          onKeyDown={(event) => onKeyDown(index, event)}
          onPaste={(event) => onPaste(index, event)}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
    </DisabledMessage>
  );
});
