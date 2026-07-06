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

/**
 * Traps Tab focus within `containerRef` while `enabled`, moving initial focus
 * inside and restoring focus to the previously focused element on teardown.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const initial = focusable(container);
    (initial[0] ?? container).focus();

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

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [containerRef, enabled]);
}
