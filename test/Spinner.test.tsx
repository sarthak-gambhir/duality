import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "../src/components/spinner/Spinner";

describe("Spinner", () => {
  it("exposes a status role with a default loading label", () => {
    render(<Spinner />);
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByText("Saving")).toBeInTheDocument();
  });
});
