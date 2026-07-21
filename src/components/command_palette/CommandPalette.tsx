import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { IconType } from "react-icons";
import { cx } from "../../utils/cx";
import { Portal } from "../../utils/Portal";
import { useDismiss } from "../../utils/useDismiss";
import { useFocusTrap } from "../../utils/useFocusTrap";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import { Kbd } from "../kbd/Kbd";

export interface Command {
  /** Unique id. */
  id: string;
  /** Visible label. */
  label: string;
  /** Optional group heading the command is listed under. */
  group?: string;
  /** Extra terms to match against when filtering. */
  keywords?: string[];
  /** Optional leading icon. */
  icon?: IconType;
  /** Optional secondary description shown under the label. */
  description?: string;
  /** Keyboard shortcut hint, rendered as Kbd badges (e.g. ["Ctrl", "K"]). */
  shortcut?: string[];
  /** Invoked when the command is chosen. */
  onSelect: () => void;
  /** Disable the command (shown dithered, not selectable). */
  disabled?: boolean;
}

export interface CommandPaletteProps {
  /** Whether the palette is open. */
  isOpen: boolean;
  /** Called when the palette requests to close (Escape or outside press). */
  onClose: () => void;
  /** Commands to search and run. */
  commands: Command[];
  /** Ids surfaced under a "Recent" group when the query is empty. */
  recentIds?: string[];
  /** Placeholder for the search input. */
  placeholder?: string;
  /** Message shown when nothing matches. */
  emptyMessage?: string;
  /** Accessible name for the dialog. */
  "aria-label"?: string;
  className?: string;
}

function nextEnabledIndex(
  items: Command[],
  from: number,
  step: 1 | -1,
): number {
  const count = items.length;
  if (count === 0) return -1;
  let index = from;
  for (let i = 0; i < count; i += 1) {
    index = (index + step + count) % count;
    if (!items[index]?.disabled) return index;
  }
  return from;
}

/**
 * Searchable command menu in a portaled dialog. Type to filter, arrow keys to
 * move, Enter to run, Escape to close. Follows the two-color model.
 */
export function CommandPalette({
  isOpen,
  onClose,
  commands,
  recentIds,
  placeholder = "Type a command or search...",
  emptyMessage = "No commands",
  className,
  "aria-label": ariaLabel = "Command palette",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null);
  const setPanel = useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node;
    setPanelEl(node);
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const icons = useIcons();
  const optionRefs = useRef<Array<HTMLElement | null>>([]);

  const baseId = useId();
  const listboxId = `${baseId}_listbox`;
  const optionId = (index: number) => `${baseId}_option_${index}`;

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") {
      if (!recentIds?.length) return commands;
      // Surface recents first (in the given order), then the rest.
      const recent = recentIds
        .map((id) => commands.find((c) => c.id === id))
        .filter((c): c is Command => c != null)
        .map((c) => ({ ...c, group: "Recent" }));
      const recentSet = new Set(recent.map((c) => c.id));
      const rest = commands.filter((c) => !recentSet.has(c.id));
      return [...recent, ...rest];
    }
    return commands.filter((command) => {
      const haystack = [
        command.label,
        command.group ?? "",
        command.description ?? "",
        ...(command.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [commands, query, recentIds]);

  useDismiss({ enabled: isOpen, onDismiss: onClose, refs: [panelRef] });
  useFocusTrap(panelEl, isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;
    setQuery("");
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Keep the active option on the first enabled row whenever the list changes.
  useEffect(() => {
    setActiveIndex(nextEnabledIndex(items, -1, 1));
  }, [items]);

  useEffect(() => {
    optionRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex]);

  const run = (index: number) => {
    const command = items[index];
    if (!command || command.disabled) return;
    command.onSelect();
    onClose();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => nextEnabledIndex(items, index, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => nextEnabledIndex(items, index, -1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(nextEnabledIndex(items, -1, 1));
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(nextEnabledIndex(items, 0, -1));
        break;
      case "Enter":
        if (activeIndex >= 0) {
          event.preventDefault();
          run(activeIndex);
        }
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  let lastGroup: string | undefined;

  return (
    <Portal>
      <div className="du_command_backdrop" data-du-overlay="">
        <div
          ref={setPanel}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={cx("du_command", className)}
        >
          <div className="du_command_search">
            <Icon icon={icons.search} className="du_command_search_icon" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              autoFocus
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded
              aria-controls={listboxId}
              aria-activedescendant={
                activeIndex >= 0 ? optionId(activeIndex) : undefined
              }
              aria-label={ariaLabel}
              value={query}
              placeholder={placeholder}
              className="du_command_input"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>

          <ul id={listboxId} role="listbox" className="du_command_list">
            {items.length === 0 && (
              <li className="du_command_empty" aria-disabled="true">
                {emptyMessage}
              </li>
            )}
            {items.map((command, index) => {
              const showGroup = command.group && command.group !== lastGroup;
              lastGroup = command.group;
              return (
                <li
                  key={command.id}
                  role="presentation"
                  className="du_command_row"
                >
                  {showGroup && (
                    <span className="du_command_group" role="presentation">
                      {command.group}
                    </span>
                  )}
                  <button
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    type="button"
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    aria-disabled={command.disabled || undefined}
                    data-active={index === activeIndex || undefined}
                    className="du_command_option"
                    tabIndex={-1}
                    onMouseEnter={() =>
                      !command.disabled && setActiveIndex(index)
                    }
                    onClick={() => run(index)}
                  >
                    {command.icon && (
                      <Icon
                        icon={command.icon}
                        className="du_command_option_icon"
                      />
                    )}
                    <span className="du_command_option_text">
                      <span className="du_command_option_label">
                        {command.label}
                      </span>
                      {command.description && (
                        <span className="du_command_option_desc">
                          {command.description}
                        </span>
                      )}
                    </span>
                    {command.shortcut && command.shortcut.length > 0 && (
                      <span className="du_command_option_shortcut">
                        {command.shortcut.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="du_command_footer" aria-hidden="true">
            <span className="du_command_hint">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              navigate
            </span>
            <span className="du_command_hint">
              <Kbd>↵</Kbd>
              select
            </span>
            <span className="du_command_hint">
              <Kbd>esc</Kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </Portal>
  );
}
