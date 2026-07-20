import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { Checkbox } from "../checkbox/Checkbox";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";
import { Pagination } from "../pagination/Pagination";
import { Skeleton } from "../skeleton/Skeleton";
import { Table, TBody, THead, Td, Th, Tr } from "../table/Table";

export type RowId = string | number;

export interface DataTableColumn<T> {
  /** Unique column id. */
  id: string;
  /** Header content. */
  header: ReactNode;
  /** Renders the cell for a row. */
  cell: (row: T) => ReactNode;
  /**
   * Comparable/searchable value for a row. Required for a column to be
   * sortable or included in the global filter.
   */
  value?: (row: T) => string | number;
  /** Allow sorting on this column (needs `value`). */
  sortable?: boolean;
  /** Text alignment of the column. */
  align?: "start" | "end" | "center";
}

type SortDirection = "asc" | "desc";

export interface DataTableProps<T> {
  /** Column definitions. */
  columns: DataTableColumn<T>[];
  /** Row data. */
  data: T[];
  /** Stable row key. Defaults to the row index. */
  getRowId?: (row: T, index: number) => RowId;
  /** Show the global filter input. Defaults to true. */
  filterable?: boolean;
  /** Placeholder for the filter input. */
  filterPlaceholder?: string;
  /** Initial sort state. */
  initialSort?: { columnId: string; direction: SortDirection };
  /** Message shown when no rows match. */
  emptyMessage?: string;
  /** Enable a leading selection checkbox column. */
  selectable?: boolean;
  /** Selected row ids (controlled). */
  selectedIds?: RowId[];
  /** Initially selected row ids (uncontrolled). */
  defaultSelectedIds?: RowId[];
  /** Called with the new set of selected ids. */
  onSelectionChange?: (ids: RowId[]) => void;
  /** Rows per page. Enables client-side pagination when set. */
  pageSize?: number;
  /** Called when a row is activated (click / Enter / Space). */
  onRowClick?: (row: T) => void;
  /** Show placeholder skeleton rows instead of data. */
  isLoading?: boolean;
  /** Number of skeleton rows when loading. Defaults to 5. */
  loadingRowCount?: number;
  /** Pin the header while the body scrolls. */
  stickyHeader?: boolean;
  /** Max height of the scroll container (used with `stickyHeader`). */
  maxHeight?: number | string;
  /** Cell padding scale, forwarded to the underlying table. */
  size?: "sm" | "md" | "lg";
  /** Accessible name for the table. */
  "aria-label"?: string;
  className?: string;
}

const ariaSortValue = {
  asc: "ascending",
  desc: "descending",
} as const;

