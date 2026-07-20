import {
  Children,
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

export interface AvatarProps extends ComponentPropsWithoutRef<"span"> {
  /** Name used to derive initials when no image is given. */
  name?: string;
  /** Image source. */
  src?: string;
  /** Image alt text (defaults to `name`). */
  alt?: string;
  /** Size. */
  size?: "xs" | "sm" | "md" | "lg";
}

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Square, pixel-framed avatar showing an image or derived initials. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, alt, size = "md", className, "aria-label": ariaLabel, ...rest },
  ref,
) {
  // Fall back to initials if the image is missing or fails to load.
  const [failed, setFailed] = useState(false);
  const showImage = src != null && !failed;
  const icons = useIcons();

  return (
    <span
      ref={ref}
      className={cx("du_avatar", `du_avatar_${size}`, className)}
      // Initials are decorative, so name the container for assistive tech.
      aria-label={ariaLabel ?? (showImage ? undefined : name)}
      role={!showImage && (ariaLabel ?? name) ? "img" : undefined}
      {...rest}
    >
      {showImage ? (
        <img
          className="du_avatar_img"
          src={src}
          alt={alt ?? name ?? ""}
          onError={() => setFailed(true)}
        />
      ) : name ? (
        <span className="du_avatar_initials" aria-hidden="true">
          {initials(name)}
        </span>
      ) : (
        <Icon icon={icons.avatarFallback} className="du_avatar_fallback" />
      )}
    </span>
  );
});

export interface AvatarGroupProps extends ComponentPropsWithoutRef<"div"> {
  /** Maximum avatars to show before collapsing the rest into a `+N` chip. */
  max?: number;
  /** Size applied to the surplus chip (match the avatars you pass in). */
  size?: "xs" | "sm" | "md" | "lg";
}

/** Overlapping stack of `Avatar`s with an optional `+N` surplus chip. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    { max, size = "md", className, children, ...rest },
    ref,
  ) {
    const items = Children.toArray(children).filter(Boolean);
    const limit = max != null && max > 0 ? max : items.length;
    const shown = items.slice(0, limit);
    const surplus = items.length - shown.length;

    return (
      <div ref={ref} className={cx("du_avatar_group", className)} {...rest}>
        {shown.map((child, index) => (
          <span className="du_avatar_group_item" key={index}>
            {child}
          </span>
        ))}
        {surplus > 0 && (
          <span className="du_avatar_group_item" key="surplus">
            <SurplusChip size={size} count={surplus} />
          </span>
        )}
      </div>
    );
  },
);

function SurplusChip({
  size,
  count,
}: {
  size: NonNullable<AvatarGroupProps["size"]>;
  count: number;
}): ReactNode {
  return (
    <span
      className={cx("du_avatar", `du_avatar_${size}`)}
      role="img"
      aria-label={`${count} more`}
    >
      <span className="du_avatar_initials" aria-hidden="true">
        +{count}
      </span>
    </span>
  );
}
