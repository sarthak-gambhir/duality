import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextureSelect } from "../src/components/theme_controls/TextureSelect";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

function TextureProbe() {
  const { texture } = useTheme();
  return <span data-testid="texture">{texture}</span>;
}

describe("TextureSelect", () => {
  it("reflects and updates the theme texture", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TextureSelect />
        <TextureProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("texture")).toHaveTextContent("dither");
    expect(screen.getByRole("combobox", { name: "Texture" })).toHaveTextContent(
      "Dither",
    );

    await user.click(screen.getByRole("combobox", { name: "Texture" }));
    await user.click(screen.getByRole("option", { name: "Hatch" }));

    expect(screen.getByTestId("texture")).toHaveTextContent("hatch");
  });
});
