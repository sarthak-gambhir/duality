import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Portal } from "../../utils/Portal";
import { clampToViewport } from "../../utils/floating";
import { useDismiss } from "../../utils/useDismiss";

export interface ContextMenuItem {
  /** Stable identity. */
  id: string;
  /** Visible label (omit for separators). */
  label?: ReactNode;
  /** Called when the item is chosen; the menu closes afterward. */
  onSelect?: () => void;
  disabled?: boolean;
  /** Render a divider instead of an actionable row. */
  separator?: boolean;
}

export interface ContextMenuProps {
  /** Menu rows to show at the cursor. */
  items: ContextMenuItem[];
  /** Region that opens the menu on right-click. */
  children: ReactNode;
  /** Accessible name for the menu. */
  "aria-label"?: string;
  className?: string;
}

/** Right-click menu opened at the cursor, clamped to the viewport. */
export function ContextMenu({
  items,
  children,
  "aria-label": ariaLabel = "Context menu",
  className,
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  // Raw viewport (client) coordinates of the triggering right-click.
  const clickRef = useRef({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);
  // Tracked as state (not just a ref) so the positioning effect re-runs once the
  // menu node is actually attached. The Portal mounts its children a tick late,
  // so on the initial open `menuRef.current` is still null in a layout effect.
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null);
  // Element focused before the menu opened, restored on Escape for parity with Menu.
  const previousFocus = useRef<HTMLElement | null>(null);
  const setMenu = useCallback((node: HTMLDivElement | null) => {
    menuRef.current = node;
    setMenuEl(node);
  }, []);

  useDismiss({
    enabled: open,
    onDismiss: () => setOpen(false),
    refs: [menuRef],
  });

  const openAt = (event: MouseEvent) => {
    event.preventDefault();
    previousFocus.current = document.activeElement as HTMLElement | null;
    clickRef.current = { x: event.clientX, y: event.clientY };
    // Start at the raw client coords; the layout effect corrects for any
    // transformed containing block after measuring the rendered menu.
    setPos({ x: event.clientX, y: event.clientY });
    setOpen(true);
  };

  const closeAndRestoreFocus = () => {
    setOpen(false);
    previousFocus.current?.focus?.();
  };

  // The menu is `position: fixed`, so its inset values live in the coordinate
  // space of its containing block. That is normally the viewport, but a
  // transformed ancestor (e.g. Storybook's zoom canvas) becomes the containing
  // block instead and shifts/scales it. We render once at the raw client
  // coordinates, measure where the menu actually landed, and correct by the
  // measured delta (divided by the ancestor's scale) so it sits under the
  // cursor and stays clamped to the viewport - regardless of any transform.
  useLayoutEffect(() => {
    if (!open || !menuEl) return;
    const el = menuEl;

    const { x: clientX, y: clientY } = clickRef.current;
    const rect = el.getBoundingClientRect();
    const scaleX = el.offsetWidth ? rect.width / el.offsetWidth : 1;
    const scaleY = el.offsetHeight ? rect.height / el.offsetHeight : 1;

    // Desired on-screen position: at the cursor, clamped to the viewport.
    const { left: targetLeft, top: targetTop } = clampToViewport(
      { x: clientX, y: clientY },
      { width: rect.width, height: rect.height },
      { width: window.innerWidth, height: window.innerHeight },
    );

    // Adjust our inset by the (scale-corrected) gap between where we want the
    // menu and where it currently renders.
    setPos((prev) => {
      const x = prev.x + (targetLeft - rect.left) / scaleX;
      const y = prev.y + (targetTop - rect.top) / scaleY;
      return x === prev.x && y === prev.y ? prev : { x, y };
    });

    el.querySelector<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"])',
    )?.focus();
  }, [open, menuEl]);

  const focusableItems = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ) ?? [],
    );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = focusableItems();
    const index = list.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        list[(index + 1) % list.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        list[(index - 1 + list.length) % list.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        list[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        list[list.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        closeAndRestoreFocus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const select = (item: ContextMenuItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    setOpen(false);
  };

  return (
    <>
      <div
        className={cx("du_context_menu_target", className)}
        onContextMenu={openAt}
      >
        {children}
      </div>
      {open && (
        <Portal>
          <div
            ref={setMenu}
            role="menu"
            aria-label={ariaLabel}
            className="du_menu du_context_menu"
            style={{ left: pos.x, top: pos.y }}
            onKeyDown={onKeyDown}
          >
            {items.map((item) =>
              item.separator ? (
                <div
                  key={item.id}
                  role="separator"
                  className="du_menu_separator"
                />
              ) : (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={item.disabled || undefined}
                  className="du_menu_item"
                  onClick={() => select(item)}
                >
                  {item.label}
                </button>
              ),
            )}
          </div>
        </Portal>
      )}
    </>
  );
}
