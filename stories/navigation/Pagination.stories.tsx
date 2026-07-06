import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "../../src";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function Demo({ count }: { count: number }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} count={count} onPageChange={setPage} />;
}

export const Short: Story = { render: () => <Demo count={5} /> };
export const Long: Story = { render: () => <Demo count={20} /> };
