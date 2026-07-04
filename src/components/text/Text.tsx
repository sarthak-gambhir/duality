import {
  forwardRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from "react";
import { cx } from "../../utils/cx";
import type { PolymorphicProps, PolymorphicRef } from "../../utils/polymorphic";

export type TextSize = "sm" | "md" | "lg" | "xl";

interface TextOwnProps {
  className?: string;
  /** Font size step. */
  size?: TextSize;
  /** Use the monospace font family. */
  mono?: boolean;
  /** Font weight (the two-color model only uses normal/bold). */
  weight?: "normal" | "bold";
}

export type TextProps<T extends ElementType = "span"> = PolymorphicProps<
  T,
  TextOwnProps
>;

function TextImpl<T extends ElementType = "span">(
  { as, className, size = "md", mono, weight, ...rest }: TextProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "span") as ElementType;
  return (
    <Component
      ref={ref}
      className={cx(
        "du_text",
        `du_text_${size}`,
        mono && "du_text_mono",
        weight === "bold" && "du_text_bold",
        className,
      )}
      {...rest}
    />
  );
}

/** Polymorphic inline/block text with token-based sizing. */
export const Text = forwardRef(TextImpl) as <T extends ElementType = "span">(
  props: TextProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
