import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Portal } from '../../utils/Portal';
import { Alert } from '../alert/Alert';

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  /** Severity, mirrors Alert tones. Defaults to info. */
  tone?: 'info' | 'warning' | 'error';
  /** Auto-dismiss delay in ms; 0 disables auto-dismiss. Defaults to 5000. */
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, 'tone' | 'duration'>> {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
}

interface ToastContextValue {
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => string;
  /** Dismiss a toast by id. */
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>.');
  return ctx;
}

export type ToastPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

export interface ToastProviderProps {
  children: ReactNode;
  /** Where the stack appears. Defaults to bottom-end. */
  placement?: ToastPlacement;
}

/** Provides `useToast()` and renders the toast stack in a portal. */
export function ToastProvider({ children, placement = 'bottom-end' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = {
        id,
        tone: options.tone ?? 'info',
        duration: options.duration ?? 5000,
        title: options.title,
        description: options.description,
      };
      setToasts((prev) => [...prev, item]);
      if (item.duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), item.duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <Portal>
          <div className={`du_toast_region du_toast_region_${placement.replace('-', '_')}`}>
            {toasts.map((t) => (
              <div key={t.id} className="du_toast">
                <Alert tone={t.tone} title={t.title}>
                  {t.description}
                </Alert>
                <button
                  type="button"
                  aria-label="Dismiss"
                  className="du_toast_close"
                  onClick={() => dismiss(t.id)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </Portal>
      )}
    </ToastContext.Provider>
  );
}
