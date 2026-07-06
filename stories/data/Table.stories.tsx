import type { Meta, StoryObj } from "@storybook/react";
import { Table, TBody, Td, Th, THead, Tr } from "../../src";

const meta: Meta<typeof Table> = {
  title: "Data/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <THead>
        <Tr>
          <Th>Palette</Th>
          <Th>Ink</Th>
          <Th>Surface</Th>
        </Tr>
      </THead>
      <TBody>
        <Tr>
          <Td>Classic</Td>
          <Td>#000000</Td>
          <Td>#ffffff</Td>
        </Tr>
        <Tr>
          <Td>Amber CRT</Td>
          <Td>#ffb000</Td>
          <Td>#0a0a0a</Td>
        </Tr>
        <Tr>
          <Td>Phosphor</Td>
          <Td>#33ff33</Td>
          <Td>#001a00</Td>
        </Tr>
      </TBody>
    </Table>
  ),
};
