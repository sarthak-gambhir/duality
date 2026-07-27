import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "../src/components/empty_state/EmptyState";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No results" />);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("renders the optional description and action", () => {
    render(
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
        action={<button type="button">New project</button>}
      />,
    );
    expect(
      screen.getByText("Create your first project to get started."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New project" }),
    ).toBeInTheDocument();
  });
});
