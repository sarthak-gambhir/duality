import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  /** Visual style. `solid` is filled, `inverse` is outlined, `ghost` is borderless. */
  variant?: "solid" | "inverse" | "ghost";
  /** Control size. */
  size?: "sm" | "md" | "lg";
}

/** Primary action control. Inverts on hover; disabled state uses a dither fill. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "solid", size = "md", type = "button", className, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cx(
          "du_button",
          `du_button_${variant}`,
          `du_button_${size}`,
          className,
        )}
        {...rest}
      />
    );
  },
);
