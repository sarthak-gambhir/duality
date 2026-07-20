import type { Meta, StoryObj } from "@storybook/react";
import { Table, TBody, Td, Th, THead, Tr } from "../../src";

const meta: Meta<typeof Table> = {
  title: "Data/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

const rows = [
  { name: "Classic", ink: "#000000", surface: "#ffffff", count: 2 },
  { name: "Amber CRT", ink: "#ffb000", surface: "#0a0a0a", count: 12 },
  { name: "Phosphor", ink: "#33ff33", surface: "#001a00", count: 128 },
];

export const Default: Story = {
  render: () => (
    <Table>
      <THead>
        <Tr>
          <Th>Palette</Th>
          <Th>Ink</Th>
          <Th align="end">Uses</Th>
        </Tr>
      </THead>
      <TBody>
        {rows.map((r) => (
          <Tr key={r.name}>
            <Td>{r.name}</Td>
            <Td>{r.ink}</Td>
            <Td align="end">{r.count}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Table key={size} size={size}>
          <THead>
            <Tr>
              <Th>Palette</Th>
              <Th align="end">Uses</Th>
            </Tr>
          </THead>
          <TBody>
            {rows.map((r) => (
              <Tr key={r.name}>
                <Td>{r.name}</Td>
                <Td align="end">{r.count}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      ))}
    </div>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <caption>Palette usage</caption>
      <THead>
        <Tr>
          <Th>Palette</Th>
          <Th align="end">Uses</Th>
        </Tr>
      </THead>
      <TBody>
        {rows.map((r) => (
          <Tr key={r.name}>
            <Td>{r.name}</Td>
            <Td align="end">{r.count}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <div style={{ maxBlockSize: 200, overflow: "auto" }}>
      <Table stickyHeader>
        <THead>
          <Tr>
            <Th>Index</Th>
            <Th align="end">Value</Th>
          </Tr>
        </THead>
        <TBody>
          {Array.from({ length: 20 }).map((_, i) => (
            <Tr key={i}>
              <Td>Row {i + 1}</Td>
              <Td align="end">{(i + 1) * 3}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  ),
};
