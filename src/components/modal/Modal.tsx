import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from "react";
import { cx } from "../../utils/cx";
import { Portal } from "../../utils/Portal";
import { useDismiss } from "../../utils/useDismiss";
import { useFocusTrap } from "../../utils/useFocusTrap";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export interface ModalProps {
  /** Whether the modal is open. */
  isOpen: boolean;
  /** Called when the modal requests to close (backdrop press or Escape). */
  onClose: () => void;
  children: ReactNode;
  /** Accessible name (use when there is no visible titled header). */
  "aria-label"?: string;
  /** Id of the element labelling the dialog (e.g. a ModalHeader). */
  "aria-labelledby"?: string;
  /** Id of the element describing the dialog. */
  "aria-describedby"?: string;
  /** Dialog role. Use `alertdialog` for urgent confirmations. Defaults to dialog. */
  role?: "dialog" | "alertdialog";
  /** Width preset. Defaults to md. Ignored when `maxWidth` is set. */
  size?: ModalSize;
  /** Close when the backdrop is pressed. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;
  /** Convenience: when false, disables both backdrop and Escape dismissal. */
  isDismissable?: boolean;
  /** Render a close (X) button in the top corner. Defaults to false. */
  showCloseButton?: boolean;
  /** Element to focus when the modal opens (defaults to first focusable). */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Element to focus when the modal closes (defaults to the prior element). */
  finalFocusRef?: RefObject<HTMLElement | null>;
  /** Lock body scroll while open. Defaults to true. */
  lockScroll?: boolean;
  /** Max width of the dialog in pixels. Overrides `size`. */
  maxWidth?: number;
  className?: string;
}

/** Accessible modal dialog rendered in a portal with a dithered backdrop. */
export function Modal({
  isOpen,
  onClose,
  children,
  role = "dialog",
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  isDismissable,
  showCloseButton = false,
  initialFocusRef,
  finalFocusRef,
  lockScroll = true,
  maxWidth,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: ModalProps) {
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

  return (
    <Portal>
      <div className="du_modal_backdrop" data-du-overlay="">
        <div
          ref={setDialog}
          role={role}
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          tabIndex={-1}
          className={cx("du_modal", `du_modal_size_${size}`, className)}
          style={maxWidth != null ? { maxWidth } : undefined}
        >
          <ModalContext.Provider value={{ onClose }}>
            {children}
            {showCloseButton && <ModalCloseButton />}
          </ModalContext.Provider>
        </div>
      </div>
    </Portal>
  );
}

export type ModalSectionProps = ComponentPropsWithoutRef<"div">;

/** Top section of a Modal, separated by a pixel rule. */
export function ModalHeader({ className, ...rest }: ModalSectionProps) {
  return <div className={cx("du_modal_header", className)} {...rest} />;
}

/** Main content section of a Modal. */
export function ModalBody({ className, ...rest }: ModalSectionProps) {
  return <div className={cx("du_modal_body", className)} {...rest} />;
}

/** Bottom section of a Modal, separated by a pixel rule. */
export function ModalFooter({ className, ...rest }: ModalSectionProps) {
  return <div className={cx("du_modal_footer", className)} {...rest} />;
}

export interface ModalCloseButtonProps
  extends ComponentPropsWithoutRef<"button"> {
  label?: string;
}

/** Corner close button; closes the surrounding Modal when pressed. */
export function ModalCloseButton({
  label = "Close",
  className,
  onClick,
  ...rest
}: ModalCloseButtonProps) {
  const ctx = useContext(ModalContext);
  const icons = useIcons();
  return (
    <button
      type="button"
      aria-label={label}
      className={cx("du_modal_close", className)}
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
