import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  idBase: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within <Accordion>.");
  return ctx;
}

export interface AccordionProps extends ComponentPropsWithoutRef<"div"> {
  /** `single` allows one open item; `multiple` allows many. Defaults to single. */
  type?: "single" | "multiple";
  /** Initially open item value(s). */
  defaultValue?: string | string[];
}

/** Vertically stacked, collapsible disclosure sections. */
export function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
  ...rest
}: AccordionProps) {
  const idBase = useId();
  const [open, setOpen] = useState<string[]>(() => {
    if (defaultValue == null) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const isOpen = (value: string) => open.includes(value);
  const toggle = (value: string) => {
    setOpen((prev) => {
      const has = prev.includes(value);
      if (type === "multiple") {
        return has ? prev.filter((v) => v !== value) : [...prev, value];
      }
      return has ? [] : [value];
    });
  };

  return (
    <AccordionContext.Provider value={{ isOpen, toggle, idBase }}>
      <div className={cx("du_accordion", className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "title"
> {
  /** Unique value identifying this section. */
  value: string;
  /** Header content. */
  title: ReactNode;
}

/** A single collapsible section within an Accordion. */
export function AccordionItem({
  value,
  title,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const ctx = useAccordion();
  const open = ctx.isOpen(value);
  const headerId = `${ctx.idBase}_header_${value}`;
  const panelId = `${ctx.idBase}_panel_${value}`;

  return (
    <div className={cx("du_accordion_item", className)} {...rest}>
      <h3 className="du_accordion_heading">
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          data-open={open || undefined}
          className="du_accordion_trigger"
          onClick={() => ctx.toggle(value)}
        >
          <span className="du_accordion_title">{title}</span>
          <span className="du_accordion_icon" aria-hidden="true" />
        </button>
      </h3>
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
