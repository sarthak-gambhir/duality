import {
  createContext,
  useContext,
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

type ToggleValue = string | string[];

interface ToggleGroupContextValue {
  type: "single" | "multiple";
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  disabled?: boolean;
  /** In single mode, the one item that is part of the tab sequence. */
  focusableValue?: string;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroup(): ToggleGroupContextValue {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx)
    throw new Error("ToggleGroupItem must be used within <ToggleGroup>.");
  return ctx;
}

export interface ToggleGroupProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue"> {
  /** Single selection (radio-like) or multiple (independent toggles). */
  type?: "single" | "multiple";
  /** Selected value(s) (controlled). */
  value?: ToggleValue;
  /** Initial value(s) (uncontrolled). */
  defaultValue?: ToggleValue;
  /** Called with the new selection. */
  onValueChange?: (value: ToggleValue) => void;
  /** Disables every item in the group. */
  disabled?: boolean;
  /** Accessible group label. */
  label?: ReactNode;
  /**
   * When set, the selection is mirrored to hidden input(s) of this name so it
   * participates in form submission (one input per value in `multiple` mode).
   */
  name?: string;
  children?: ReactNode;
}

/**
 * Segmented control. `single` renders a `radiogroup` with roving focus;
 * `multiple` renders a `group` of independent `aria-pressed` toggle buttons.
 */
export function ToggleGroup({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  disabled,
  label,
  name,
  className,
  children,
  ...rest
}: ToggleGroupProps) {
  const [current, setCurrent] = useControllableState<ToggleValue>({
    value,
    defaultValue: defaultValue ?? (type === "multiple" ? [] : ""),
    onChange: onValueChange,
  });

  const rootRef = useRef<HTMLDivElement>(null);

  const isSelected = (v: string) =>
    type === "multiple"
      ? (current as string[]).includes(v)
      : current === v;

  const toggle = (v: string) => {
    if (type === "multiple") {
      const arr = current as string[];
      setCurrent(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      setCurrent(v);
    }
  };

  // The first radio (or the selected one) is the single tab stop in single mode.
  let focusableValue: string | undefined;
  if (type === "single") {
    const selectedValue = current as string;
    focusableValue = selectedValue || undefined;
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (type !== "single") return;
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="radio"]:not([disabled])',
      ) ?? [],
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;

    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;

    const target = items[next];
    if (next >= 0 && target) {
      event.preventDefault();
      target.focus();
      target.click();
    }
  };

  // In single mode, if nothing is selected yet, make the first item focusable.
  const resolvedFocusable =
    type === "single" && !focusableValue ? firstValue(children) : focusableValue;

  return (
    <div
      ref={rootRef}
      role={type === "single" ? "radiogroup" : "group"}
      aria-label={typeof label === "string" ? label : undefined}
      className={cx("du_toggle_group", className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <ToggleGroupContext.Provider
        value={{
          type,
          isSelected,
          toggle,
          disabled,
          focusableValue: resolvedFocusable,
        }}
      >
        {children}
      </ToggleGroupContext.Provider>
      {name && <ToggleGroupHiddenInputs name={name} value={current} />}
    </div>
  );
}

function ToggleGroupHiddenInputs({
  name,
  value,
}: {
  name: string;
  value: ToggleValue;
}) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <>
      {values.map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
    </>
  );
}

function firstValue(children: ReactNode): string | undefined {
  let found: string | undefined;
  const walk = (nodes: ReactNode) => {
    for (const child of Array.isArray(nodes) ? nodes : [nodes]) {
      if (found !== undefined) return;
      if (
        child &&
        typeof child === "object" &&
        "props" in child &&
        (child as { props?: { value?: string } }).props?.value != null
      ) {
        found = String((child as { props: { value: string } }).props.value);
      }
    }
  };
  walk(children);
  return found;
}

export interface ToggleGroupItemProps
  extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  /** This item's value. */
  value: string;
}

/** A single option button within a ToggleGroup. */
export function ToggleGroupItem({
  value,
  className,
  disabled: itemDisabled,
  ...rest
}: ToggleGroupItemProps) {
  const ctx = useToggleGroup();
  const selected = ctx.isSelected(value);
  const disabled = ctx.disabled || itemDisabled;

  const common = {
    type: "button" as const,
    disabled,
    "data-selected": selected || undefined,
    className: cx("du_toggle", className),
    onClick: () => {
      if (!disabled) ctx.toggle(value);
    },
  };

  if (ctx.type === "single") {
    return (
      <button
        {...rest}
        {...common}
        role="radio"
        aria-checked={selected}
        tabIndex={ctx.focusableValue === value ? 0 : -1}
      />
    );
  }
  return <button {...rest} {...common} aria-pressed={selected} />;
}
