import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends ComponentPropsWithoutRef<"h2"> {
  /** Semantic heading level, 1-6. Sets the rendered `h1`-`h6` element. */
  level?: HeadingLevel;
  /** Visual size, decoupled from the tag. Defaults to `level`. */
  visualLevel?: HeadingLevel;
}

/** Section heading on a stepped scale. `visualLevel` styles without changing the tag. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level = 2, visualLevel, className, ...rest }, ref) {
    const Tag = `h${level}` as const;
    const visual = visualLevel ?? level;
    return (
      <Tag
        ref={ref}
        className={cx("du_heading", `du_heading_${visual}`, className)}
        {...rest}
      />
    );
  },
);
