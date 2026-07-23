import {
  Fragment,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import { Link } from "../link/Link";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  /** Optional leading glyph shown before the label. */
  icon?: ReactNode;
  /** Called on activation (for SPA routing without a full `href`). */
  onClick?: (event: MouseEvent) => void;
}

export interface BreadcrumbsProps extends ComponentPropsWithoutRef<"nav"> {
  /** Ordered crumbs from root to current page. */
  items: BreadcrumbItem[];
  /** Separator between crumbs. Defaults to a chevron icon. */
  separator?: ReactNode;
  /** Collapse the middle when the trail exceeds this many crumbs. */
  maxItems?: number;
  /** Crumbs kept at the start when collapsed. Defaults to 1. */
  itemsBeforeCollapse?: number;
  /** Crumbs kept at the end when collapsed. Defaults to 1. */
  itemsAfterCollapse?: number;
}

type DisplayEntry =
  | { type: "item"; item: BreadcrumbItem; index: number }
  | { type: "overflow" };

/**
 * Builds the visible crumb sequence, collapsing the middle into a single
 * overflow marker when `maxItems` is exceeded. The first and current crumbs
 * are always preserved.
 */
function buildEntries(
  items: BreadcrumbItem[],
  maxItems: number | undefined,
  before: number,
  after: number,
): DisplayEntry[] {
  const all: DisplayEntry[] = items.map((item, index) => ({
    type: "item",
    item,
    index,
  }));

  if (!maxItems || items.length <= maxItems || before + after >= items.length) {
    return all;
  }

  return [
    ...all.slice(0, before),
    { type: "overflow" },
    ...all.slice(items.length - after),
  ];
}

/** Hierarchical navigation trail; the last crumb is the current page. */
export function Breadcrumbs({
  items,
  separator,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  className,
  "aria-label": ariaLabel = "Breadcrumb",
  ...rest
}: BreadcrumbsProps) {
  const icons = useIcons();
  const sep = separator ?? <Icon icon={icons.chevronRight} />;
  const lastIndex = items.length - 1;
  const entries = buildEntries(
    items,
    maxItems,
    itemsBeforeCollapse,
    itemsAfterCollapse,
  );

  return (
    <nav
      aria-label={ariaLabel}
      className={cx("du_breadcrumbs", className)}
      {...rest}
    >
      <ol className="du_breadcrumbs_list">
        {entries.map((entry, position) => {
          const isLastEntry = position === entries.length - 1;

          if (entry.type === "overflow") {
            return (
              <Fragment key="overflow">
                <li className="du_breadcrumbs_item du_breadcrumbs_overflow">
                  <Icon icon={icons.more} aria-label="Hidden crumbs" />
                </li>
                {!isLastEntry && (
                  <li aria-hidden="true" className="du_breadcrumbs_separator">
                    {sep}
                  </li>
                )}
              </Fragment>
            );
          }

          const { item, index } = entry;
          const isCurrent = index === lastIndex;
          const content = (
            <>
              {item.icon != null && (
                <span className="du_breadcrumbs_icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </>
          );

          let crumb: ReactNode;
          if (isCurrent) {
            crumb = (
              <span className="du_breadcrumbs_item_content" aria-current="page">
                {content}
              </span>
            );
          } else if (item.href) {
            crumb = (
              <Link
                href={item.href}
                className="du_breadcrumbs_item_content"
                onClick={item.onClick}
              >
                {content}
              </Link>
            );
          } else if (item.onClick) {
            crumb = (
              <button
                type="button"
                className="du_breadcrumbs_item_content du_breadcrumbs_action"
                onClick={item.onClick}
              >
                {content}
              </button>
            );
          } else {
            crumb = <span className="du_breadcrumbs_item_content">{content}</span>;
          }

          return (
            <Fragment key={index}>
              <li className="du_breadcrumbs_item">{crumb}</li>
              {!isLastEntry && (
                <li aria-hidden="true" className="du_breadcrumbs_separator">
                  {sep}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
