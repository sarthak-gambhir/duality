import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "value" | "defaultValue" | "onChange" | "children"
> {
  /** Options to render. If omitted, `<option>` children are parsed instead. */
  options?: SelectOption[];
  /** `<option>` elements (parsed when `options` is not provided). */
  children?: ReactNode;
  /** Selected value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Marks the field invalid (border-style change + `aria-invalid`). */
  invalid?: boolean;
  /** Control size. */
  selectSize?: "sm" | "md" | "lg";
  /**
   * Which edge the selection marker sits on within each option. `"end"` moves
   * it to the trailing edge with the label filling the leading space. Defaults
   * to `"start"`.
   */
  markAlign?: "start" | "end";
  /**
   * Which edge the dropdown is anchored to relative to the trigger. Use
   * `"end"` for triggers near the trailing edge so the list opens inward.
   * Defaults to `"start"`.
   */
  align?: "start" | "end";
  /** Name of a hidden input so the value participates in form submission. */
  name?: string;
}

function optionsFromChildren(children: ReactNode): SelectOption[] {
  const items: SelectOption[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== "option") return;
    const props = child.props as {
      value?: string;
      children?: ReactNode;
      disabled?: boolean;
    };
    items.push({
      value: String(props.value ?? ""),
      label: props.children,
      disabled: props.disabled,
    });
  });
  return items;
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
 * Custom two-color dropdown built on the ARIA combobox/listbox pattern, so the
 * open list follows `--fg`/`--bg`, pixel borders, and inversion just like the
 * rest of the system. A hidden input mirrors the value for form submission.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      options,
      children,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Select...",
      invalid,
      selectSize = "md",
      markAlign = "start",
      align = "start",
      name,
      id,
      disabled,
      className,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedby,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...rest
    },
    ref,
  ) {
    const items = useMemo(
      () => options ?? optionsFromChildren(children),
      [options, children],
    );

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(
      defaultValue,
    );
    const currentValue = isControlled ? value : internalValue;

    const selectedIndex = items.findIndex(
      (item) => item.value === currentValue,
    );
    const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined;

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

    const baseId = useId();
    const listboxId = `${baseId}_listbox`;
    const optionId = (index: number) => `${baseId}_option_${index}`;

    const openList = useCallback(() => {
      if (disabled) return;
      setActiveIndex(
        selectedIndex >= 0 ? selectedIndex : nextEnabledIndex(items, -1, 1),
      );
      setOpen(true);
    }, [disabled, items, selectedIndex]);

    const closeList = useCallback((focusButton = true) => {
      setOpen(false);
      if (focusButton) buttonRef.current?.focus();
    }, []);

    const selectIndex = useCallback(
      (index: number) => {
        const item = items[index];
        if (!item || item.disabled) return;
        if (!isControlled) setInternalValue(item.value);
        onValueChange?.(item.value);
        closeList();
      },
      [items, isControlled, onValueChange, closeList],
    );

    useEffect(() => {
      if (!open) return undefined;
      const onDocMouseDown = (event: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(event.target as Node))
          setOpen(false);
      };
      document.addEventListener("mousedown", onDocMouseDown);
      return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [open]);

    useEffect(() => {
      if (open && activeIndex >= 0) {
        optionRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
      }
    }, [open, activeIndex]);

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!open) openList();
          else setActiveIndex((index) => nextEnabledIndex(items, index, 1));
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!open) openList();
          else setActiveIndex((index) => nextEnabledIndex(items, index, -1));
          break;
        case "Home":
          if (open) {
            event.preventDefault();
            setActiveIndex(nextEnabledIndex(items, -1, 1));
          }
          break;
        case "End":
          if (open) {
            event.preventDefault();
            setActiveIndex(nextEnabledIndex(items, 0, -1));
          }
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (!open) openList();
          else if (activeIndex >= 0) selectIndex(activeIndex);
          break;
        case "Escape":
          if (open) {
            event.preventDefault();
            closeList();
          }
          break;
        case "Tab":
          if (open) setOpen(false);
          break;
        default:
          break;
      }
    };

    return (
      <div
        ref={rootRef}
        className={cx("du_select", invalid && "du_select_invalid", className)}
      >
        <button
          ref={mergeRefs(buttonRef, ref)}
          type="button"
          {...rest}
          id={id}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          aria-invalid={ariaInvalid ?? (invalid || undefined)}
          aria-describedby={ariaDescribedby}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          disabled={disabled}
          data-open={open || undefined}
          className={cx("du_select_button", `du_select_${selectSize}`)}
          onClick={() => (open ? closeList(false) : openList())}
          onKeyDown={handleKeyDown}
        >
          <span
            className={cx(
              "du_select_value",
              !selected && "du_select_placeholder",
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
          <span className="du_select_caret" aria-hidden="true" />
        </button>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className="du_select_listbox"
            data-mark-align={markAlign}
            data-align={align}
          >
            {items.map((item, index) => (
              <li
                key={item.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                id={optionId(index)}
                role="option"
                aria-selected={item.value === currentValue}
                aria-disabled={item.disabled || undefined}
                data-active={index === activeIndex || undefined}
                className="du_select_option"
                onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectIndex(index)}
              >
                <span className="du_select_option_mark" aria-hidden="true" />
                <span className="du_select_option_label">{item.label}</span>
              </li>
            ))}
          </ul>
        )}

        {name && <input type="hidden" name={name} value={currentValue ?? ""} />}
      </div>
    );
  },
);
