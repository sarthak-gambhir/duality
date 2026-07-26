import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

function Probe() {
  const { theme, density, texture, setTheme, setDensity, setTexture } =
    useTheme();
  return (
    <div>
      <span data-testid="state">
        {theme}:{density}:{texture}
      </span>
      <button onClick={() => setTheme("amber")}>amber</button>
      <button onClick={() => setDensity("compact")}>compact</button>
      <button onClick={() => setTexture("hatch")}>hatch</button>
    </div>
  );
}

describe("ThemeProvider persistence", () => {
  afterEach(() => window.localStorage.clear());

  it("writes theme, density, and texture to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider storageKey="du_test">
        <Probe />
      </ThemeProvider>,
    );

    await user.click(screen.getByText("amber"));
    await user.click(screen.getByText("compact"));
    await user.click(screen.getByText("hatch"));

    const stored = JSON.parse(window.localStorage.getItem("du_test") as string);
    expect(stored).toEqual({
      theme: "amber",
      density: "compact",
      texture: "hatch",
    });
  });

  it("restores from localStorage on init", () => {
    window.localStorage.setItem(
      "du_test",
      JSON.stringify({ theme: "phosphor", density: "compact", texture: "hatch" }),
    );
    render(
      <ThemeProvider storageKey="du_test">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("state")).toHaveTextContent(
      "phosphor:compact:hatch",
    );
  });
});
