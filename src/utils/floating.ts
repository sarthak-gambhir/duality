import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

/** The edge of the anchor a floating element is placed against. */
export type Side = "top" | "bottom" | "left" | "right";

/** Anchor placement: a side, optionally aligned to the anchor's start/end. */
export type Placement = Side | `${Side}-start` | `${Side}-end`;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface ComputePositionOptions {
  placement?: Placement;
  /** Gap between the anchor and the floating element, in px. */
  offset?: number;
  /** Flip to the opposite side when the preferred side overflows. */
  flip?: boolean;
  /** Slide along the cross axis to keep the element in view. */
  shift?: boolean;
  /** Minimum gap kept from the viewport edges, in px. */
  padding?: number;
}

export interface PositionResult {
  /** Left coordinate in viewport space. */
  x: number;
  /** Top coordinate in viewport space. */
  y: number;
  /** The side/alignment actually used after flipping. */
  placement: Placement;
  /** Arrow offset along the cross axis, relative to the float's top-left. */
  arrow: { x: number; y: number };
}

const OPPOSITE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function splitPlacement(
  placement: Placement,
): [Side, "start" | "end" | undefined] {
  const [side, align] = placement.split("-") as [
    Side,
    "start" | "end" | undefined,
  ];
  return [side, align];
}

/**
 * Pure placement math for an anchored floating element. All rects are in the
 * same coordinate space (viewport space when fed `getBoundingClientRect`).
 * Handles flip (to the opposite side) and shift (along the cross axis).
 */
export function computePosition(
  anchor: Rect,
  float: Dimensions,
  viewport: Dimensions,
  options: ComputePositionOptions = {},
): PositionResult {
  const { offset = 8, flip = true, shift = true, padding = 8 } = options;
  const [initialSide, align] = splitPlacement(options.placement ?? "bottom");
  let side = initialSide;

  const mainCoord = (s: Side): number => {
    switch (s) {
      case "top":
        return anchor.y - offset - float.height;
      case "bottom":
        return anchor.y + anchor.height + offset;
      case "left":
        return anchor.x - offset - float.width;
      case "right":
      default:
        return anchor.x + anchor.width + offset;
    }
  };

  const overflowFor = (s: Side, coord: number): number => {
    switch (s) {
      case "top":
        return padding - coord;
      case "bottom":
        return coord + float.height - (viewport.height - padding);
      case "left":
        return padding - coord;
      case "right":
      default:
        return coord + float.width - (viewport.width - padding);
    }
  };

  if (flip) {
    const overflow = overflowFor(side, mainCoord(side));
    if (overflow > 0) {
      const flipped = OPPOSITE[side];
      const flippedOverflow = overflowFor(flipped, mainCoord(flipped));
      if (flippedOverflow < overflow) side = flipped;
    }
  }

  const isVertical = side === "top" || side === "bottom";
  let x: number;
  let y: number;

  if (isVertical) {
    y = mainCoord(side);
    if (align === "start") x = anchor.x;
    else if (align === "end") x = anchor.x + anchor.width - float.width;
    else x = anchor.x + anchor.width / 2 - float.width / 2;
  } else {
    x = mainCoord(side);
    if (align === "start") y = anchor.y;
    else if (align === "end") y = anchor.y + anchor.height - float.height;
    else y = anchor.y + anchor.height / 2 - float.height / 2;
  }

  if (shift) {
    if (isVertical) {
      x = clamp(x, padding, Math.max(padding, viewport.width - float.width - padding));
    } else {
      y = clamp(y, padding, Math.max(padding, viewport.height - float.height - padding));
    }
  }

  const arrow = { x: 0, y: 0 };
  if (isVertical) {
    const anchorCenterX = anchor.x + anchor.width / 2;
    arrow.x = clamp(anchorCenterX - x, padding, Math.max(padding, float.width - padding));
  } else {
    const anchorCenterY = anchor.y + anchor.height / 2;
    arrow.y = clamp(anchorCenterY - y, padding, Math.max(padding, float.height - padding));
  }

  return {
    x,
    y,
    placement: (align ? `${side}-${align}` : side) as Placement,
    arrow,
  };
}

