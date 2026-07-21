import { useId, useRef, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Button } from "../button/Button";
import { Spinner } from "../spinner/Spinner";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/Modal";

export interface ConfirmDialogProps {
  /** Whether the dialog is open. */
  isOpen: boolean;
  /** Called when the user confirms. May be async; buttons show pending state. */
  onConfirm: () => void | Promise<void>;
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
  tone?: "default" | "danger";
  /** Force the pending state (e.g. when confirmation is driven externally). */
  isLoading?: boolean;
  /** Close on backdrop press. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;
  className?: string;
}

/**
 * Confirmation dialog built on Modal. Focuses the confirm action on open
 * (Cancel for destructive actions) and shows a pending state for async confirms.
 */
export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  isLoading = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);
  const baseId = useId();
  const titleId = `${baseId}_title`;
  const descId = `${baseId}_desc`;

  const busy = pending || isLoading;
  const isDanger = tone === "danger";

  const handleConfirm = async () => {
    const result = onConfirm();
    if (result instanceof Promise) {
      setPending(true);
      try {
        await result;
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={busy ? () => {} : onCancel}
      role={isDanger ? "alertdialog" : "dialog"}
      aria-labelledby={titleId}
      aria-describedby={description != null ? descId : undefined}
      maxWidth={420}
      closeOnBackdrop={closeOnBackdrop && !busy}
      closeOnEscape={closeOnEscape && !busy}
      // Destructive actions focus Cancel first as a safety default.
      initialFocusRef={isDanger ? cancelRef : confirmRef}
      className={cx(
        "du_confirm_dialog",
        `du_confirm_dialog_${tone}`,
        className,
      )}
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
        <Button
          ref={cancelRef}
          variant="ghost"
          disabled={busy}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          ref={confirmRef}
          className="du_confirm_dialog_confirm"
          disabled={busy}
          onClick={handleConfirm}
        >
          {busy ? (
            <span className="du_confirm_dialog_pending">
              <Spinner size="sm" label="Working" />
              {confirmLabel}
            </span>
          ) : (
            confirmLabel
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
