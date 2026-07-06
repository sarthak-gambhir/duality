import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Portal } from "../../utils/Portal";
import { useDismiss } from "../../utils/useDismiss";
import { useFocusTrap } from "../../utils/useFocusTrap";

export type DrawerSide = "start" | "end" | "top" | "bottom";

export interface DrawerProps {
  /** Whether the drawer is open. */
  isOpen: boolean;
  /** Called when the drawer requests to close (backdrop press or Escape). */
  onClose: () => void;
  children: ReactNode;
  /** Edge the panel is anchored to. Defaults to `end`. */
  side?: DrawerSide;
  /** Panel size (width for start/end, height for top/bottom). Number = px. */
  size?: number | string;
  /** Accessible name (use when there is no visible titled header). */
  "aria-label"?: string;
  /** Id of the element labelling the dialog (e.g. a DrawerHeader). */
  "aria-labelledby"?: string;
  /** Id of the element describing the dialog. */
  "aria-describedby"?: string;
  /** Close when the backdrop is pressed. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;
  className?: string;
}

/** Accessible edge-anchored panel (Sheet) rendered in a portal over a dithered scrim. */
export function Drawer({
  isOpen,
  onClose,
  children,
  side = "end",
  size = 320,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useDismiss({
    enabled: isOpen,
    onDismiss: onClose,
    refs: [dialogRef],
    escape: closeOnEscape,
    outsidePress: closeOnBackdrop,
  });

  useFocusTrap(dialogRef, isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const horizontal = side === "start" || side === "end";
  const style: CSSProperties = horizontal
    ? { inlineSize: size }
    : { blockSize: size };

  return (
    <Portal>
      <div className="du_drawer_backdrop" data-du-overlay="">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          tabIndex={-1}
          className={cx("du_drawer", `du_drawer_${side}`, className)}
          style={style}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

export type DrawerSectionProps = ComponentPropsWithoutRef<"div">;

/** Top section of a Drawer, separated by a pixel rule. */
export function DrawerHeader({ className, ...rest }: DrawerSectionProps) {
  return <div className={cx("du_drawer_header", className)} {...rest} />;
}

/** Scrollable main content section of a Drawer. */
export function DrawerBody({ className, ...rest }: DrawerSectionProps) {
  return <div className={cx("du_drawer_body", className)} {...rest} />;
}

/** Bottom section of a Drawer, separated by a pixel rule. */
export function DrawerFooter({ className, ...rest }: DrawerSectionProps) {
  return <div className={cx("du_drawer_footer", className)} {...rest} />;
}
