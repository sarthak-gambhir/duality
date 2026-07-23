import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "../../src";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          "Page navigation in a `nav` landmark. Renders prev/next controls plus a windowed set of page buttons, where `boundaryCount` pages are always shown at each end and `siblingCount` pages surround the current page (gaps become an ellipsis). Enable `showEdges` for first/last jumps. The `compact` variant replaces the page buttons with a `Page X of Y` readout. The current page is marked with `aria-current=\"page\"`.",
      },
    },
  },
  argTypes: {
    siblingCount: {
      control: "number",
      description: "Pages shown on each side of the current page.",
      table: { defaultValue: { summary: "1" } },
    },
    boundaryCount: {
      control: "number",
      description: "Pages always shown at the start and end.",
      table: { defaultValue: { summary: "1" } },
    },
    showEdges: {
      control: "boolean",
      description: "Render first/last-page jump buttons.",
      table: { defaultValue: { summary: "false" } },
    },
    variant: {
      control: "inline-radio",
      options: ["default", "compact"],
      description: "`compact` shows only prev/next with a 'Page X of Y' readout.",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disable the entire control.",
      table: { defaultValue: { summary: "false" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function Demo({
  count,
  ...rest
}: {
  count: number;
  siblingCount?: number;
  boundaryCount?: number;
  showEdges?: boolean;
  variant?: "default" | "compact";
  disabled?: boolean;
}) {
  const [page, setPage] = useState(1);
  return (
    <Pagination page={page} count={count} onPageChange={setPage} {...rest} />
  );
}

export const Short: Story = { render: () => <Demo count={5} /> };
export const Long: Story = { render: () => <Demo count={20} /> };

export const WithEdges: Story = {
  render: () => <Demo count={20} showEdges />,
};

export const WiderWindow: Story = {
  render: () => <Demo count={20} siblingCount={2} boundaryCount={2} />,
};

export const Compact: Story = {
  render: () => <Demo count={20} variant="compact" showEdges />,
};

export const Disabled: Story = {
  render: () => <Demo count={20} disabled />,
};
