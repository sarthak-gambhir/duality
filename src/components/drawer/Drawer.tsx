import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { cx } from "../../utils/cx";
import { Portal } from "../../utils/Portal";
import { useDismiss } from "../../utils/useDismiss";
import { useFocusTrap } from "../../utils/useFocusTrap";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

export type DrawerSide = "start" | "end" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "full";

interface DrawerContextValue {
  onClose: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

const SIZE_PRESET: Record<DrawerSize, number | string> = {
  sm: 280,
  md: 320,
  lg: 420,
  full: "100%",
};

function resolveSize(size: DrawerSize | number | string): number | string {
  return typeof size === "string" && size in SIZE_PRESET
    ? SIZE_PRESET[size as DrawerSize]
    : size;
}

export interface DrawerProps {
  /** Whether the drawer is open. */
  isOpen: boolean;
  /** Called when the drawer requests to close (backdrop press or Escape). */
  onClose: () => void;
  children: ReactNode;
  /** Edge the panel is anchored to. Defaults to `end`. */
  side?: DrawerSide;
  /** Panel size: a preset (`sm`/`md`/`lg`/`full`), px number, or CSS length. */
  size?: DrawerSize | number | string;
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
  /** Convenience: when false, disables both backdrop and Escape dismissal. */
  isDismissable?: boolean;
  /** Render a close (X) button in the header corner. Defaults to false. */
  showCloseButton?: boolean;
  /** Element to focus when the drawer opens (defaults to first focusable). */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Element to focus when the drawer closes (defaults to the prior element). */
  finalFocusRef?: RefObject<HTMLElement | null>;
  /** Lock body scroll while open. Defaults to true. */
  lockScroll?: boolean;
  className?: string;
}

/** Accessible edge-anchored panel (Sheet) rendered in a portal over a dithered scrim. */
export function Drawer({
  isOpen,
  onClose,
  children,
  side = "end",
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  isDismissable,
  showCloseButton = false,
  initialFocusRef,
  finalFocusRef,
  lockScroll = true,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [dialogEl, setDialogEl] = useState<HTMLDivElement | null>(null);
  const setDialog = useCallback((node: HTMLDivElement | null) => {
    dialogRef.current = node;
    setDialogEl(node);
  }, []);
  const dismissable = isDismissable ?? true;

  useDismiss({
    enabled: isOpen,
    onDismiss: onClose,
    refs: [dialogRef],
    escape: dismissable && closeOnEscape,
    outsidePress: dismissable && closeOnBackdrop,
  });

  useFocusTrap(dialogEl, isOpen, {
    initialFocus: initialFocusRef,
    returnFocus: finalFocusRef ?? true,
  });

  useEffect(() => {
    if (!isOpen || !lockScroll) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen, lockScroll]);

  if (!isOpen) return null;

  const horizontal = side === "start" || side === "end";
  const resolved = resolveSize(size);
  const style: CSSProperties = horizontal
    ? { inlineSize: resolved }
    : { blockSize: resolved };

  return (
    <Portal>
      <div className="du_drawer_backdrop" data-du-overlay="">
        <div
          ref={setDialog}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          tabIndex={-1}
          className={cx("du_drawer", `du_drawer_${side}`, className)}
          style={style}
        >
          <DrawerContext.Provider value={{ onClose }}>
            {children}
            {showCloseButton && <DrawerCloseButton />}
          </DrawerContext.Provider>
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

export interface DrawerCloseButtonProps
  extends ComponentPropsWithoutRef<"button"> {
  label?: string;
}

/** Corner close button; closes the surrounding Drawer when pressed. */
export function DrawerCloseButton({
  label = "Close",
  className,
  onClick,
  ...rest
}: DrawerCloseButtonProps) {
  const ctx = useContext(DrawerContext);
  const icons = useIcons();
  return (
    <button
      type="button"
      aria-label={label}
      className={cx("du_drawer_close", className)}
      onClick={(event) => {
        onClick?.(event);
        ctx?.onClose();
      }}
      {...rest}
    >
      <Icon icon={icons.close} />
    </button>
  );
}
