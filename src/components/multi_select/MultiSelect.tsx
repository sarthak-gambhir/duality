import {
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { useDismiss } from "../../utils/useDismiss";
import { Badge } from "../badge/Badge";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import type { SelectOption } from "../select/Select";

export interface MultiSelectProps {
  /** Options to choose from. */
  options: SelectOption[];
  /** Selected values (controlled). */
  value?: string[];
  /** Initial selected values (uncontrolled). */
  defaultValue?: string[];
  /** Called with the next array of selected values. */
  onValueChange?: (value: string[]) => void;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Marks the field invalid (dashed border + `aria-invalid`). */
  invalid?: boolean;
  disabled?: boolean;
  /** When set, each selected value is mirrored to a hidden input of this name. */
  name?: string;
  /** Called when the text input loses focus (for form-library integration). */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
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

/** Multi-value combobox: selected options show as removable chips. */
export function MultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select...",
  invalid,
  disabled,
  name,
  onBlur,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: MultiSelectProps) {
  const [selected, setSelected] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const icons = useIcons();

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseId = useId();
  const listboxId = `${baseId}_listbox`;
  const optionId = (index: number) => `${baseId}_option_${index}`;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q === ""
      ? options
      : options.filter((o) => labelText(o).toLowerCase().includes(q));
  }, [options, query]);

  useDismiss({
    enabled: open,
    onDismiss: () => setOpen(false),
    refs: [rootRef],
  });

  const selectedSet = new Set(selected ?? []);

  const toggle = (option?: SelectOption) => {
    if (!option || option.disabled) return;
    const current = selected ?? [];
    const next = current.includes(option.value)
      ? current.filter((v) => v !== option.value)
      : [...current, option.value];
    setSelected(next);
    setQuery("");
    inputRef.current?.focus();
  };

  const remove = (value: string) => {
    setSelected((selected ?? []).filter((v) => v !== value));
    inputRef.current?.focus();
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
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
        if (open)
          setActiveIndex((index) => nextEnabledIndex(filtered, index, -1));
        break;
      case "Enter":
        if (open && activeIndex >= 0) {
          event.preventDefault();
          toggle(filtered[activeIndex]);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Backspace":
        if (query === "" && (selected?.length ?? 0) > 0) {
          remove(selected![selected!.length - 1]!);
        }
        break;
      default:
        break;
    }
  };

  const selectedOptions = (selected ?? [])
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is SelectOption => o != null);

  return (
    <div
      ref={rootRef}
      className={cx(
        "du_multi_select",
        invalid && "du_multi_select_invalid",
        className,
      )}
    >
      <div
        className={cx(
          "du_multi_select_control",
          disabled && "du_multi_select_disabled",
        )}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {selectedOptions.map((option) => (
          <Badge key={option.value} className="du_multi_select_chip du_badge_removable">
            <span>{option.label}</span>
            <button
              type="button"
              className="du_multi_select_chip_remove"
              aria-label={`Remove ${labelText(option)}`}
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                remove(option.value);
              }}
            >
              <Icon icon={icons.close} />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          disabled={disabled}
          value={query}
          placeholder={selectedOptions.length === 0 ? placeholder : undefined}
          className="du_multi_select_input"
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={onBlur}
        />
      </div>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className="du_multi_select_listbox"
        >
          {filtered.length === 0 && (
            <li className="du_multi_select_empty" aria-disabled="true">
              No matches
            </li>
          )}
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={selectedSet.has(option.value)}
              aria-disabled={option.disabled || undefined}
              data-active={index === activeIndex || undefined}
              className="du_multi_select_option"
              onMouseEnter={() => !option.disabled && setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => toggle(option)}
            >
              <Icon
                icon={icons.check}
                className="du_multi_select_option_mark"
              />
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}

      {name &&
        (selected ?? []).map((value) => (
          <input key={value} type="hidden" name={name} value={value} />
        ))}
    </div>
  );
}
