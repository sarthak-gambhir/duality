import { Fragment, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Link } from "../link/Link";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends ComponentPropsWithoutRef<"nav"> {
  /** Ordered crumbs from root to current page. */
  items: BreadcrumbItem[];
  /** Separator between crumbs. Defaults to a slash. */
  separator?: ReactNode;
}

/** Hierarchical navigation trail; the last crumb is the current page. */
export function Breadcrumbs({
  items,
  separator = "/",
  className,
  "aria-label": ariaLabel = "Breadcrumb",
  ...rest
}: BreadcrumbsProps) {
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
                  {separator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
