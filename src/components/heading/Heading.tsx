import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends ComponentPropsWithoutRef<"h2"> {
  /** Heading level, 1-6. Maps to the matching `h1`-`h6` element. */
  level?: HeadingLevel;
}

/** Section heading on a stepped scale. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level = 2, className, ...rest }, ref) {
    const Tag = `h${level}` as const;
    return (
      <Tag
        ref={ref}
        className={cx("du_heading", `du_heading_${level}`, className)}
        {...rest}
      />
    );
  },
);
