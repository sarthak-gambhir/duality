import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface DividerProps extends ComponentPropsWithoutRef<"div"> {
  /** Line direction. Defaults to horizontal. */
  orientation?: "horizontal" | "vertical";
}

/** A one-pixel-family rule drawn in the foreground color. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  function Divider({ orientation = "horizontal", className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cx(
          "du_divider",
          orientation === "vertical" && "du_divider_vertical",
          className,
        )}
        {...rest}
      />
    );
  },
);
