import { type CSSProperties, type SVGProps } from "react";
import { cx } from "../../utils/cx";

export interface LogoProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  /**
   * Mark size. A number is px; a string passes through (defaults to `"1em"` so
   * the mark scales with the surrounding font size).
   */
  size?: number | string;
  /**
   * Accessible label. When set the mark is exposed as `role="img"`; otherwise
   * it is decorative and hidden from assistive tech.
   */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * The Duality brand mark: a two-tone circular glyph whose disk and inner cut map
 * to `--fg` / `--bg`, so it inverts with the active theme and reads on any
 * surface. Decorative by default; pass `label` to name it.
 */
export function Logo({
  size = "1em",
  label,
  className,
  style,
  ...rest
}: LogoProps) {
  return (
    <svg
      className={cx("du_logo", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      focusable={false}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      style={style}
      {...rest}
    >
      <path
        className="du_logo_disk"
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
      />
      <path
        className="du_logo_cut"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-4.68a8.965 8.965 0 0 0 5.707-2.613A8.965 8.965 0 0 0 15.32 7 6 6 0 1 1 7 15.32z"
      />
    </svg>
  );
}