/**
 * Clamp a point-anchored floating element (e.g. a context menu opened at the
 * cursor) so it stays fully within the viewport.
 */
export function clampToViewport(
  point: { x: number; y: number },
  float: Dimensions,
  viewport: Dimensions,
): { left: number; top: number } {
  let left = point.x;
  if (point.x + float.width > viewport.width) left = viewport.width - float.width;
  left = Math.max(0, left);

  let top = point.y;
  if (point.y + float.height > viewport.height) top = viewport.height - float.height;
  top = Math.max(0, top);

  return { left, top };
}

export interface UseAnchorPositionOptions {
  anchorRef: RefObject<HTMLElement | null>;
  /**
   * The floating element, tracked as state (not a ref) so positioning re-runs
   * once it attaches - the Portal mounts children a tick after open.
   */
  floatingEl: HTMLElement | null;
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  /** Only positions while enabled (e.g. while the overlay is open). */
  enabled: boolean;
}

export interface AnchorPosition {
  /** Resolved side after flipping. */
  side: Side;
  placement: Placement;
  /** Whether a measurement has run; use to avoid a flash at 0,0. */
  ready: boolean;
  /** Inline style for the floating element (position: fixed + coords). */
  floatingStyle: CSSProperties;
  /** Inline style for an optional arrow element. */
  arrowStyle: CSSProperties;
}

/**
 * Positions a portaled floating element against an anchor with collision-aware
 * flip/shift. Measures the rendered element and corrects for any transformed
 * containing block (e.g. Storybook's zoom canvas), so `position: fixed` lands
 * under the anchor regardless of ancestor transforms. Re-measures on scroll and
 * resize while enabled.
 */
export function useAnchorPosition({
  anchorRef,
  floatingEl,
  placement = "bottom",
  offset,
  flip,
  shift,
  enabled,
}: UseAnchorPositionOptions): AnchorPosition {
  const [state, setState] = useState<{
    left: number;
    top: number;
    placement: Placement;
    arrow: { x: number; y: number };
    ready: boolean;
  }>({ left: 0, top: 0, placement, arrow: { x: 0, y: 0 }, ready: false });

  useLayoutEffect(() => {
    if (!enabled || !floatingEl) {
      setState((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return undefined;
    }
    const anchor = anchorRef.current;
    const floating = floatingEl;
    if (!anchor) return undefined;

    const update = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const floatRect = floating.getBoundingClientRect();
      const scaleX = floating.offsetWidth
        ? floatRect.width / floating.offsetWidth
        : 1;
      const scaleY = floating.offsetHeight
        ? floatRect.height / floating.offsetHeight
        : 1;

      const result = computePosition(
        {
          x: anchorRect.left,
          y: anchorRect.top,
          width: anchorRect.width,
          height: anchorRect.height,
        },
        { width: floatRect.width, height: floatRect.height },
        { width: window.innerWidth, height: window.innerHeight },
        { placement, offset, flip, shift },
      );

      setState((prev) => {
        const left = prev.left + (result.x - floatRect.left) / scaleX;
        const top = prev.top + (result.y - floatRect.top) / scaleY;
        const arrow = { x: result.arrow.x / scaleX, y: result.arrow.y / scaleY };
        const moved =
          Math.abs(left - prev.left) > 0.5 || Math.abs(top - prev.top) > 0.5;
        if (!moved && prev.placement === result.placement && prev.ready) {
          return prev;
        }
        return { left, top, placement: result.placement, arrow, ready: true };
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, floatingEl, placement, offset, flip, shift]);

  const [side] = splitPlacement(state.placement);
  const isVertical = side === "top" || side === "bottom";

  return {
    side,
    placement: state.placement,
    ready: state.ready,
    floatingStyle: {
      position: "fixed",
      left: state.left,
      top: state.top,
      visibility: state.ready ? "visible" : "hidden",
    },
    arrowStyle: isVertical
      ? { insetInlineStart: state.arrow.x }
      : { insetBlockStart: state.arrow.y },
  };
}
