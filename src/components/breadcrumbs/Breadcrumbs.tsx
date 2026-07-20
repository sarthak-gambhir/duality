import { Fragment, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import { Link } from "../link/Link";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends ComponentPropsWithoutRef<"nav"> {
  /** Ordered crumbs from root to current page. */
  items: BreadcrumbItem[];
  /** Separator between crumbs. Defaults to a chevron icon. */
  separator?: ReactNode;
}

/** Hierarchical navigation trail; the last crumb is the current page. */
export function Breadcrumbs({
  items,
  separator,
  className,
  "aria-label": ariaLabel = "Breadcrumb",
  ...rest
}: BreadcrumbsProps) {
  const icons = useIcons();
  const sep = separator ?? <Icon icon={icons.chevronRight} />;
  return (
    <nav
      aria-label={ariaLabel}
      className={cx("du_breadcrumbs", className)}
      {...rest}
    >
      <ol className="du_breadcrumbs_list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              <li className="du_breadcrumbs_item">
                {isLast || !item.href ? (
                  <span aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
              {!isLast && (
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
