import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';

export interface SliderProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  /** Marks the control invalid. */
  invalid?: boolean;
}

/** Two-color range slider built on a native `input[type=range]`. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { invalid, className, 'aria-invalid': ariaInvalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type="range"
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={cx('du_slider', invalid && 'du_slider_invalid', className)}
      {...rest}
    />
  );
});
