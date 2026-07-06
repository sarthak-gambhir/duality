import { useEffect, type RefObject } from "react";

export interface UseDismissOptions {
  /** Whether the dismissable element is currently open. */
  enabled: boolean;
  /** Called when the user requests dismissal (outside click or Escape). */
  onDismiss: () => void;
  /** Refs that should NOT count as "outside" (e.g. the trigger and the panel). */
  refs: Array<RefObject<HTMLElement | null>>;
  /** Dismiss on Escape. Defaults to true. */
  escape?: boolean;
  /** Dismiss on outside pointer press. Defaults to true. */
  outsidePress?: boolean;
}

/** Closes a floating element on outside pointer press and/or Escape. */
export function useDismiss({
  enabled,
  onDismiss,
  refs,
  escape = true,
  outsidePress = true,
}: UseDismissOptions): void {
  useEffect(() => {
    if (!enabled) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      if (!outsidePress) return;
      const target = event.target as Node;
      const inside = refs.some((ref) => ref.current?.contains(target));
      if (!inside) onDismiss();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (escape && event.key === "Escape") onDismiss();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, onDismiss, escape, outsidePress]);
}
