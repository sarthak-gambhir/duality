import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cx } from "../../utils/cx";

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** Max content width in pixels. */
  maxWidth?: number;
}

/** Centered, max-width page wrapper with horizontal padding. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ maxWidth, className, style, ...rest }, ref) {
    const vars = {
      ...(maxWidth ? { "--du-max": `${maxWidth}px` } : {}),
      ...style,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        className={cx("du_container", className)}
        style={vars}
        {...rest}
      />
    );
  },
);
