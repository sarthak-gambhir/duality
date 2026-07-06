import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

function Probe() {
  const { theme, inverted, density, setTheme, toggleInverted, setDensity } =
    useTheme();
  return (
    <div>
      <span data-testid="state">
        {theme}:{String(inverted)}:{density}
      </span>
      <button onClick={() => setTheme("amber")}>amber</button>
      <button onClick={toggleInverted}>invert</button>
      <button onClick={() => setDensity("compact")}>compact</button>
    </div>
  );
}

describe("ThemeProvider persistence", () => {
  afterEach(() => window.localStorage.clear());

  it("writes theme and inversion to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider storageKey="du_test">
        <Probe />
      </ThemeProvider>,
    );

    await user.click(screen.getByText("amber"));
    await user.click(screen.getByText("invert"));
    await user.click(screen.getByText("compact"));

    const stored = JSON.parse(window.localStorage.getItem("du_test") as string);
    expect(stored).toEqual({
      theme: "amber",
      inverted: true,
      density: "compact",
    });
  });

  it("restores from localStorage on init", () => {
    window.localStorage.setItem(
      "du_test",
      JSON.stringify({ theme: "phosphor", inverted: true, density: "compact" }),
    );
    render(
      <ThemeProvider storageKey="du_test">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("state")).toHaveTextContent(
      "phosphor:true:compact",
    );
  });
});
