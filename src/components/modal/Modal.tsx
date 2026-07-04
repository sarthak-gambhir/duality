import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Portal } from '../../utils/Portal';
import { useDismiss } from '../../utils/useDismiss';
import { useFocusTrap } from '../../utils/useFocusTrap';

export interface ModalProps {
  /** Whether the modal is open. */
  isOpen: boolean;
  /** Called when the modal requests to close (backdrop press or Escape). */
  onClose: () => void;
  children: ReactNode;
  /** Accessible name (use when there is no visible titled header). */
  'aria-label'?: string;
  /** Id of the element labelling the dialog (e.g. a ModalHeader). */
  'aria-labelledby'?: string;
  /** Id of the element describing the dialog. */
  'aria-describedby'?: string;
  /** Close when the backdrop is pressed. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;
  /** Max width of the dialog in pixels. */
  maxWidth?: number;
  className?: string;
}

/** Accessible modal dialog rendered in a portal with a dithered backdrop. */
export function Modal({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  maxWidth = 480,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: ModalProps) {
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
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="du_modal_backdrop" data-du-overlay="">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          tabIndex={-1}
          className={cx('du_modal', className)}
          style={{ maxWidth }}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

export type ModalSectionProps = ComponentPropsWithoutRef<'div'>;

/** Top section of a Modal, separated by a pixel rule. */
export function ModalHeader({ className, ...rest }: ModalSectionProps) {
  return <div className={cx('du_modal_header', className)} {...rest} />;
}

/** Main content section of a Modal. */
export function ModalBody({ className, ...rest }: ModalSectionProps) {
  return <div className={cx('du_modal_body', className)} {...rest} />;
}

/** Bottom section of a Modal, separated by a pixel rule. */
export function ModalFooter({ className, ...rest }: ModalSectionProps) {
  return <div className={cx('du_modal_footer', className)} {...rest} />;
}
