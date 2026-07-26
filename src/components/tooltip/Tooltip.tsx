import {
  cloneElement,
  useCallback,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Portal } from "../../utils/Portal";
import { useAnchorPosition, type Side } from "../../utils/floating";
import { useControllableState } from "../../utils/useControllableState";

/** Tooltips anchor to a single side (alignment is centered). */
export type TooltipPlacement = Side;

export interface TooltipProps {
  /** Tooltip contents. */
  content: ReactNode;
  /** Single focusable trigger element. */
  children: ReactElement;
  /** Side of the trigger to render on. Defaults to top. */
  placement?: TooltipPlacement;
  /** Gap between trigger and tooltip, in px. Defaults to 8. */
  offset?: number;
  /** Delay before showing, in ms. Defaults to 150. */
  openDelay?: number;
  /** Delay before hiding, in ms. Defaults to 0. */
  closeDelay?: number;
  /** Show a pointer arrow toward the trigger. Defaults to false. */
  arrow?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Class applied to the tooltip bubble. */
  className?: string;
  /** Class applied to the wrapper that anchors the trigger. */
  rootClassName?: string;
}

/**
 * Text hint shown on hover/focus. Portaled and positioned with collision-aware
 * flipping; a close delay keeps it visible while the pointer bridges the gap.
 */
export function Tooltip({
  content,
  children,
  placement = "top",
  offset,
  openDelay = 150,
  closeDelay = 0,
  arrow = false,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  rootClassName,
}: TooltipProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef<HTMLSpanElement>(null);
  const [tooltipEl, setTooltipEl] = useState<HTMLSpanElement | null>(null);
  const setTooltip = useCallback(
    (node: HTMLSpanElement | null) => setTooltipEl(node),
    [],
  );
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const id = useId();
  const tooltipId = `${id}_tooltip`;

  const position = useAnchorPosition({
    anchorRef: rootRef,
    floatingEl: tooltipEl,
    placement,
    offset,
    enabled: isOpen,
  });

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), openDelay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    if (closeDelay > 0) {
      timer.current = setTimeout(() => setOpen(false), closeDelay);
    } else {
      setOpen(false);
    }
  };
  const cancelHide = () => clearTimeout(timer.current);

  const existingDescribedBy = (
    children.props as { "aria-describedby"?: string }
  )["aria-describedby"];
  const trigger = cloneElement(children, {
    "aria-describedby": cx(existingDescribedBy, tooltipId),
  });

  return (
    <span
      ref={rootRef}
      className={cx("du_tooltip_root", rootClassName)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}
      {isOpen && (
        <Portal>
          <span
            ref={setTooltip}
            role="tooltip"
            id={tooltipId}
            data-side={position.side}
            className={cx("du_tooltip", className)}
            style={position.floatingStyle}
            onMouseEnter={cancelHide}
            onMouseLeave={hide}
          >
            {content}
            {arrow && (
              <span
                className="du_tooltip_arrow"
                aria-hidden="true"
                style={position.arrowStyle}
              />
            )}
          </span>
        </Portal>
      )}
    </span>
  );
}
