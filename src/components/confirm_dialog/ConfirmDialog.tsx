import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../button/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../modal/Modal';

export interface ConfirmDialogProps {
  /** Whether the dialog is open. */
  isOpen: boolean;
  /** Called when the user confirms. */
  onConfirm: () => void;
  /** Called when the user cancels (button, backdrop, or Escape). */
  onCancel: () => void;
  /** Dialog heading. */
  title: ReactNode;
  /** Explanatory body text. */
  description?: ReactNode;
  /** Confirm button label. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Cancel button label. Defaults to "Cancel". */
  cancelLabel?: string;
  /** `danger` signals a destructive action via a heavier confirm border. */
  tone?: 'default' | 'danger';
  className?: string;
}

/** Confirmation dialog built on Modal; focuses the confirm action on open. */
export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  className,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const baseId = useId();
  const titleId = `${baseId}_title`;
  const descId = `${baseId}_desc`;

  // Runs after Modal's focus trap (child effect first), so the confirm button
  // ends up focused rather than the leading Cancel button.
  useEffect(() => {
    if (isOpen) confirmRef.current?.focus();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      aria-labelledby={titleId}
      aria-describedby={description != null ? descId : undefined}
      maxWidth={420}
      className={cx('du_confirm_dialog', `du_confirm_dialog_${tone}`, className)}
    >
      <ModalHeader>
        <div id={titleId} className="du_confirm_dialog_title">
          {title}
        </div>
      </ModalHeader>
      {description != null && (
        <ModalBody>
          <div id={descId}>{description}</div>
        </ModalBody>
      )}
      <ModalFooter>
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button ref={confirmRef} className="du_confirm_dialog_confirm" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
