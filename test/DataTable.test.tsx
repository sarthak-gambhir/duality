import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DataTable,
  type DataTableColumn,
} from "../src/components/data_table/DataTable";

interface Row {
  name: string;
  score: number;
}

const data: Row[] = [
  { name: "Charlie", score: 30 },
  { name: "Alice", score: 10 },
  { name: "Bob", score: 20 },
];

const columns: DataTableColumn<Row>[] = [
  {
    id: "name",
    header: "Name",
    cell: (r) => r.name,
    value: (r) => r.name,
    sortable: true,
  },
  {
    id: "score",
    header: "Score",
    cell: (r) => r.score,
    value: (r) => r.score,
    sortable: true,
  },
];

function renderTable() {
  render(<DataTable columns={columns} data={data} aria-label="Scores" />);
}

describe("DataTable", () => {
  it("sorts a column ascending then descending on header clicks", async () => {
    const user = userEvent.setup();
    renderTable();
    const header = screen.getByRole("button", { name: /Name/ });
    const col = header.closest("th")!;
    expect(col).toHaveAttribute("aria-sort", "none");

    await user.click(header);
    expect(col).toHaveAttribute("aria-sort", "ascending");
    let cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells.map((c) => c.textContent)).toEqual([
      "Alice",
      "Bob",
      "Charlie",
    ]);

    await user.click(header);
    expect(col).toHaveAttribute("aria-sort", "descending");
    cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells.map((c) => c.textContent)).toEqual([
      "Charlie",
      "Bob",
      "Alice",
    ]);
  });

  it("filters rows live via the global filter", async () => {
    const user = userEvent.setup();
    renderTable();
    const filter = screen.getByRole("textbox", { name: "Filter Scores" });

    await user.type(filter, "ali");
    const cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells.map((c) => c.textContent)).toEqual(["Alice"]);
  });

  it("shows an empty message when nothing matches", async () => {
    const user = userEvent.setup();
    renderTable();
    await user.type(
      screen.getByRole("textbox", { name: "Filter Scores" }),
      "zzz",
    );
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("selects a row and toggles select-all", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowId={(r) => r.name}
        selectable
        onSelectionChange={onSelectionChange}
        aria-label="Scores"
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["Charlie"]);

    onSelectionChange.mockClear();
    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "Charlie",
      "Alice",
      "Bob",
    ]);
  });

  it("marks select-all indeterminate on a partial selection", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowId={(r) => r.name}
        selectable
        aria-label="Scores"
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }));
    const selectAll = screen.getByRole<HTMLInputElement>("checkbox", {
      name: "Select all rows",
    });
    expect(selectAll.indeterminate).toBe(true);
  });

  it("paginates rows and reports the range", async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 12 }).map((_, i) => ({
      name: `P${String(i).padStart(2, "0")}`,
      score: i,
    }));
    render(
      <DataTable
        columns={columns}
        data={many}
        getRowId={(r) => r.name}
        filterable={false}
        pageSize={5}
        aria-label="Scores"
      />,
    );
    expect(screen.getByText("1-5 of 12")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(1 + 5);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("6-10 of 12")).toBeInTheDocument();
  });

  it("renders skeleton rows while loading", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={[]}
        filterable={false}
        isLoading
        loadingRowCount={3}
        aria-label="Scores"
      />,
    );
    expect(container.querySelectorAll(".du_skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("row")).toHaveLength(1 + 3);
  });

  it("fires onRowClick when a row is activated", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowId={(r) => r.name}
        filterable={false}
        onRowClick={onRowClick}
        aria-label="Scores"
      />,
    );
    await user.click(screen.getByText("Charlie"));
    expect(onRowClick).toHaveBeenCalledWith({ name: "Charlie", score: 30 });
  });
});
