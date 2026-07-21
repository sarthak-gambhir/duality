import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

export interface FocusTrapOptions {
  /** Element to focus when the trap activates (defaults to the first focusable). */
  initialFocus?: RefObject<HTMLElement | null>;
  /**
   * Where to send focus on teardown. A ref focuses that element; `false`
   * disables restoring. Defaults to the element focused before activation.
   */
  returnFocus?: RefObject<HTMLElement | null> | boolean;
}

/**
 * Traps Tab focus within `container` while `enabled`, moving initial focus
 * inside and restoring focus to the previously focused element on teardown.
 * Takes the element (not a ref) so it engages once a portaled node attaches.
 */
export function useFocusTrap(
  container: HTMLElement | null,
  enabled: boolean,
  options: FocusTrapOptions = {},
): void {
  const { initialFocus, returnFocus } = options;
  useEffect(() => {
    if (!enabled || !container) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const initial = focusable(container);
    (initialFocus?.current ?? initial[0] ?? container).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable(container);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Resolve the return target ref at teardown so it points to the latest node.
    // `false` is handled by the early return below; a ref resolves to its
    // current node, and any other case restores the previously focused element.
    const resolveReturnTarget = () =>
      returnFocus && returnFocus !== true
        ? returnFocus.current
        : previouslyFocused;

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      if (returnFocus === false) return;
      resolveReturnTarget()?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, enabled]);
}
