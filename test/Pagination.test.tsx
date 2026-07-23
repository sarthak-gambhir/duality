import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "../src/components/pagination/Pagination";

describe("Pagination", () => {
  it("disables Prev on the first page and navigates", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={1} count={5} onPageChange={onPageChange} />);

    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("marks the current page with aria-current", () => {
    render(<Pagination page={2} count={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders first/last jumps when showEdges is set", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination page={5} count={20} showEdges onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "First page" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    await user.click(screen.getByRole("button", { name: "Last page" }));
    expect(onPageChange).toHaveBeenCalledWith(20);
  });

  it("shows a readout and no page buttons in compact variant", () => {
    render(
      <Pagination page={3} count={20} variant="compact" onPageChange={() => {}} />,
    );
    expect(screen.getByText("Page 3 of 20")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Page 3" }),
    ).not.toBeInTheDocument();
  });

  it("honors boundaryCount by always showing edge pages", () => {
    render(
      <Pagination
        page={10}
        count={20}
        boundaryCount={2}
        onPageChange={() => {}}
      />,
    );
    for (const name of ["Page 1", "Page 2", "Page 19", "Page 20"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("disables every control when disabled", () => {
    render(<Pagination page={2} count={5} disabled onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Page 3" })).toBeDisabled();
  });
});
