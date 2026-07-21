import { type CSSProperties } from "react";
import type { IconBaseProps, IconType } from "react-icons";
import { cx } from "../../utils/cx";

/** Named size tiers mapped to the `--icon-*` tokens. */
export type IconSize = "sm" | "md" | "lg" | "xl";

const SIZE_TIERS: Record<IconSize, true> = {
  sm: true,
  md: true,
  lg: true,
  xl: true,
};

function isIconSize(value: number | string): value is IconSize {
  return typeof value === "string" && value in SIZE_TIERS;
}

export interface IconProps extends Omit<IconBaseProps, "size"> {
  /** The react-icons component to render (use a Remix `ri` line icon). */
  icon: IconType;
  /**
   * Icon size. A tier keyword (`"sm" | "md" | "lg" | "xl"`) maps to the
   * `--icon-*` tokens; a number is px and any other string passes through.
   * Defaults to `"1em"` so the icon scales with the surrounding font size.
   */
  size?: IconSize | number | string;
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
  // A tier keyword sizes via a token-backed class (icon stays at 1em); a
  // number/string is forwarded to react-icons as an explicit width/height.
  const tier = isIconSize(size);
  return (
    <IconComponent
      className={cx("du_icon", tier && `du_icon_${size}`, className)}
      size={tier ? "1em" : size}
      focusable={false}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      {...rest}
    />
  );
}
