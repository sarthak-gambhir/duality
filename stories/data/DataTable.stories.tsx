import type { Meta, StoryObj } from '@storybook/react';
import { Badge, DataTable, type DataTableColumn } from '../../src';

const meta: Meta<typeof DataTable> = {
  title: 'Data/DataTable',
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
  { name: 'Ada Lovelace', role: 'Engineer', level: 5, active: true },
  { name: 'Alan Turing', role: 'Researcher', level: 6, active: true },
  { name: 'Grace Hopper', role: 'Engineer', level: 6, active: false },
  { name: 'Katherine Johnson', role: 'Analyst', level: 4, active: true },
  { name: 'Edsger Dijkstra', role: 'Researcher', level: 5, active: false },
];

const columns: DataTableColumn<Person>[] = [
  { id: 'name', header: 'Name', cell: (p) => p.name, value: (p) => p.name, sortable: true },
  { id: 'role', header: 'Role', cell: (p) => p.role, value: (p) => p.role, sortable: true },
  {
    id: 'level',
    header: 'Level',
    cell: (p) => p.level,
    value: (p) => p.level,
    sortable: true,
    align: 'end',
  },
  {
    id: 'active',
    header: 'Status',
    cell: (p) => <Badge variant={p.active ? 'solid' : 'outline'}>{p.active ? 'Active' : 'Inactive'}</Badge>,
    value: (p) => (p.active ? 'active' : 'inactive'),
  },
];

export const Default: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={people}
      getRowId={(p) => p.name}
      initialSort={{ columnId: 'name', direction: 'asc' }}
      aria-label="Team members"
    />
  ),
};
