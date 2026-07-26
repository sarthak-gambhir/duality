import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";
import { useControllableState } from "../../utils/useControllableState";
import { useDismiss } from "../../utils/useDismiss";
import { useFormField } from "../form_field/FormFieldContext";
import { DisabledMessage } from "../form_field/disabledMessage";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import type { SelectOption } from "../select/Select";
import type { ControlSize } from "../../tokens/scale";

export interface ComboboxProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "defaultValue" | "onChange" | "size"
> {
  /** Options to filter and choose from. */
  options: SelectOption[];
  /** Selected value (controlled). */
  value?: string;
  /** Initial selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Text in the input (controlled). */
  inputValue?: string;
  /** Called when the input text changes. */
  onInputValueChange?: (value: string) => void;
  /** Custom filter predicate. Defaults to case-insensitive substring match. */
  filter?: (option: SelectOption, query: string) => boolean;
  /** Placeholder shown when the input is empty. */
  placeholder?: string;
  /** Marks the field invalid (dashed border + `aria-invalid`). */
  invalid?: boolean;
  /** Control size. */
  size?: ControlSize;
  /** When disabled, reason shown in a persistent caption below the field. */
  disabledReason?: ReactNode;
  /** Name of a hidden input so the value participates in form submission. */
  name?: string;
  /** Whether the listbox is open (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
}

function labelText(option: SelectOption): string {
  return typeof option.label === "string" ? option.label : String(option.value);
}

function nextEnabledIndex(
  items: SelectOption[],
  from: number,
  step: 1 | -1,
): number {
  const count = items.length;
  if (count === 0) return -1;
  let index = from;
  for (let i = 0; i < count; i += 1) {
    index = (index + step + count) % count;
    if (!items[index]?.disabled) return index;
  }
  return from;
}

/**
 * Editable ARIA combobox over a filtered listbox. Follows the two-color model
 * and reuses the Select listbox styling; a hidden input mirrors the value.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  function Combobox(
    {
      options,
      value,
      defaultValue,
      onValueChange,
      inputValue: inputValueProp,
      onInputValueChange,
      filter,
      placeholder,
      invalid,
      size = "md",
      disabledReason,
      name,
      id,
      disabled,
      open: openProp,
      defaultOpen,
      onOpenChange,
      className,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedby,
      "aria-required": ariaRequired,
      "aria-errormessage": ariaErrorMessage,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...rest
    },
    ref,
  ) {
    const [currentValue, setCurrentValue] = useControllableState<string>({
      value,
      defaultValue: defaultValue ?? "",
      onChange: onValueChange,
    });

    const initialText = useMemo(() => {
      const match = options.find((o) => o.value === (defaultValue ?? value));
      return match ? labelText(match) : "";
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isInputControlled = inputValueProp !== undefined;
    const [internalInput, setInternalInput] = useState(initialText);
    const inputValue = isInputControlled ? inputValueProp : internalInput;
    const setInputValue = (next: string) => {
      if (!isInputControlled) setInternalInput(next);
      onInputValueChange?.(next);
    };

    const [open, setOpen] = useControllableState<boolean>({
      value: openProp,
      defaultValue: defaultOpen ?? false,
      onChange: onOpenChange,
    });
    const [activeIndex, setActiveIndex] = useState(-1);
    const icons = useIcons();
    const field = useFormField();

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

    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

    const baseId = useId();
    const listboxId = `${baseId}_listbox`;
    const disabledMsgId = `${baseId}_disabled`;
    const optionId = (index: number) => `${baseId}_option_${index}`;
    const describedBy =
      cx(
        ariaDescribedby ?? field?.describedBy,
        showDisabledReason && disabledMsgId,
      ) || undefined;

    const filtered = useMemo(() => {
      const predicate =
        filter ??
        ((option: SelectOption, query: string) =>
          labelText(option).toLowerCase().includes(query.toLowerCase()));
      const query = inputValue.trim();
      return query === ""
        ? options
        : options.filter((option) => predicate(option, query));
    }, [options, inputValue, filter]);

    useDismiss({
      enabled: open,
      onDismiss: () => setOpen(false),
      refs: [rootRef],
    });

    useEffect(() => {
      if (open && activeIndex >= 0) {
        optionRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
      }
    }, [open, activeIndex]);

    const selectIndex = (index: number) => {
      const option = filtered[index];
      if (!option || option.disabled) return;
      setCurrentValue(option.value);
      setInputValue(labelText(option));
      setOpen(false);
      inputRef.current?.focus();
    };

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setOpen(true);
      setActiveIndex(nextEnabledIndex(filtered, -1, 1));
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!open) {
            setOpen(true);
            setActiveIndex(nextEnabledIndex(filtered, -1, 1));
          } else {
            setActiveIndex((index) => nextEnabledIndex(filtered, index, 1));
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!open) {
            setOpen(true);
            setActiveIndex(nextEnabledIndex(filtered, 0, -1));
          } else {
            setActiveIndex((index) => nextEnabledIndex(filtered, index, -1));
          }
          break;
        case "Home":
          if (open) {
            event.preventDefault();
            setActiveIndex(nextEnabledIndex(filtered, -1, 1));
          }
          break;
        case "End":
          if (open) {
            event.preventDefault();
            setActiveIndex(nextEnabledIndex(filtered, 0, -1));
          }
          break;
        case "Enter":
          if (open && activeIndex >= 0) {
            event.preventDefault();
            selectIndex(activeIndex);
          }
          break;
        case "Escape":
          if (open) {
            event.preventDefault();
            setOpen(false);
          }
          break;
        default:
          break;
      }
    };

    return (
      <DisabledMessage
        active={showDisabledReason}
        id={disabledMsgId}
        reason={resolvedReason}
      >
      <div
        ref={rootRef}
        className={cx(
          "du_combobox",
          showInvalid && "du_combobox_invalid",
          className,
        )}
      >
        <input
          ref={mergeRefs(inputRef, ref)}
          {...rest}
          id={resolvedId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          aria-invalid={invalidAttr}
          aria-required={requiredAttr}
          aria-errormessage={errorMessageAttr}
          aria-describedby={describedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          disabled={isDisabled}
          value={inputValue}
          placeholder={placeholder}
          className={cx("du_combobox_input", `du_combobox_${size}`)}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
        />

        {open && (
          <ul id={listboxId} role="listbox" className="du_combobox_listbox">
            {filtered.length === 0 && (
              <li className="du_combobox_empty" aria-disabled="true">
                No matches
              </li>
            )}
            {filtered.map((option, index) => (
              <li
                key={option.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                id={optionId(index)}
                role="option"
                aria-selected={option.value === currentValue}
                aria-disabled={option.disabled || undefined}
                data-active={index === activeIndex || undefined}
                className="du_combobox_option"
                onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectIndex(index)}
              >
                <Icon
                  icon={icons.check}
                  className="du_combobox_option_mark"
                />
                <span className="du_combobox_option_label">{option.label}</span>
              </li>
            ))}
          </ul>
        )}

        {name && <input type="hidden" name={name} value={currentValue ?? ""} />}
      </div>
      </DisabledMessage>
    );
  },
);
