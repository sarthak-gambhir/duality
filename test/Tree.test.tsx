import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tree, type TreeNode } from "../src/components/tree/Tree";

const items: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "button", label: "Button.tsx" },
      { id: "tree", label: "Tree.tsx" },
    ],
  },
  { id: "license", label: "LICENSE" },
];

describe("Tree", () => {
  it("renders a tree and shows children only when expanded", () => {
    render(<Tree items={items} label="Files" />);
    expect(screen.getByRole("tree", { name: "Files" })).toBeInTheDocument();
    expect(screen.getByRole("treeitem", { name: /src/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      screen.queryByRole("treeitem", { name: /Button\.tsx/ }),
    ).not.toBeInTheDocument();
  });

  it("expands with ArrowRight and reveals children", async () => {
    const user = userEvent.setup();
    render(<Tree items={items} label="Files" />);
    const src = screen.getByRole("treeitem", { name: /src/ });
    src.focus();
    await user.keyboard("{ArrowRight}");
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("treeitem", { name: /Button\.tsx/ }),
    ).toBeInTheDocument();
  });

  it("selects a node on click", async () => {
    const onSelectedChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Tree
        items={items}
        label="Files"
        defaultExpanded={["src"]}
        onSelectedChange={onSelectedChange}
      />,
    );
    await user.click(screen.getByRole("treeitem", { name: /Button\.tsx/ }));
    expect(onSelectedChange).toHaveBeenCalledWith("button");
    expect(
      screen.getByRole("treeitem", { name: /Button\.tsx/ }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("expands all parents with defaultExpandAll", () => {
    render(<Tree items={items} label="Files" defaultExpandAll />);
    expect(
      screen.getByRole("treeitem", { name: /Button\.tsx/ }),
    ).toBeInTheDocument();
  });

  it("moves focus to a matching node via typeahead", async () => {
    const user = userEvent.setup();
    render(<Tree items={items} label="Files" defaultExpandAll />);
    const src = screen.getByRole("treeitem", { name: /^src/ });
    src.focus();
    await user.keyboard("l");
    expect(screen.getByRole("treeitem", { name: "LICENSE" })).toHaveFocus();
  });

  it("renders a per-node icon", () => {
    render(
      <Tree
        items={[{ id: "a", label: "Alpha", icon: <span>ICON</span> }]}
        label="Files"
      />,
    );
    expect(screen.getByText("ICON")).toBeInTheDocument();
  });
});