/**
 * Sortable, filterable table built on the Table primitives. Generic over the
 * row type; sortable headers toggle asc -> desc -> none, a live global filter
 * narrows rows, and optional selection / pagination / loading states layer on
 * top. Two-color states throughout.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  filterable = true,
  filterPlaceholder = "Filter...",
  initialSort,
  emptyMessage = "No results",
  selectable = false,
  selectedIds,
  defaultSelectedIds,
  onSelectionChange,
  pageSize,
  onRowClick,
  isLoading = false,
  loadingRowCount = 5,
  stickyHeader = false,
  maxHeight,
  size,
  className,
  "aria-label": ariaLabel,
}: DataTableProps<T>) {
  const icons = useIcons();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ id: string; dir: SortDirection } | null>(
    initialSort
      ? { id: initialSort.columnId, dir: initialSort.direction }
      : null,
  );
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useControllableState<RowId[]>({
    value: selectedIds,
    defaultValue: defaultSelectedIds ?? [],
    onChange: onSelectionChange,
  });

  const rowIds = useMemo(() => {
    const map = new Map<T, RowId>();
    data.forEach((row, index) => {
      map.set(row, getRowId ? getRowId(row, index) : index);
    });
    return map;
  }, [data, getRowId]);
  const rowIdOf = (row: T): RowId => rowIds.get(row) ?? -1;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return data;
    const searchable = columns.filter((column) => column.value);
    return data.filter((row) =>
      searchable.some((column) =>
        String(column.value!(row)).toLowerCase().includes(q),
      ),
    );
  }, [data, columns, query]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((c) => c.id === sort.id);
    if (!column?.value) return filtered;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = column.value!(a);
      const vb = column.value!(b);
      if (typeof va === "number" && typeof vb === "number")
        return (va - vb) * factor;
      return String(va).localeCompare(String(vb)) * factor;
    });
  }, [filtered, sort, columns]);

  // Reset to the first page whenever the visible result set changes shape.
  useEffect(() => {
    setPage(1);
  }, [query, sort, pageSize]);

  const total = sorted.length;
  const pageCount = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const safePage = Math.min(page, pageCount);
  const pageRows = pageSize
    ? sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
    : sorted;

  const toggleSort = (id: string) => {
    setSort((current) => {
      if (current?.id !== id) return { id, dir: "asc" };
      if (current.dir === "asc") return { id, dir: "desc" };
      return null;
    });
  };

  const selectedSet = useMemo(() => new Set(selection), [selection]);
  const filteredIds = useMemo(
    () => sorted.map((row) => rowIds.get(row) ?? -1),
    [sorted, rowIds],
  );
  const allSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedSet.has(id));
  const someSelected =
    !allSelected && filteredIds.some((id) => selectedSet.has(id));

  const toggleAll = () => {
    if (allSelected) {
      const remove = new Set(filteredIds);
      setSelection(selection.filter((id) => !remove.has(id)));
    } else {
      const next = new Set(selection);
      filteredIds.forEach((id) => next.add(id));
      setSelection([...next]);
    }
  };

  const toggleRow = (id: RowId) => {
    setSelection(
      selectedSet.has(id)
        ? selection.filter((x) => x !== id)
        : [...selection, id],
    );
  };

  const totalColumns = columns.length + (selectable ? 1 : 0);

  const onRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick?.(row);
    }
  };

  const rangeStart = total === 0 ? 0 : (safePage - 1) * (pageSize ?? total) + 1;
  const rangeEnd = pageSize ? Math.min(safePage * pageSize, total) : total;

  const table = (
    <Table aria-label={ariaLabel} size={size} stickyHeader={stickyHeader}>
      <THead>
        <Tr>
          {selectable && (
            <Th className="du_data_table_select_cell">
              <Checkbox
                aria-label="Select all rows"
                checked={allSelected}
                indeterminate={someSelected}
                disabled={isLoading || total === 0}
                onChange={toggleAll}
              />
            </Th>
          )}
          {columns.map((column) => {
            const isSorted = sort?.id === column.id;
            const canSort = column.sortable && column.value;
            return (
              <Th
                key={column.id}
                align={column.align}
                aria-sort={
                  canSort
                    ? isSorted
                      ? ariaSortValue[sort.dir]
                      : "none"
                    : undefined
                }
              >
                {canSort ? (
                  <button
                    type="button"
                    className="du_data_table_sort"
                    data-direction={isSorted ? sort.dir : undefined}
                    onClick={() => toggleSort(column.id)}
                  >
                    <span>{column.header}</span>
                    <Icon
                      icon={
                        isSorted
                          ? sort.dir === "asc"
                            ? icons.sortAsc
                            : icons.sortDesc
                          : icons.sortNone
                      }
                      className="du_data_table_sort_icon"
                    />
                  </button>
                ) : (
                  column.header
                )}
              </Th>
            );
          })}
        </Tr>
      </THead>
      <TBody>
        {isLoading ? (
          Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
            <Tr key={`skeleton_${rowIndex}`}>
              {selectable && (
                <Td className="du_data_table_select_cell">
                  <Skeleton width={16} height={16} />
                </Td>
              )}
              {columns.map((column) => (
                <Td key={column.id} align={column.align}>
                  <Skeleton />
                </Td>
              ))}
            </Tr>
          ))
        ) : pageRows.length === 0 ? (
          <Tr>
            <Td colSpan={totalColumns} className="du_data_table_empty">
              {emptyMessage}
            </Td>
          </Tr>
        ) : (
          pageRows.map((row, rowIndex) => {
            const id = rowIdOf(row);
            const isSelected = selectedSet.has(id);
            return (
              <Tr
                key={id}
                data-selected={isSelected || undefined}
                data-interactive={onRowClick ? "" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick ? (event) => onRowKeyDown(event, row) : undefined
                }
              >
                {selectable && (
                  <Td className="du_data_table_select_cell">
                    <Checkbox
                      aria-label={`Select row ${rangeStart + rowIndex}`}
                      checked={isSelected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleRow(id)}
                    />
                  </Td>
                )}
                {columns.map((column) => (
                  <Td key={column.id} align={column.align}>
                    {column.cell(row)}
                  </Td>
                ))}
              </Tr>
            );
          })
        )}
      </TBody>
    </Table>
  );

  return (
    <div className={cx("du_data_table", className)}>
      {filterable && (
        <input
          type="text"
          value={query}
          placeholder={filterPlaceholder}
          aria-label={ariaLabel ? `Filter ${ariaLabel}` : "Filter table"}
          className="du_data_table_filter"
          onChange={(event) => setQuery(event.target.value)}
        />
      )}

      {stickyHeader || maxHeight != null ? (
        <div
          className="du_data_table_scroll"
          style={
            maxHeight != null
              ? ({
                  maxBlockSize:
                    typeof maxHeight === "number"
                      ? `${maxHeight}px`
                      : maxHeight,
                } as CSSProperties)
              : undefined
          }
        >
          {table}
        </div>
      ) : (
        table
      )}

      {pageSize && total > 0 && !isLoading && (
        <div className="du_data_table_footer">
          <span className="du_data_table_summary" aria-live="polite">
            {rangeStart}-{rangeEnd} of {total}
          </span>
          <Pagination
            page={safePage}
            count={pageCount}
            onPageChange={setPage}
            aria-label={
              ariaLabel ? `${ariaLabel} pagination` : "Table pagination"
            }
          />
        </div>
      )}
    </div>
  );
}
