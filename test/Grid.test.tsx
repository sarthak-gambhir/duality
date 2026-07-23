import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Grid } from "../src/components/grid/Grid";

describe("Grid", () => {
  it("builds a fixed repeat track from columns", () => {
    render(<Grid columns={3}>x</Grid>);
    const el = screen.getByText("x");
    expect(el).toHaveClass("du_grid");
    expect(el.style.getPropertyValue("--du-cols")).toBe(
      "repeat(3, minmax(0, 1fr))",
    );
  });

  it("clamps columns to a positive integer", () => {
    render(<Grid columns={0}>x</Grid>);
    expect(screen.getByText("x").style.getPropertyValue("--du-cols")).toBe(
      "repeat(1, minmax(0, 1fr))",
    );
  });

  it("uses an auto-fit track when minChildWidth is set", () => {
    render(
      <Grid columns={4} minChildWidth={160}>
        x
      </Grid>,
    );
    expect(screen.getByText("x").style.getPropertyValue("--du-cols")).toBe(
      "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
    );
  });

  it("maps align/justify items and forwards refs", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Grid ref={ref} align="center" justify="end">
        x
      </Grid>,
    );
    const el = screen.getByText("x");
    expect(el.style.alignItems).toBe("center");
    expect(el.style.justifyItems).toBe("end");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
