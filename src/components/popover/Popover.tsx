import {
  cloneElement,
  useCallback,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Portal } from "../../utils/portal";
import { useAnchorPosition, type Placement } from "../../utils/floating";
import { useControllableState } from "../../utils/useControllableState";
import { useDismiss } from "../../utils/useDismiss";

/** Full placement set (any side, optionally aligned to start/end). */
export type PopoverPlacement = Placement;

interface TriggerProps {
  onClick?: (event: MouseEvent) => void;
}

export interface PopoverProps {
  /** Clickable trigger element. */
  trigger: ReactElement<TriggerProps>;
  /** Panel contents. */
  children: ReactNode;
  /** Anchor position. Defaults to bottom-start. */
  placement?: PopoverPlacement;
  /** Gap between trigger and panel, in px. Defaults to 8. */
  offset?: number;
  /** Flip to the opposite side on overflow. Defaults to true. */
  flip?: boolean;
  /** Slide along the cross axis to stay in view. Defaults to true. */
  shift?: boolean;
  /** Show a pointer arrow toward the trigger. Defaults to false. */
  arrow?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Click-triggered anchored panel, dismissed on outside press or Escape.
 * Rendered in a portal and positioned with collision-aware flip/shift.
 */
export function Popover({
  trigger,
  children,
  placement = "bottom-start",
  offset,
  flip,
  shift,
  arrow = false,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: PopoverProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const rootRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null);
  const setPanel = useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node;
    setPanelEl(node);
  }, []);
  const id = useId();
  const panelId = `${id}_popover`;

  useDismiss({
    enabled: isOpen,
    onDismiss: () => setOpen(false),
    refs: [rootRef, panelRef],
  });

  const position = useAnchorPosition({
    anchorRef: rootRef,
    floatingEl: panelEl,
    placement,
    offset,
    flip,
    shift,
    enabled: isOpen,
  });

  const clonedTrigger = cloneElement(trigger, {
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? panelId : undefined,
    onClick: (event: MouseEvent) => {
      trigger.props.onClick?.(event);
      setOpen(!isOpen);
    },
  } as TriggerProps);

  return (
    <span ref={rootRef} className="du_popover_root">
      {clonedTrigger}
      {isOpen && (
        <Portal>
          <div
            ref={setPanel}
            role="dialog"
            id={panelId}
            data-side={position.side}
            className={cx("du_popover", className)}
            style={position.floatingStyle}
          >
            {children}
            {arrow && (
              <span
                className="du_popover_arrow"
                aria-hidden="true"
                style={position.arrowStyle}
              />
            )}
          </div>
        </Portal>
      )}
    </span>
  );
}
