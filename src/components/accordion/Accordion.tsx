import {
  createContext,
  useContext,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import { useControllableState } from "../../utils/useControllableState";

export type AccordionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  idBase: string;
  headingLevel: AccordionHeadingLevel;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within <Accordion>.");
  return ctx;
}

function toArray(value: string | string[] | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export interface AccordionProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  /** `single` allows one open item; `multiple` allows many. Defaults to single. */
  type?: "single" | "multiple";
  /** Open item value(s) (controlled). */
  value?: string | string[];
  /** Initially open item value(s) (uncontrolled). */
  defaultValue?: string | string[];
  /** Called with the open value(s): a string in single mode, array in multiple. */
  onValueChange?: (value: string | string[]) => void;
  /**
   * In single mode, whether the open item can be collapsed by re-clicking it.
   * When false, one item is always open. Defaults to true.
   */
  collapsible?: boolean;
  /** Heading element level wrapping each trigger, 1-6. Defaults to 3. */
  headingLevel?: AccordionHeadingLevel;
}

/** Vertically stacked, collapsible disclosure sections. */
export function Accordion({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  headingLevel = 3,
  className,
  children,
  ...rest
}: AccordionProps) {
  const idBase = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useControllableState<string[]>({
    value: value !== undefined ? toArray(value) : undefined,
    defaultValue: toArray(defaultValue),
    onChange: (next) => onValueChange?.(type === "single" ? next[0] ?? "" : next),
  });

  const isOpen = (v: string) => open.includes(v);
  const toggle = (v: string) => {
    setOpen((prev) => {
      const has = prev.includes(v);
      if (type === "multiple") {
        return has ? prev.filter((x) => x !== v) : [...prev, v];
      }
      // single
      if (has) return collapsible ? [] : prev;
      return [v];
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-accordion-trigger]:not([disabled])",
      ) ?? [],
    );
    const index = triggers.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    if (index < 0) return;

    let next = -1;
    if (event.key === "ArrowDown") next = (index + 1) % triggers.length;
    else if (event.key === "ArrowUp")
      next = (index - 1 + triggers.length) % triggers.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = triggers.length - 1;

    const target = triggers[next];
    if (next >= 0 && target) {
      event.preventDefault();
      target.focus();
    }
  };

  return (
    <AccordionContext.Provider value={{ isOpen, toggle, idBase, headingLevel }}>
      <div
        ref={listRef}
        className={cx("du_accordion", className)}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Unique value identifying this section. */
  value: string;
  /** Header content. */
  title: ReactNode;
  /** Disable opening/closing and focus for this section. */
  disabled?: boolean;
}

/** A single collapsible section within an Accordion. */
export function AccordionItem({
  value,
  title,
  disabled,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const ctx = useAccordion();
  const icons = useIcons();
  const open = ctx.isOpen(value);
  const headerId = `${ctx.idBase}_header_${value}`;
  const panelId = `${ctx.idBase}_panel_${value}`;
  const Heading = `h${ctx.headingLevel}` as const;

  return (
    <div
      className={cx("du_accordion_item", className)}
      data-disabled={disabled || undefined}
      {...rest}
    >
      <Heading className="du_accordion_heading">
        <button
          type="button"
          id={headerId}
          data-accordion-trigger=""
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          data-open={open || undefined}
          className="du_accordion_trigger"
          onClick={() => ctx.toggle(value)}
        >
          <span className="du_accordion_title">{title}</span>
          <Icon
            icon={open ? icons.chevronDown : icons.chevronRight}
            className="du_accordion_icon"
          />
        </button>
      </Heading>
      <div
        role="region"
        id={panelId}
        aria-labelledby={headerId}
        hidden={!open}
        className="du_accordion_panel"
      >
        {open && children}
      </div>
    </div>
  );
}
