import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';

export interface AvatarProps extends ComponentPropsWithoutRef<'span'> {
  /** Name used to derive initials when no image is given. */
  name?: string;
  /** Image source. */
  src?: string;
  /** Image alt text (defaults to `name`). */
  alt?: string;
  /** Size. */
  size?: 'sm' | 'md' | 'lg';
}

function initials(name?: string): string {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Square, pixel-framed avatar showing an image or derived initials. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, alt, size = 'md', className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx('du_avatar', `du_avatar_${size}`, className)} {...rest}>
      {src ? (
        <img className="du_avatar_img" src={src} alt={alt ?? name ?? ''} />
      ) : (
        <span className="du_avatar_initials" aria-hidden="true">
          {initials(name)}
        </span>
      )}
    </span>
  );
});
