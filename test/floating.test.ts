import { describe, expect, it } from "vitest";
import { clampToViewport, computePosition } from "../src/utils/floating";

const viewport = { width: 1000, height: 1000 };

describe("computePosition", () => {
  it("places below and centers on the anchor for bottom placement", () => {
    const result = computePosition(
      { x: 100, y: 100, width: 50, height: 20 },
      { width: 200, height: 100 },
      viewport,
      { placement: "bottom", offset: 8 },
    );
    expect(result.placement).toBe("bottom");
    expect(result.y).toBe(128); // 100 + 20 + 8
    expect(result.x).toBe(25); // 100 + 25 - 100
  });

  it("aligns to the anchor start/end", () => {
    const start = computePosition(
      { x: 100, y: 100, width: 50, height: 20 },
      { width: 200, height: 100 },
      viewport,
      { placement: "bottom-start", shift: false },
    );
    expect(start.x).toBe(100);

    const end = computePosition(
      { x: 100, y: 100, width: 50, height: 20 },
      { width: 200, height: 100 },
      viewport,
      { placement: "bottom-end", shift: false },
    );
    expect(end.x).toBe(-50); // 100 + 50 - 200
  });

  it("flips to the opposite side when the preferred side overflows", () => {
    const result = computePosition(
      { x: 100, y: 950, width: 50, height: 20 },
      { width: 200, height: 100 },
      viewport,
      { placement: "bottom", offset: 8 },
    );
    expect(result.placement).toBe("top");
  });

  it("shifts along the cross axis to stay within the viewport", () => {
    const result = computePosition(
      { x: 950, y: 100, width: 50, height: 20 },
      { width: 200, height: 100 },
      viewport,
      { placement: "bottom", padding: 8 },
    );
    // Clamped to viewport.width - float.width - padding = 1000 - 200 - 8.
    expect(result.x).toBe(792);
  });

  it("does not flip when flip is disabled", () => {
    const result = computePosition(
      { x: 100, y: 950, width: 50, height: 20 },
      { width: 200, height: 100 },
      viewport,
      { placement: "bottom", flip: false },
    );
    expect(result.placement).toBe("bottom");
  });
});

describe("clampToViewport", () => {
  it("keeps a point-anchored element inside the viewport", () => {
    expect(
      clampToViewport({ x: 950, y: 950 }, { width: 200, height: 100 }, viewport),
    ).toEqual({ left: 800, top: 900 });
  });

  it("never returns negative coordinates", () => {
    expect(
      clampToViewport(
        { x: -20, y: -20 },
        { width: 200, height: 100 },
        viewport,
      ),
    ).toEqual({ left: 0, top: 0 });
  });
});
