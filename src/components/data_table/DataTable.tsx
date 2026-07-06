import { useMemo, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Table, TBody, THead, Td, Th, Tr } from "../table/Table";

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
  align?: "start" | "end";
}

type SortDirection = "asc" | "desc";

export interface DataTableProps<T> {
  /** Column definitions. */
  columns: DataTableColumn<T>[];
  /** Row data. */
  data: T[];
  /** Stable row key. Defaults to the row index. */
  getRowId?: (row: T, index: number) => string | number;
  /** Show the global filter input. Defaults to true. */
  filterable?: boolean;
  /** Placeholder for the filter input. */
  filterPlaceholder?: string;
  /** Initial sort state. */
  initialSort?: { columnId: string; direction: SortDirection };
  /** Message shown when no rows match. */
  emptyMessage?: string;
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
 * row type; sortable headers toggle asc -> desc -> none, and a live global
 * filter narrows rows. Two-color states throughout.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  filterable = true,
  filterPlaceholder = "Filter...",
  initialSort,
  emptyMessage = "No results",
  className,
  "aria-label": ariaLabel,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ id: string; dir: SortDirection } | null>(
    initialSort
      ? { id: initialSort.columnId, dir: initialSort.direction }
      : null,
  );

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

  const toggleSort = (id: string) => {
    setSort((current) => {
      if (current?.id !== id) return { id, dir: "asc" };
      if (current.dir === "asc") return { id, dir: "desc" };
      return null;
    });
  };

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

      <Table aria-label={ariaLabel}>
        <THead>
          <Tr>
            {columns.map((column) => {
              const isSorted = sort?.id === column.id;
              const canSort = column.sortable && column.value;
              return (
                <Th
                  key={column.id}
                  data-align={column.align}
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
                      <span
                        className="du_data_table_sort_icon"
                        aria-hidden="true"
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
          {sorted.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length} className="du_data_table_empty">
                {emptyMessage}
              </Td>
            </Tr>
          ) : (
            sorted.map((row, index) => (
              <Tr key={getRowId ? getRowId(row, index) : index}>
                {columns.map((column) => (
                  <Td key={column.id} data-align={column.align}>
                    {column.cell(row)}
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
