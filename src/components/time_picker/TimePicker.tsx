import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { useDismiss } from "../../utils/useDismiss";
import { useFormField } from "../form_field/FormFieldContext";
import { DisabledMessage } from "../form_field/disabledMessage";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

const pad = (n: number) => String(n).padStart(2, "0");

interface TimeParts {
  hour: number;
  minute: number;
}

function parse(value: string | null): TimeParts | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

const toMinutes = (parts: TimeParts) => parts.hour * 60 + parts.minute;

const to24 = (displayHour: number, period: "AM" | "PM") =>
  period === "PM" ? (displayHour % 12) + 12 : displayHour % 12;

export interface TimePickerProps {
  /** Selected time as `"HH:mm"` (24h, controlled). */
  value?: string | null;
  /** Initial time as `"HH:mm"` (uncontrolled). */
  defaultValue?: string | null;
  /** Called with the newly selected `"HH:mm"` value (or `null` when cleared). */
  onValueChange?: (value: string | null) => void;
  /** Minute increment for the minute column. Defaults to 5. */
  step?: number;
  /** Use a 12-hour clock with an AM/PM column. Defaults to false (24h). */
  hour12?: boolean;
  /** Earliest selectable time as `"HH:mm"`. */
  min?: string;
  /** Latest selectable time as `"HH:mm"`. */
  max?: string;
  /** Predicate to disable specific hours (24h value). */
  disabledHours?: (hour: number) => boolean;
  /** Predicate to disable specific minutes (given the active 24h hour). */
  disabledMinutes?: (minute: number, hour: number | null) => boolean;
  /** Show a clear affordance beside the trigger. */
  clearable?: boolean;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Marks the field invalid. */
  invalid?: boolean;
  /** Control size. */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** When disabled, reason shown in a persistent caption below the field. */
  disabledReason?: ReactNode;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

/**
 * Two-color time picker: a Select-like trigger opens hour and minute listbox
 * columns (plus AM/PM in 12h mode). Value is `"HH:mm"` in 24h; selected cells
 * invert rather than relying on color.
 */
export function TimePicker({
  value,
  defaultValue,
  onValueChange,
  step = 5,
  hour12 = false,
  min,
  max,
  disabledHours,
  disabledMinutes,
  clearable,
  placeholder = "Select time...",
  invalid,
  size = "md",
  disabled,
  disabledReason,
  id,
  name,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: TimePickerProps) {
  const [current, setCurrent] = useControllableState<string | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const field = useFormField();
  const isDisabled = disabled ?? field?.disabled;
  const resolvedReason = disabledReason ?? field?.disabledReason;
  const showDisabledReason = !!isDisabled && resolvedReason != null;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const icons = useIcons();
  const baseId = useId();
  const disabledMsgId = `${baseId}_disabled`;
  const describedBy =
    cx(ariaDescribedby, showDisabledReason && disabledMsgId) || undefined;

  useDismiss({
    enabled: open,
    onDismiss: () => setOpen(false),
    refs: [rootRef],
  });

  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelectorAll<HTMLElement>("[data-selected]")
      .forEach((el) => el.scrollIntoView?.({ block: "center" }));
  }, [open]);

  const parts = parse(current);
  const selHour = parts?.hour ?? null;
  const selMinute = parts?.minute ?? null;

  const displayHour =
    selHour == null ? null : selHour % 12 === 0 ? 12 : selHour % 12;
  const period: "AM" | "PM" | null =
    selHour == null ? null : selHour < 12 ? "AM" : "PM";

  const minParts = parse(min ?? null);
  const maxParts = parse(max ?? null);

  const isHourDisabled = (hour24: number): boolean => {
    if (minParts && hour24 < minParts.hour) return true;
    if (maxParts && hour24 > maxParts.hour) return true;
    return disabledHours?.(hour24) ?? false;
  };

  const isMinuteDisabled = (minute: number, hour24: number | null): boolean => {
    if (hour24 != null) {
      const total = hour24 * 60 + minute;
      if (minParts && total < toMinutes(minParts)) return true;
      if (maxParts && total > toMinutes(maxParts)) return true;
    }
    return disabledMinutes?.(minute, hour24) ?? false;
  };

  const commit = (hour: number, minute: number) => {
    setCurrent(`${pad(hour)}:${pad(minute)}`);
  };

  const hours = hour12
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from(
    { length: Math.ceil(60 / step) },
    (_, i) => i * step,
  );

  const hourTo24 = (h: number) => (hour12 ? to24(h, period ?? "AM") : h);

  const selectHour = (h: number) => {
    if (hour12) commit(to24(h, period ?? "AM"), selMinute ?? 0);
    else commit(h, selMinute ?? 0);
  };
  const selectMinute = (m: number) => commit(selHour ?? 0, m);
  const selectPeriod = (p: "AM" | "PM") =>
    commit(to24(displayHour ?? 12, p), selMinute ?? 0);

