import { type CSSProperties } from "react";
import type { IconBaseProps, IconType } from "react-icons";
import { cx } from "../../utils/cx";

export interface IconProps extends Omit<IconBaseProps, "size"> {
  /** The react-icons component to render (use a Remix `ri` fill icon). */
  icon: IconType;
  /** Icon size. Numbers are px; strings pass through (default `"1em"`). */
  size?: number | string;
  /**
   * Accessible label. When set the icon is exposed as `role="img"`; otherwise
   * it is decorative and hidden from assistive tech.
   */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Two-color icon wrapper around react-icons. Icons render with
 * `fill: currentColor`, so they inherit `--fg`/`--bg` through `color` and invert
 * with their surface. Decorative by default; pass `label` to name it.
 */
export function Icon({
  icon: IconComponent,
  size = "1em",
  label,
  className,
  ...rest
}: IconProps) {
  return (
    <IconComponent
      className={cx("du_icon", className)}
      size={size}
      focusable={false}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      {...rest}
    />
  );
}
