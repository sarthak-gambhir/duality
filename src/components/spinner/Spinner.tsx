import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

export interface SpinnerProps extends ComponentPropsWithoutRef<"span"> {
  /** Size. */
  size?: "sm" | "md" | "lg";
  /** Accessible loading label. Defaults to "Loading". */
  label?: string;
}

/** Stepped pixel-rotation loading indicator. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner(
    { size = "md", label = "Loading", className, ...rest },
    ref,
  ) {
    const icons = useIcons();
    return (
      <span
        ref={ref}
        role="status"
        className={cx("du_spinner_root", className)}
        {...rest}
      >
        <Icon
          icon={icons.spinner}
          className={cx("du_spinner", `du_spinner_${size}`)}
        />
        <span className="du_visually_hidden">{label}</span>
      </span>
    );
  },
);
