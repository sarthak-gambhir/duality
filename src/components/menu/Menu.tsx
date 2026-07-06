import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { useDismiss } from "../../utils/useDismiss";

interface MenuContextValue {
  close: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export type MenuPlacement = "bottom-start" | "bottom-end";

interface TriggerProps {
  onClick?: (event: MouseEvent) => void;
}

export interface MenuProps {
  /** Clickable trigger element. */
  trigger: ReactElement<TriggerProps>;
  /** MenuItem / MenuSeparator children. */
  children: ReactNode;
  /** Anchor position. Defaults to bottom-start. */
  placement?: MenuPlacement;
  /** Accessible name for the menu. */
  "aria-label"?: string;
  className?: string;
}

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

/** Dropdown menu with a button trigger and a keyboard-navigable listbox. */
export function Menu({
  trigger,
  children,
  placement = "bottom-start",
  "aria-label": ariaLabel,
  className,
}: MenuProps) {
  const [isOpen, setOpen] = useControllableState({ defaultValue: false });
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const menuId = `${id}_menu`;

  useDismiss({
    enabled: isOpen,
    onDismiss: () => setOpen(false),
    refs: [rootRef],
  });

  const items = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [],
    );

  useEffect(() => {
    if (isOpen) items()[0]?.focus();
  }, [isOpen]);

  const closeAndFocusTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = items();
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
        closeAndFocusTrigger();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const clonedTrigger = cloneElement(trigger, {
    ref: triggerRef,
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? menuId : undefined,
    onClick: (event: MouseEvent) => {
      trigger.props.onClick?.(event);
      setOpen(!isOpen);
    },
  } as TriggerProps & { ref: typeof triggerRef });

  return (
    <span ref={rootRef} className="du_menu_root">
      {clonedTrigger}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          id={menuId}
          aria-label={ariaLabel}
          className={cx(
            "du_menu",
            `du_menu_${placement.replace("-", "_")}`,
            className,
          )}
          onKeyDown={onMenuKeyDown}
        >
          <MenuContext.Provider value={{ close: closeAndFocusTrigger }}>
            {children}
          </MenuContext.Provider>
        </div>
      )}
    </span>
  );
}

export interface MenuItemProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "onSelect"
> {
  /** Called when the item is chosen; the menu closes afterward. */
  onSelect?: () => void;
  disabled?: boolean;
}

/** Selectable menu entry. */
export function MenuItem({
  onSelect,
  disabled,
  className,
  onClick,
  ...rest
}: MenuItemProps) {
  const menu = useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      className={cx("du_menu_item", className)}
      onClick={(event) => {
        if (disabled) return;
        onClick?.(event);
        onSelect?.();
        menu?.close();
      }}
      {...rest}
    />
  );
}

/** Divider between menu groups. */
export function MenuSeparator({
  className,
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      role="separator"
      className={cx("du_menu_separator", className)}
      {...rest}
    />
  );
}
