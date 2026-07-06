import {
  cloneElement,
  useId,
  useRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { useDismiss } from "../../utils/useDismiss";

export type PopoverPlacement =
  "bottom-start" | "bottom-end" | "top-start" | "top-end";

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
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Click-triggered anchored panel, dismissed on outside press or Escape. */
export function Popover({
  trigger,
  children,
  placement = "bottom-start",
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
  const id = useId();
  const panelId = `${id}_popover`;

  useDismiss({
    enabled: isOpen,
    onDismiss: () => setOpen(false),
    refs: [rootRef],
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
        <div
          role="dialog"
          id={panelId}
          className={cx(
            "du_popover",
            `du_popover_${placement.replace("-", "_")}`,
            className,
          )}
        >
          {children}
        </div>
      )}
    </span>
  );
}
