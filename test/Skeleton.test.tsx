import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "../src/components/skeleton/Skeleton";

describe("Skeleton", () => {
  it("renders a decorative placeholder hidden from assistive tech", () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector(".du_skeleton");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("applies width and height as inline logical sizes", () => {
    const { container } = render(<Skeleton width={120} height={40} />);
    const el = container.querySelector(".du_skeleton") as HTMLElement;
    expect(el.style.inlineSize).toBe("120px");
    expect(el.style.blockSize).toBe("40px");
  });
});
