import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RiStarLine } from "react-icons/ri";
import { Icon } from "../src/components/icon/Icon";
import { IconsProvider, useIcons } from "../src/components/icon/IconsProvider";
import { defaultIcons } from "../src/components/icon/icons";

describe("Icon", () => {
  it("renders an svg element", () => {
    const { container } = render(<Icon icon={RiStarLine} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveClass("du_icon");
  });

  it("is decorative (hidden) by default", () => {
    const { container } = render(<Icon icon={RiStarLine} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("exposes a labeled icon as an image", () => {
    render(<Icon icon={RiStarLine} label="Favorite" />);
    const img = screen.getByRole("img", { name: "Favorite" });
    expect(img.tagName.toLowerCase()).toBe("svg");
    expect(img).not.toHaveAttribute("aria-hidden");
  });

  it("merges extra class names", () => {
    const { container } = render(
      <Icon icon={RiStarLine} className="extra" />,
    );
    expect(container.querySelector("svg")).toHaveClass("du_icon", "extra");
  });
});

describe("IconsProvider / useIcons", () => {
  it("returns the default registry with no provider", () => {
    let resolved: typeof defaultIcons | undefined;
    function Probe() {
      resolved = useIcons();
      return null;
    }
    render(<Probe />);
    expect(resolved?.close).toBe(defaultIcons.close);
  });

  it("merges overrides over the defaults", () => {
    let resolved: typeof defaultIcons | undefined;
    function Probe() {
      resolved = useIcons();
      return null;
    }
    render(
      <IconsProvider icons={{ close: RiStarLine }}>
        <Probe />
      </IconsProvider>,
    );
    expect(resolved?.close).toBe(RiStarLine);
    // Untouched keys still fall back to the defaults.
    expect(resolved?.check).toBe(defaultIcons.check);
  });
});
