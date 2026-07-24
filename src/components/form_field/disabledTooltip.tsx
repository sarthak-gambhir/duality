import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Tooltip } from "../tooltip/Tooltip";

/** Data handed to a {@link DisabledTooltipFormatter}. */
export interface DisabledTooltipInfo {
  /** Current value of the control, read live when the tooltip opens. */
  value: string;
  /** Reason the field is disabled, if any. */
  reason?: ReactNode;
}

/** Formats the tooltip shown on a disabled field. */
export type DisabledTooltipFormatter = (info: DisabledTooltipInfo) => ReactNode;

/**
 * Default content: the reason first (when present) then the value (when the
 * field has one). Both, either, or neither line can appear.
 */
export function defaultDisabledTooltip({
  value,
  reason,
}: DisabledTooltipInfo): ReactNode {
  const hasValue = value.length > 0;
  return (
    <>
      {reason != null && <div>Disabled due to: {reason}</div>}
      {hasValue && <div>Value: {value}</div>}
    </>
  );
}

export interface DisabledTooltipProps {
  /** Whether the field is disabled (the tooltip only applies when true). */
  disabled?: boolean;
  /** Reason the field is disabled. */
  reason?: ReactNode;
  /** Override the default content formatting. */
  formatter?: DisabledTooltipFormatter;
  /** Reads the control's current value string (from its ref or state). */
  getValue: () => string;
  /** The control to wrap; must be a single element. */
  children: ReactElement;
}

/**
 * Wraps a disabled control in a Tooltip that surfaces its value and/or the
 * reason it is disabled. The value is read from the control on open, so it
 * stays correct for controlled and uncontrolled fields alike. Hover-only,
 * since disabled controls cannot receive focus. When the field is enabled (or
 * has nothing to show) the child is rendered unwrapped.
 */
export function DisabledTooltip({
  disabled,
  reason,
  formatter,
  getValue,
  children,
}: DisabledTooltipProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const getValueRef = useRef(getValue);
  getValueRef.current = getValue;

  // Read the value once the field is disabled so the wrap decision is correct
  // even before the first hover (uncontrolled fields have no value in props).
  useLayoutEffect(() => {
    setValue(disabled ? getValueRef.current() : "");
  }, [disabled]);

  const handleOpenChange = useCallback((next: boolean) => {
    if (next) setValue(getValueRef.current());
    setOpen(next);
  }, []);

  const shouldWrap = !!disabled && (reason != null || value.length > 0);
  if (!shouldWrap) return children;

  const content = (formatter ?? defaultDisabledTooltip)({ value, reason });
  return (
    <Tooltip
      content={content}
      open={open}
      onOpenChange={handleOpenChange}
      rootClassName="du_disabled_tooltip"
      placement="bottom"
      arrow={true}
    >
      {children}
    </Tooltip>
  );
}
