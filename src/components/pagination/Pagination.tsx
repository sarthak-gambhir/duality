import { type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";
import { Button } from "../button/Button";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

export type PaginationVariant = "default" | "compact";

export interface PaginationProps extends Omit<
  ComponentPropsWithoutRef<"nav">,
  "onChange"
> {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  count: number;
  /** Called with the requested page. */
  onPageChange: (page: number) => void;
  /** Pages to show on each side of the current page. Defaults to 1. */
  siblingCount?: number;
  /** Pages always shown at the start and end. Defaults to 1. */
  boundaryCount?: number;
  /** Render first/last-page jump buttons. Defaults to false. */
  showEdges?: boolean;
  /** `compact` shows only prev/next with a "Page X of Y" readout. */
  variant?: PaginationVariant;
  /** Disable the entire control. */
  disabled?: boolean;
}

function buildRange(
  page: number,
  count: number,
  siblingCount: number,
  boundaryCount: number,
): Array<number | string> {
  // When every page fits within the windows (boundaries + current +/- siblings
  // + 2 ellipsis slots), show them all rather than collapsing.
  const totalSlots = boundaryCount * 2 + siblingCount * 2 + 3;
  if (count <= totalSlots) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  for (let i = 1; i <= Math.min(boundaryCount, count); i += 1) pages.add(i);
  for (let i = Math.max(count - boundaryCount + 1, 1); i <= count; i += 1) {
    pages.add(i);
  }
  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, count);
  for (let i = left; i <= right; i += 1) pages.add(i);

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | string> = [];
  let prev: number | undefined;
  for (const cur of sorted) {
    if (prev !== undefined) {
      // A single hidden page reads better as the number than an ellipsis.
      if (cur - prev === 2) result.push(prev + 1);
      else if (cur - prev > 2) result.push(`ellipsis_${cur}`);
    }
    result.push(cur);
    prev = cur;
  }
  return result;
}

/** Page navigation with prev/next and a windowed set of page buttons. */
export function Pagination({
  page,
  count,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showEdges = false,
  variant = "default",
  disabled = false,
  className,
  "aria-label": ariaLabel = "Pagination",
  ...rest
}: PaginationProps) {
  const icons = useIcons();
  const atStart = page <= 1;
  const atEnd = page >= count;

  return (
    <nav
      aria-label={ariaLabel}
      className={cx(
        "du_pagination",
        `du_pagination_${variant}`,
        className,
      )}
      {...rest}
    >
      <ul className="du_pagination_list">
        {showEdges && (
          <li>
            <Button
              variant="inverse"
              size="sm"
              aria-label="First page"
              disabled={disabled || atStart}
              onClick={() => onPageChange(1)}
            >
              <Icon icon={icons.firstPage} />
            </Button>
          </li>
        )}
        <li>
          <Button
            variant="inverse"
            size="sm"
            aria-label="Previous page"
            disabled={disabled || atStart}
            onClick={() => onPageChange(page - 1)}
          >
            <Icon icon={icons.chevronLeft} />
          </Button>
        </li>

        {variant === "compact" ? (
          <li>
            <span className="du_pagination_status" aria-current="page">
              Page {page} of {count}
            </span>
          </li>
        ) : (
          buildRange(page, count, siblingCount, boundaryCount).map(
            (item, index) => (
              <li
                key={
                  typeof item === "number" ? `p${item}` : `${item}_${index}`
                }
              >
                {typeof item === "number" ? (
                  <Button
                    variant={item === page ? "solid" : "inverse"}
                    size="sm"
                    aria-current={item === page ? "page" : undefined}
                    aria-label={`Page ${item}`}
                    disabled={disabled}
                    onClick={() => onPageChange(item)}
                  >
                    {item}
                  </Button>
                ) : (
                  <span className="du_pagination_ellipsis" aria-hidden="true">
                    <Icon icon={icons.more} />
                  </span>
                )}
              </li>
            ),
          )
        )}

        <li>
          <Button
            variant="inverse"
            size="sm"
            aria-label="Next page"
            disabled={disabled || atEnd}
            onClick={() => onPageChange(page + 1)}
          >
            <Icon icon={icons.chevronRight} />
          </Button>
        </li>
        {showEdges && (
          <li>
            <Button
              variant="inverse"
              size="sm"
              aria-label="Last page"
              disabled={disabled || atEnd}
              onClick={() => onPageChange(count)}
            >
              <Icon icon={icons.lastPage} />
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
}
