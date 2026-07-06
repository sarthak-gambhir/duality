import { type ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface SideNavItem {
  /** Stable identity, matched against `activeId`. */
  id: string;
  label: ReactNode;
  /** Render as a link when set; otherwise a button. */
  href?: string;
  /** Called when a button item is chosen. */
  onSelect?: () => void;
  disabled?: boolean;
}

export interface SideNavSection {
  /** Stable identity. */
  id: string;
  /** Optional section heading. */
  label?: ReactNode;
  items: SideNavItem[];
}

export interface SideNavProps {
  /** Grouped items with optional headings. */
  sections?: SideNavSection[];
  /** Flat list of items (used when `sections` is omitted). */
  items?: SideNavItem[];
  /** Id of the current item; gets `aria-current="page"` and inverts. */
  activeId?: string;
  /** Accessible name for the nav landmark. */
  "aria-label"?: string;
  className?: string;
}

function Item({ item, activeId }: { item: SideNavItem; activeId?: string }) {
  const isActive = item.id === activeId;
  const className = cx(
    "du_side_nav_item",
    isActive && "du_side_nav_item_active",
  );

  if (item.href && !item.disabled) {
    return (
      <li>
        <a
          href={item.href}
          className={className}
          aria-current={isActive ? "page" : undefined}
        >
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        className={className}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={item.disabled || undefined}
        disabled={item.disabled}
        onClick={item.disabled ? undefined : item.onSelect}
      >
        {item.label}
      </button>
    </li>
  );
}

/** Sidebar navigation with optional section headings and an active item. */
export function SideNav({
  sections,
  items,
  activeId,
  "aria-label": ariaLabel = "Sidebar",
  className,
}: SideNavProps) {
  const resolved: SideNavSection[] =
    sections ?? (items ? [{ id: "default", items }] : []);

  return (
    <nav aria-label={ariaLabel} className={cx("du_side_nav", className)}>
      {resolved.map((section) => (
        <div key={section.id} className="du_side_nav_section">
          {section.label != null && (
            <div className="du_side_nav_heading">{section.label}</div>
          )}
          <ul className="du_side_nav_list">
            {section.items.map((item) => (
              <Item key={item.id} item={item} activeId={activeId} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
