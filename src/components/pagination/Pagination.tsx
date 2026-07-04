import { type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../button/Button';

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  count: number;
  /** Called with the requested page. */
  onPageChange: (page: number) => void;
  /** Pages to show on each side of the current page. Defaults to 1. */
  siblingCount?: number;
}

function buildRange(page: number, count: number, siblingCount: number): Array<number | string> {
  const total = siblingCount * 2 + 5;
  if (count <= total) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, count);

  const pages = new Set<number>([1, count]);
  for (let i = left; i <= right; i += 1) pages.add(i);
  const sorted = [...pages].sort((a, b) => a - b);

  const result: Array<number | string> = [];
  let prev: number | undefined;
  for (const cur of sorted) {
    if (prev !== undefined && cur - prev > 1) result.push(`ellipsis_${cur}`);
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
  className,
  'aria-label': ariaLabel = 'Pagination',
  ...rest
}: PaginationProps) {
  const items = buildRange(page, count, siblingCount);

  return (
    <nav aria-label={ariaLabel} className={cx('du_pagination', className)} {...rest}>
      <ul className="du_pagination_list">
        <li>
          <Button
            variant="inverse"
            size="sm"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </Button>
        </li>
        {items.map((item, index) => (
          <li key={typeof item === 'number' ? `p${item}` : `${item}_${index}`}>
            {typeof item === 'number' ? (
              <Button
                variant={item === page ? 'solid' : 'inverse'}
                size="sm"
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            ) : (
              <span className="du_pagination_ellipsis" aria-hidden="true">
                ...
              </span>
            )}
          </li>
        ))}
        <li>
          <Button
            variant="inverse"
            size="sm"
            aria-label="Next page"
            disabled={page >= count}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </li>
      </ul>
    </nav>
  );
}
