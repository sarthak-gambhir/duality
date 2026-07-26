import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

function ThemeProbe() {
  const { theme, density, texture, setTheme, setDensity, setTexture } =
    useTheme();
  return (
    <div>
      <span data-testid="state">
        {theme}:{density}:{texture}
      </span>
      <button onClick={() => setTheme("amber")}>to amber</button>
      <button onClick={() => setDensity("compact")}>compact</button>
      <button onClick={() => setTexture("hatch")}>hatch</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("renders a theme root with data attributes", () => {
    const { container } = render(
      <ThemeProvider>
        <span>hi</span>
      </ThemeProvider>,
    );
    const root = container.querySelector(".du_theme_root");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("data-theme")).toBe("classic");
    expect(root?.getAttribute("data-density")).toBe("comfortable");
    expect(root?.getAttribute("data-texture")).toBe("dither");
  });

  it("honors default theme, density, and texture", () => {
    const { container } = render(
      <ThemeProvider
        defaultTheme="phosphor"
        defaultDensity="compact"
        defaultTexture="hatch"
      >
        <span>hi</span>
      </ThemeProvider>,
    );
    const root = container.querySelector(".du_theme_root");
    expect(root?.getAttribute("data-theme")).toBe("phosphor");
    expect(root?.getAttribute("data-density")).toBe("compact");
    expect(root?.getAttribute("data-texture")).toBe("hatch");
  });

  it("updates theme, density, and texture via context", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("state")).toHaveTextContent(
      "classic:comfortable:dither",
    );
    await user.click(screen.getByText("to amber"));
    expect(screen.getByTestId("state")).toHaveTextContent(
      "amber:comfortable:dither",
    );
    await user.click(screen.getByText("compact"));
    expect(screen.getByTestId("state")).toHaveTextContent("amber:compact:dither");
    await user.click(screen.getByText("hatch"));
    expect(screen.getByTestId("state")).toHaveTextContent("amber:compact:hatch");
  });

  it("persists and restores texture via storageKey", async () => {
    const user = userEvent.setup();
    const storageKey = "duality-texture-test";
    window.localStorage.removeItem(storageKey);

    const first = render(
      <ThemeProvider storageKey={storageKey}>
        <ThemeProbe />
      </ThemeProvider>,
    );
    await user.click(screen.getByText("hatch"));
    expect(screen.getByTestId("state")).toHaveTextContent(
      "classic:comfortable:hatch",
    );
    first.unmount();

    render(
      <ThemeProvider storageKey={storageKey}>
        <ThemeProbe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("state")).toHaveTextContent(
      "classic:comfortable:hatch",
    );
    window.localStorage.removeItem(storageKey);
  });

  it("throws when useTheme is used outside a provider", () => {
    function Orphan() {
      useTheme();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(/within a <ThemeProvider>/);
  });
});
