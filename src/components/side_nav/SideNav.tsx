import { useId, type ReactElement, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { useDisclosure } from "../../utils/useDisclosure";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import { Tooltip } from "../tooltip/Tooltip";

export interface SideNavItem {
  /** Stable identity, matched against `activeId`. */
  id: string;
  label: ReactNode;
  /** Optional leading glyph. */
  icon?: ReactNode;
  /** Optional trailing adornment (count, tag, etc.). */
  badge?: ReactNode;
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
  /** Make the section heading a toggle that collapses its items. */
  collapsible?: boolean;
  /** Initial collapsed state when `collapsible`. Defaults to false. */
  defaultCollapsed?: boolean;
}

export interface SideNavProps {
  /** Grouped items with optional headings. */
  sections?: SideNavSection[];
  /** Flat list of items (used when `sections` is omitted). */
  items?: SideNavItem[];
  /** Id of the current item; gets `aria-current="page"` and inverts. */
  activeId?: string;
  /**
   * Rail mode: show each item's label (and badge) as a hover/focus tooltip.
   * Pair with a collapsed `Sidebar`, which visually hides the inline labels.
   */
  collapsed?: boolean;
  /** Accessible name for the nav landmark. */
  "aria-label"?: string;
  className?: string;
}

function Item({
  item,
  activeId,
  collapsed,
}: {
  item: SideNavItem;
  activeId?: string;
  collapsed?: boolean;
}) {
  const isActive = item.id === activeId;
  const className = cx(
    "du_side_nav_item",
    isActive && "du_side_nav_item_active",
  );

  const body = (
    <>
      {item.icon != null && (
        <span className="du_side_nav_icon" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="du_side_nav_label">{item.label}</span>
      {item.badge != null && (
        <span className="du_side_nav_badge">{item.badge}</span>
      )}
    </>
  );

  const anchor: ReactElement =
    item.href && !item.disabled ? (
      <a
        href={item.href}
        className={className}
        aria-current={isActive ? "page" : undefined}
      >
        {body}
      </a>
    ) : (
      <button
        type="button"
        className={className}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={item.disabled || undefined}
        disabled={item.disabled}
        onClick={item.disabled ? undefined : item.onSelect}
      >
        {body}
      </button>
    );

  // In the collapsed rail only the glyph is visible, so surface the label (and
  // its badge) as a hover/focus tooltip to keep items identifiable.
  if (collapsed) {
    return (
      <li>
        <Tooltip
          placement="right"
          content={
            <span className="du_side_nav_tooltip">
              {item.label}
              {item.badge != null && (
                <span className="du_side_nav_tooltip_badge">{item.badge}</span>
              )}
            </span>
          }
        >
          {anchor}
        </Tooltip>
      </li>
    );
  }

  return <li>{anchor}</li>;
}

function Section({
  section,
  activeId,
  collapsed,
}: {
  section: SideNavSection;
  activeId?: string;
  collapsed?: boolean;
}) {
  const listId = useId();
  const disclosure = useDisclosure(!section.defaultCollapsed);
  const icons = useIcons();
  const expanded = disclosure.isOpen;
  const collapsible = Boolean(section.collapsible);

  const list = (
    <ul id={listId} className="du_side_nav_list" hidden={collapsible && !expanded}>
      {section.items.map((item) => (
        <Item
          key={item.id}
          item={item}
          activeId={activeId}
          collapsed={collapsed}
        />
      ))}
    </ul>
  );

  return (
    <div className="du_side_nav_section">
      {section.label != null &&
        (collapsible ? (
          <button
            type="button"
            className="du_side_nav_heading du_side_nav_heading_button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={disclosure.toggle}
          >
            <span>{section.label}</span>
            <Icon
              icon={expanded ? icons.chevronDown : icons.chevronRight}
              className="du_side_nav_heading_icon"
            />
          </button>
        ) : (
          <div className="du_side_nav_heading">{section.label}</div>
        ))}
      {list}
    </div>
  );
}

/** Sidebar navigation with optional section headings and an active item. */
export function SideNav({
  sections,
  items,
  activeId,
  collapsed,
  "aria-label": ariaLabel = "Sidebar",
  className,
}: SideNavProps) {
  const resolved: SideNavSection[] =
    sections ?? (items ? [{ id: "default", items }] : []);

  return (
    <nav aria-label={ariaLabel} className={cx("du_side_nav", className)}>
      {resolved.map((section) => (
        <Section
          key={section.id}
          section={section}
          activeId={activeId}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}
