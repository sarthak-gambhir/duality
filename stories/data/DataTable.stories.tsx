import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Badge,
  DataTable,
  type DataTableColumn,
  type RowId,
} from "../../src";

const meta: Meta<typeof DataTable> = {
  title: "Data/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

interface Person {
  name: string;
  role: string;
  level: number;
  active: boolean;
}

const people: Person[] = [
  { name: "Ada Lovelace", role: "Engineer", level: 5, active: true },
  { name: "Alan Turing", role: "Researcher", level: 6, active: true },
  { name: "Grace Hopper", role: "Engineer", level: 6, active: false },
  { name: "Katherine Johnson", role: "Analyst", level: 4, active: true },
  { name: "Edsger Dijkstra", role: "Researcher", level: 5, active: false },
];

const columns: DataTableColumn<Person>[] = [
  {
    id: "name",
    header: "Name",
    cell: (p) => p.name,
    value: (p) => p.name,
    sortable: true,
  },
  {
    id: "role",
    header: "Role",
    cell: (p) => p.role,
    value: (p) => p.role,
    sortable: true,
  },
  {
    id: "level",
    header: "Level",
    cell: (p) => p.level,
    value: (p) => p.level,
    sortable: true,
    align: "end",
  },
  {
    id: "active",
    header: "Status",
    cell: (p) => (
      <Badge variant={p.active ? "solid" : "outline"}>
        {p.active ? "Active" : "Inactive"}
      </Badge>
    ),
    value: (p) => (p.active ? "active" : "inactive"),
  },
];

export const Default: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={people}
      getRowId={(p) => p.name}
      initialSort={{ columnId: "name", direction: "asc" }}
      aria-label="Team members"
    />
  ),
};

export const Selectable: Story = {
  render: function SelectableStory() {
    const [selected, setSelected] = useState<RowId[]>(["Ada Lovelace"]);
    return (
      <DataTable
        columns={columns}
        data={people}
        getRowId={(p) => p.name}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        aria-label="Team members"
      />
    );
  },
};

const manyPeople: Person[] = Array.from({ length: 23 }).map((_, i) => ({
  name: `Person ${String(i + 1).padStart(2, "0")}`,
  role: ["Engineer", "Researcher", "Analyst"][i % 3] as string,
  level: (i % 6) + 1,
  active: i % 2 === 0,
}));

export const Paginated: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={manyPeople}
      getRowId={(p) => p.name}
      pageSize={5}
      aria-label="Team members"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      isLoading
      aria-label="Team members"
    />
  ),
};

export const StickyAndClickable: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={manyPeople}
      getRowId={(p) => p.name}
      stickyHeader
      maxHeight={240}
      onRowClick={(p) => window.alert(`Clicked ${p.name}`)}
      aria-label="Team members"
    />
  ),
};
