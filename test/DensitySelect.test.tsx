import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DensitySelect } from "../src/components/theme_controls/DensitySelect";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

function DensityProbe() {
  const { density } = useTheme();
  return <span data-testid="density">{density}</span>;
}

describe("DensitySelect", () => {
  it("reflects and updates the theme density", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <DensitySelect />
        <DensityProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("density")).toHaveTextContent("comfortable");
    expect(screen.getByRole("combobox", { name: "Density" })).toHaveTextContent(
      "Comfortable",
    );

    await user.click(screen.getByRole("combobox", { name: "Density" }));
    await user.click(screen.getByRole("option", { name: "Compact" }));

    expect(screen.getByTestId("density")).toHaveTextContent("compact");
  });
});
