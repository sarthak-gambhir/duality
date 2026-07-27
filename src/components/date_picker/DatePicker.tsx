import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";
import { useControllableState } from "../../utils/useControllableState";
import { useDismiss } from "../../utils/useDismiss";
import { useFormField } from "../form_field/FormFieldContext";
import { DisabledMessage } from "../form_field/DisabledMessage";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import type { ControlSize } from "../../tokens/scale";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
const isSameDay = (a: Date, b: Date) => toISO(a) === toISO(b);
const dayLabel = (d: Date) =>
  `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

export interface DatePickerProps {
  /** Selected date (controlled). */
  value?: Date | null;
  /** Initial date (uncontrolled). */
  defaultValue?: Date | null;
  /** Called with the newly selected date. */
  onValueChange?: (value: Date | null) => void;
  /** Earliest selectable date. */
  min?: Date;
  /** Latest selectable date. */
  max?: Date;
  /** Predicate to disable specific dates. */
  isDateDisabled?: (date: Date) => boolean;
  /** Formats the value shown in the trigger. Defaults to ISO `yyyy-mm-dd`. */
  format?: (date: Date) => string;
  /** First day of the week (0 = Sunday ... 6 = Saturday). Defaults to Sunday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Show a clear affordance and a "Clear" footer action. */
  clearable?: boolean;
  /** Text shown when no date is selected. */
  placeholder?: string;
  /** Marks the field invalid. */
  invalid?: boolean;
  /** Control size. */
  size?: ControlSize;
  disabled?: boolean;
  /** When disabled, reason shown in a persistent caption below the field. */
  disabledReason?: ReactNode;
  /** Whether the calendar is open (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  id?: string;
  className?: string;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  "aria-errormessage"?: string;
}

/**
 * Two-color date picker: a Select-like trigger opens an anchored calendar grid.
 * Native `Date` only; today is marked by a border (not color), the selected day
 * inverts, and the grid supports full keyboard navigation.
 */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    {
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      isDateDisabled,
      format = toISO,
      weekStartsOn = 0,
      clearable,
      placeholder = "Select date...",
      invalid,
      size = "md",
      disabled,
      disabledReason,
      open: openProp,
      defaultOpen,
      onOpenChange,
      id,
      className,
      name,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-errormessage": ariaErrorMessage,
    },
    forwardedRef,
  ) {
  const [current, setCurrent] = useControllableState<Date | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
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

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(current ?? new Date()),
  );
  const [focusedDate, setFocusedDate] = useState(() =>
    startOfDay(current ?? new Date()),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const icons = useIcons();

  const baseId = useId();
  const gridLabelId = `${baseId}_grid_label`;
  const disabledMsgId = `${baseId}_disabled`;
  const describedBy =
    cx(
      ariaDescribedby ?? field?.describedBy,
      showDisabledReason && disabledMsgId,
    ) || undefined;

  useDismiss({
    enabled: open,
    onDismiss: () => setOpen(false),
    refs: [rootRef],
  });

  useEffect(() => {
    if (!open) return;
    const key = toISO(focusedDate);
    panelRef.current
      ?.querySelector<HTMLElement>(`[data-date="${key}"]`)
      ?.focus();
  }, [open, focusedDate]);

  const isDisabledDate = (d: Date): boolean => {
    if (min && toISO(d) < toISO(min)) return true;
    if (max && toISO(d) > toISO(max)) return true;
    return isDateDisabled?.(d) ?? false;
  };

  const openCalendar = () => {
    if (isDisabled) return;
    const base = startOfDay(current ?? new Date());
    setFocusedDate(base);
    setViewMonth(startOfMonth(base));
    setOpen(true);
  };

  const closeCalendar = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const setFocused = (d: Date) => {
    setFocusedDate(d);
    if (
      d.getMonth() !== viewMonth.getMonth() ||
      d.getFullYear() !== viewMonth.getFullYear()
    ) {
      setViewMonth(startOfMonth(d));
    }
  };

  const selectDate = (d: Date) => {
    if (isDisabledDate(d)) return;
    setCurrent(startOfDay(d));
    closeCalendar();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openCalendar();
    }
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        setFocused(addDays(focusedDate, -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        setFocused(addDays(focusedDate, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocused(addDays(focusedDate, -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocused(addDays(focusedDate, 7));
        break;
      case "Home": {
        event.preventDefault();
        const offset = (focusedDate.getDay() - weekStartsOn + 7) % 7;
        setFocused(addDays(focusedDate, -offset));
        break;
      }
      case "End": {
        event.preventDefault();
        const offset = (focusedDate.getDay() - weekStartsOn + 7) % 7;
        setFocused(addDays(focusedDate, 6 - offset));
        break;
      }
      case "PageUp":
        event.preventDefault();
        setFocused(addMonths(focusedDate, -1));
        break;
      case "PageDown":
        event.preventDefault();
        setFocused(addMonths(focusedDate, 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectDate(focusedDate);
        break;
      case "Escape":
        event.preventDefault();
        closeCalendar();
        break;
      default:
        break;
    }
  };

  // Build a stable 6-week grid starting on the configured first weekday.
  const monthStart = startOfMonth(viewMonth);
  const leading = (monthStart.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(monthStart, -leading);
  const weeks = Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)),
  );
  const weekdays = Array.from(
    { length: 7 },
    (_, i) => WEEKDAYS[(i + weekStartsOn) % 7] as string,
  );

  const monthLabel = `${MONTHS[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;
  const today = new Date();

  const clear = () => {
    setCurrent(null);
    closeCalendar();
  };

  const goToday = () => {
    const t = startOfDay(new Date());
    if (isDisabledDate(t)) {
      setFocused(t);
      return;
    }
    selectDate(t);
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
        "du_date_picker",
        showInvalid && "du_date_picker_invalid",
        className,
      )}
    >
      <div className="du_date_picker_control">
        <button
          ref={mergeRefs(triggerRef, forwardedRef)}
          type="button"
          id={resolvedId}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={invalidAttr}
          aria-required={requiredAttr}
          aria-errormessage={errorMessageAttr}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={describedBy}
          disabled={isDisabled}
          data-open={open || undefined}
          className={cx("du_date_picker_trigger", `du_date_picker_${size}`)}
          onClick={() => (open ? closeCalendar(false) : openCalendar())}
          onKeyDown={onTriggerKeyDown}
        >
          <span
            className={cx(
              "du_date_picker_value",
              !current && "du_date_picker_placeholder",
            )}
          >
            {current ? format(current) : placeholder}
          </span>
          <span className="du_date_picker_affix">
            <Icon icon={icons.calendar} className="du_date_picker_glyph" />
          </span>
        </button>
        {clearable && current && !isDisabled && (
          <button
            type="button"
            className="du_date_picker_clear"
            aria-label="Clear date"
            onClick={() => setCurrent(null)}
          >
            <Icon icon={icons.close} />
          </button>
        )}
      </div>

      {open && (
        <div ref={panelRef} className="du_date_picker_panel">
          <div className="du_date_picker_header">
            <button
              type="button"
              className="du_date_picker_nav"
              aria-label="Previous month"
              onClick={() => setViewMonth(addMonths(viewMonth, -1))}
            >
              <Icon icon={icons.chevronLeft} />
            </button>
            <span id={gridLabelId} className="du_date_picker_month">
              {monthLabel}
            </span>
            <button
              type="button"
              className="du_date_picker_nav"
              aria-label="Next month"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            >
              <Icon icon={icons.chevronRight} />
            </button>
          </div>

          <div
            role="grid"
            aria-labelledby={gridLabelId}
            className="du_date_picker_grid"
            onKeyDown={onGridKeyDown}
          >
            <div role="row" className="du_date_picker_row">
              {weekdays.map((w) => (
                <span
                  key={w}
                  role="columnheader"
                  aria-label={w}
                  className="du_date_picker_weekday"
                >
                  {w}
                </span>
              ))}
            </div>
            {weeks.map((week) => (
              <div
                role="row"
                className="du_date_picker_row"
                key={toISO(week[0] as Date)}
              >
                {week.map((date) => {
                  const outside = date.getMonth() !== viewMonth.getMonth();
                  const dateDisabled = isDisabledDate(date);
                  const selected = current ? isSameDay(date, current) : false;
                  const isFocusable = isSameDay(date, focusedDate);
                  return (
                    <button
                      key={toISO(date)}
                      type="button"
                      role="gridcell"
                      aria-label={dayLabel(date)}
                      aria-selected={selected}
                      aria-disabled={dateDisabled || undefined}
                      data-date={toISO(date)}
                      data-today={isSameDay(date, today) || undefined}
                      data-outside={outside || undefined}
                      disabled={dateDisabled}
                      tabIndex={isFocusable ? 0 : -1}
                      className="du_date_picker_day"
                      onClick={() => selectDate(date)}
                    >
                      <span className="du_date_picker_day_num">
                        {date.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="du_date_picker_footer">
            <button
              type="button"
              className="du_date_picker_action"
              onClick={goToday}
            >
              Today
            </button>
            {clearable && (
              <button
                type="button"
                className="du_date_picker_action"
                onClick={clear}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {name && (
        <input
          type="hidden"
          name={name}
          value={current ? toISO(current) : ""}
        />
      )}
    </div>
    </DisabledMessage>
  );
});
