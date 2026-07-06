import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cx } from "../../utils/cx";

export interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
  /** Width (number = px). */
  width?: number | string;
  /** Height (number = px). Defaults to a text line. */
  height?: number | string;
}

/** Dithered placeholder block for loading states. */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    { width = "100%", height = 16, className, style, ...rest },
    ref,
  ) {
    const dims = {
      inlineSize: typeof width === "number" ? `${width}px` : width,
      blockSize: typeof height === "number" ? `${height}px` : height,
      ...style,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cx("du_skeleton", className)}
        style={dims}
        {...rest}
      />
    );
  },
);
