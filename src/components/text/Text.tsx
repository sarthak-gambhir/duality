import {
  forwardRef,
  type CSSProperties,
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
  /** Text alignment. */
  align?: "start" | "center" | "end";
  /** Truncate to a single line with an ellipsis. */
  truncate?: boolean;
  /** Clamp to N lines with an ellipsis. Ignored when `truncate` is set. */
  lineClamp?: number;
}

export type TextProps<T extends ElementType = "span"> = PolymorphicProps<
  T,
  TextOwnProps
>;

function TextImpl<T extends ElementType = "span">(
  {
    as,
    className,
    size = "md",
    mono,
    weight,
    align,
    truncate,
    lineClamp,
    style,
    ...rest
  }: TextProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "span") as ElementType;
  const clamp = !truncate && lineClamp != null;
  const mergedStyle =
    clamp || align
      ? ({
          ...(clamp ? { "--du-clamp": String(lineClamp) } : {}),
          ...(align ? { textAlign: align } : {}),
          ...style,
        } as CSSProperties)
      : style;

  return (
    <Component
      ref={ref}
      className={cx(
        "du_text",
        `du_text_${size}`,
        mono && "du_text_mono",
        weight === "bold" && "du_text_bold",
        weight === "normal" && "du_text_normal",
        truncate && "du_text_truncate",
        clamp && "du_text_clamp",
        className,
      )}
      style={mergedStyle}
      {...rest}
    />
  );
}

/** Polymorphic inline/block text with token-based sizing. */
export const Text = forwardRef(TextImpl) as <T extends ElementType = "span">(
  props: TextProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;
