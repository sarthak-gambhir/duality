import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Portal } from '../../utils/Portal';
import { useDismiss } from '../../utils/useDismiss';

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
  'aria-label'?: string;
  className?: string;
}

/** Right-click menu opened at the cursor, clamped to the viewport. */
export function ContextMenu({
  items,
  children,
  'aria-label': ariaLabel = 'Context menu',
  className,
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useDismiss({ enabled: open, onDismiss: () => setOpen(false), refs: [menuRef] });

  const openAt = (event: MouseEvent) => {
    event.preventDefault();
    setCoords({ x: event.clientX, y: event.clientY });
    setOpen(true);
  };

  // Clamp into the viewport and focus the first item once measured.
  useLayoutEffect(() => {
    if (!open) return;
    const el = menuRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    setCoords((prev) => {
      const x = Math.max(0, Math.min(prev.x, maxX));
      const y = Math.max(0, Math.min(prev.y, maxY));
      return x === prev.x && y === prev.y ? prev : { x, y };
    });
    el.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus();
  }, [open]);

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
      case 'ArrowDown':
        event.preventDefault();
        list[(index + 1) % list.length]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        list[(index - 1 + list.length) % list.length]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        list[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        list[list.length - 1]?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
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
      <div className={cx('du_context_menu_target', className)} onContextMenu={openAt}>
        {children}
      </div>
      {open && (
        <Portal>
          <div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            className="du_menu du_context_menu"
            style={{ insetInlineStart: coords.x, insetBlockStart: coords.y }}
            onKeyDown={onKeyDown}
          >
            {items.map((item) =>
              item.separator ? (
                <div key={item.id} role="separator" className="du_menu_separator" />
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
