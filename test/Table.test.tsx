import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table, TBody, Td, Th, THead, Tr } from "../src/components/table/Table";

describe("Table", () => {
  it("applies the size class", () => {
    const { container } = render(
      <Table size="lg">
        <TBody>
          <Tr>
            <Td>x</Td>
          </Tr>
        </TBody>
      </Table>,
    );
    expect(container.querySelector("table")).toHaveClass("du_table_lg");
  });

  it("applies the sticky header class", () => {
    const { container } = render(
      <Table stickyHeader>
        <TBody>
          <Tr>
            <Td>x</Td>
          </Tr>
        </TBody>
      </Table>,
    );
    expect(container.querySelector("table")).toHaveClass("du_table_sticky");
  });

  it("maps the align prop to data-align on cells", () => {
    const { getByText } = render(
      <Table>
        <THead>
          <Tr>
            <Th align="center">H</Th>
          </Tr>
        </THead>
        <TBody>
          <Tr>
            <Td align="end">C</Td>
          </Tr>
        </TBody>
      </Table>,
    );
    expect(getByText("H")).toHaveAttribute("data-align", "center");
    expect(getByText("C")).toHaveAttribute("data-align", "end");
  });
});
