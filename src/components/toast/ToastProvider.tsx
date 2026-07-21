import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Portal } from "../../utils/Portal";
import { Alert } from "../alert/Alert";
import { Button } from "../button/Button";

export interface ToastAction {
  /** Button label. */
  label: string;
  /** Invoked when the action is pressed; the toast dismisses afterward. */
  onClick: () => void;
}

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  /** Severity, mirrors Alert tones. Defaults to info. */
  tone?: "info" | "success" | "warning" | "error";
  /** Auto-dismiss delay in ms; 0 disables auto-dismiss. Defaults to 5000. */
  duration?: number;
  /** Optional action button (e.g. Undo). */
  action?: ToastAction;
}

interface ToastItem
  extends Required<Pick<ToastOptions, "tone" | "duration">> {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
}

interface ToastContextValue {
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => string;
  /** Dismiss a toast by id. */
  dismiss: (id: string) => void;
  /** Dismiss all toasts. */
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>.");
  return ctx;
}

export type ToastPlacement =
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

export interface ToastProviderProps {
  children: ReactNode;
  /** Where the stack appears. Defaults to bottom-end. */
  placement?: ToastPlacement;
  /** Maximum simultaneously visible toasts; extras queue. Defaults to unlimited. */
  max?: number;
  /** Accessible name for the toast region. Defaults to "Notifications". */
  label?: string;
}

/** A single auto-dismissing toast that pauses its timer while `paused`. */
function ToastView({
  item,
  paused,
  onDismiss,
}: {
  item: ToastItem;
  paused: boolean;
  onDismiss: (id: string) => void;
}) {
  const remaining = useRef(item.duration);
  const dismiss = useCallback(() => onDismiss(item.id), [onDismiss, item.id]);

  useEffect(() => {
    if (item.duration <= 0 || paused) return undefined;
    const startedAt = Date.now();
    const timer = setTimeout(dismiss, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused, item.duration, dismiss]);

  const action = item.action;
  return (
    <div className="du_toast">
      <Alert
        tone={item.tone}
        title={item.title}
        onDismiss={dismiss}
        action={
          action ? (
            <Button
              size="sm"
              variant="inverse"
              onClick={() => {
                action.onClick();
                dismiss();
              }}
            >
              {action.label}
            </Button>
          ) : undefined
        }
      >
        {item.description}
      </Alert>
    </div>
  );
}

/** Provides `useToast()` and renders the toast stack in a portal. */
export function ToastProvider({
  children,
  placement = "bottom-end",
  max,
  label = "Notifications",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [paused, setPaused] = useState(false);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    const item: ToastItem = {
      id,
      tone: options.tone ?? "info",
      duration: options.duration ?? 5000,
      title: options.title,
      description: options.description,
      action: options.action,
    };
    setToasts((prev) => [...prev, item]);
    return id;
  }, []);

  const value = useMemo(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll],
  );

  // Newest toasts appear closest to the anchored edge; extras beyond `max` queue.
  const visible = max != null ? toasts.slice(-max) : toasts;
  const region = placement.replace("-", "_");
  // Errors interrupt (assertive); everything else announces politely.
  const assertive = visible.some((t) => t.tone === "error");

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible.length > 0 && (
        <Portal>
          <div
            role="region"
            aria-label={label}
            aria-live={assertive ? "assertive" : "polite"}
            className={`du_toast_region du_toast_region_${region}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {visible.map((t) => (
              <ToastView
                key={t.id}
                item={t}
                paused={paused}
                onDismiss={dismiss}
              />
            ))}
          </div>
        </Portal>
      )}
    </ToastContext.Provider>
  );
}
