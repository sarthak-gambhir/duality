import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export type CardProps = ComponentPropsWithoutRef<"div">;

/** Bordered surface. Compose with CardHeader/CardBody/CardFooter. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("du_card", className)} {...rest} />;
});

/** Top section of a Card, separated by a pixel rule. */
export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  function CardHeader({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("du_card_header", className)} {...rest} />
    );
  },
);

/** Main content section of a Card. */
export const CardBody = forwardRef<HTMLDivElement, CardProps>(function CardBody(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("du_card_body", className)} {...rest} />;
});

/** Bottom section of a Card, separated by a pixel rule. */
export const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  function CardFooter({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("du_card_footer", className)} {...rest} />
    );
  },
);
