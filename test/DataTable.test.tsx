import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
});
