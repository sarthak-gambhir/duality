import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

function ThemeProbe() {
  const { theme, inverted, setTheme, toggleInverted } = useTheme();
  return (
    <div>
      <span data-testid="state">
        {theme}:{String(inverted)}
      </span>
      <button onClick={() => setTheme("amber")}>to amber</button>
      <button onClick={toggleInverted}>invert</button>
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
    expect(root?.getAttribute("data-inverted")).toBe("false");
  });

  it("honors default theme and inversion", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="phosphor" defaultInverted>
        <span>hi</span>
      </ThemeProvider>,
    );
    const root = container.querySelector(".du_theme_root");
    expect(root?.getAttribute("data-theme")).toBe("phosphor");
    expect(root?.getAttribute("data-inverted")).toBe("true");
  });

  it("updates theme and inversion via context", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("state")).toHaveTextContent("classic:false");
    await user.click(screen.getByText("to amber"));
    expect(screen.getByTestId("state")).toHaveTextContent("amber:false");
    await user.click(screen.getByText("invert"));
    expect(screen.getByTestId("state")).toHaveTextContent("amber:true");
  });

  it("throws when useTheme is used outside a provider", () => {
    function Orphan() {
      useTheme();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(/within a <ThemeProvider>/);
  });
});
