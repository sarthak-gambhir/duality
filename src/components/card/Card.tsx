import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from "react";
import { cx } from "../../utils/cx";
import type { PolymorphicProps, PolymorphicRef } from "../../utils/polymorphic";

export type CardProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  {
    className?: string;
    /** Adds focus ring + hover state; pair with `as="a"`/`as="button"`. */
    interactive?: boolean;
  }
>;

/**
 * Bordered surface. Compose with CardHeader/CardBody/CardFooter. Pass
 * `interactive` (with `as="a"`/`as="button"`) to make the whole card actionable.
 */
function CardImpl<T extends ElementType = "div">(
  { as, interactive, className, ...rest }: CardProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      ref={ref}
      className={cx("du_card", interactive && "du_card_interactive", className)}
      {...rest}
    />
  );
}

export const Card = forwardRef(CardImpl) as <T extends ElementType = "div">(
  props: CardProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;

export type CardSectionProps = ComponentPropsWithoutRef<"div">;

/** Top section of a Card, separated by a pixel rule. */
export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardHeader({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("du_card_header", className)} {...rest} />
    );
  },
);

/** Main content section of a Card. */
export const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cx("du_card_body", className)} {...rest} />;
  },
);

/** Bottom section of a Card, separated by a pixel rule. */
export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardFooter({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("du_card_footer", className)} {...rest} />
    );
  },
);

/** Full-bleed media region (image/graphic) framed by a pixel rule. */
export const CardMedia = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardMedia({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("du_card_media", className)} {...rest} />
    );
  },
);
