import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

export type LinkUnderline = "always" | "hover" | "none";

export interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  /**
   * Treat as an external link: opens in a new tab with a safe `rel` and a
   * trailing external-link glyph. Explicit `target`/`rel` still win.
   */
  external?: boolean;
  /** Underline policy. Defaults to `"always"`. */
  underline?: LinkUnderline;
}

/** Text link: underlined by default, inverts on hover. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { external, underline = "always", className, children, target, rel, ...rest },
  ref,
) {
  const icons = useIcons();
  return (
    <a
      ref={ref}
      target={target ?? (external ? "_blank" : undefined)}
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      className={cx(
        "du_link",
        external && "du_link_external",
        underline === "hover" && "du_link_underline_hover",
        underline === "none" && "du_link_underline_none",
        className,
      )}
      {...rest}
    >
      {children}
      {external && (
        <Icon icon={icons.externalLink} className="du_link_external_icon" />
      )}
    </a>
  );
});
