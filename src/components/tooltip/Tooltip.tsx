import {
  cloneElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip contents. */
  content: ReactNode;
  /** Single focusable trigger element. */
  children: ReactElement;
  /** Side of the trigger to render on. Defaults to top. */
  placement?: TooltipPlacement;
  /** Delay before showing, in ms. Defaults to 150. */
  openDelay?: number;
  className?: string;
}

/** Text hint shown on hover/focus, positioned with CSS (no collision flipping). */
export function Tooltip({
  content,
  children,
  placement = 'top',
  openDelay = 150,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const id = useId();
  const tooltipId = `${id}_tooltip`;

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), openDelay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  const trigger = cloneElement(children, { 'aria-describedby': tooltipId });

  return (
    <span
      className="du_tooltip_root"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={tooltipId}
          className={cx('du_tooltip', `du_tooltip_${placement}`, className)}
        >
          {content}
        </span>
      )}
    </span>
  );
}