  const closePanel = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const openPanel = () => {
    if (isDisabled) return;
    setOpen(true);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openPanel();
    }
  };

  const columnOptions = (column: Element): HTMLButtonElement[] =>
    Array.from(
      column.querySelectorAll<HTMLButtonElement>(
        ".du_time_picker_option:not(:disabled)",
      ),
    );

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
      return;
    }

    const columns = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="listbox"]') ?? [],
    );
    const active = document.activeElement as HTMLElement | null;
    const colIndex = columns.findIndex((col) => active && col.contains(active));
    if (colIndex === -1) return;

    const options = columnOptions(columns[colIndex] as Element);
    const curIdx = active ? options.indexOf(active as HTMLButtonElement) : -1;

    const focusInColumn = (index: number, list: HTMLButtonElement[]) => {
      const clamped = Math.max(0, Math.min(list.length - 1, index));
      list[clamped]?.focus();
    };

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusInColumn(curIdx + 1, options);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusInColumn(curIdx - 1, options);
        break;
      case "Home":
        event.preventDefault();
        focusInColumn(0, options);
        break;
      case "End":
        event.preventDefault();
        focusInColumn(options.length - 1, options);
        break;
      case "ArrowRight": {
        event.preventDefault();
        const next = columns[colIndex + 1];
        if (next) {
          const list = columnOptions(next);
          const selected = list.findIndex((el) => el.dataset.selected);
          focusInColumn(selected === -1 ? curIdx : selected, list);
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const prev = columns[colIndex - 1];
        if (prev) {
          const list = columnOptions(prev);
          const selected = list.findIndex((el) => el.dataset.selected);
          focusInColumn(selected === -1 ? curIdx : selected, list);
        }
        break;
      }
      default:
        break;
    }
  };

  const label = (() => {
    if (!parts) return placeholder;
    if (hour12)
      return `${pad(displayHour ?? 12)}:${pad(parts.minute)} ${period}`;
    return `${pad(parts.hour)}:${pad(parts.minute)}`;
  })();

  return (
    <DisabledMessage
      active={showDisabledReason}
      id={disabledMsgId}
      reason={resolvedReason}
    >
    <div
      ref={rootRef}
      className={cx(
        "du_time_picker",
        invalid && "du_time_picker_invalid",
        className,
      )}
    >
      <div className="du_time_picker_control">
        <button
          ref={triggerRef}
          type="button"
          id={id}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={describedBy}
          disabled={isDisabled}
          data-open={open || undefined}
          className={cx("du_time_picker_trigger", `du_time_picker_${size}`)}
          onClick={() => (open ? closePanel(false) : openPanel())}
          onKeyDown={onTriggerKeyDown}
        >
          <span
            className={cx(
              "du_time_picker_value",
              !parts && "du_time_picker_placeholder",
            )}
          >
            {label}
          </span>
          <span className="du_time_picker_affix">
            <Icon icon={icons.clock} className="du_time_picker_glyph" />
          </span>
        </button>
        {clearable && parts && !isDisabled && (
          <button
            type="button"
            className="du_time_picker_clear"
            aria-label="Clear time"
            onClick={() => setCurrent(null)}
          >
            <Icon icon={icons.close} />
          </button>
        )}
      </div>

      {open && (
        <div
          ref={panelRef}
          className="du_time_picker_panel"
          onKeyDown={onPanelKeyDown}
        >
          <ul
            role="listbox"
            aria-label="Hours"
            id={`${baseId}_hours`}
            className="du_time_picker_column"
          >
            {hours.map((h) => {
              const selected = hour12 ? h === displayHour : h === selHour;
              const optionDisabled = isHourDisabled(hourTo24(h));
              return (
                <li key={h} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-selected={selected || undefined}
                    disabled={optionDisabled}
                    className="du_time_picker_option"
                    onClick={() => selectHour(h)}
                  >
                    {pad(h)}
                  </button>
                </li>
              );
            })}
          </ul>

          <ul
            role="listbox"
            aria-label="Minutes"
            id={`${baseId}_minutes`}
            className="du_time_picker_column"
          >
            {minutes.map((m) => {
              const selected = m === selMinute;
              const optionDisabled = isMinuteDisabled(
                m,
                selHour ?? (hour12 && displayHour != null
                  ? to24(displayHour, period ?? "AM")
                  : null),
              );
              return (
                <li key={m} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-selected={selected || undefined}
                    disabled={optionDisabled}
                    className="du_time_picker_option"
                    onClick={() => selectMinute(m)}
                  >
                    {pad(m)}
                  </button>
                </li>
              );
            })}
          </ul>

          {hour12 && (
            <ul
              role="listbox"
              aria-label="Period"
              id={`${baseId}_period`}
              className="du_time_picker_column"
            >
              {(["AM", "PM"] as const).map((p) => {
                const selected = p === period;
                return (
                  <li key={p} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-selected={selected || undefined}
                      className="du_time_picker_option"
                      onClick={() => selectPeriod(p)}
                    >
                      {p}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {name && <input type="hidden" name={name} value={current ?? ""} />}
    </div>
    </DisabledMessage>
  );
}
