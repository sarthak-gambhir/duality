import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PaletteSelect } from "../src/components/theme_controls/PaletteSelect";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

function ThemeProbe() {
  const { theme } = useTheme();
  return <span data-testid="theme">{theme}</span>;
}

describe("PaletteSelect", () => {
  it("lists palettes and updates the active theme", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <PaletteSelect />
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("classic");
    expect(screen.getByRole("combobox", { name: "Palette" })).toHaveTextContent(
      "Classic",
    );

    await user.click(screen.getByRole("combobox", { name: "Palette" }));
    await user.click(screen.getByRole("option", { name: "Amber CRT" }));

    expect(screen.getByTestId("theme")).toHaveTextContent("amber");
  });
});
