import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { Text, type TextProps } from "../text/Text";
import { Tooltip, type TooltipPlacement } from "../tooltip/Tooltip";

export interface TruncatedTextProps
  extends Omit<TextProps<"span">, "truncate" | "lineClamp" | "ref"> {
  /**
   * Lines to show before clipping. `1` (default) is a single-line ellipsis;
   * `>1` clamps to that many lines.
   */
  lines?: number;
  /** Tooltip contents shown when clipped. Defaults to `children`. */
  tooltip?: ReactNode;
  /** Side the tooltip renders on. Defaults to `top`. */
  tooltipPlacement?: TooltipPlacement;
}

/**
 * Text that truncates (single line) or clamps (multi line) and reveals the full
 * value in a tooltip only when it is actually overflowing. The complete text
 * always stays in the DOM, so assistive tech reads it regardless.
 */
export function TruncatedText({
  lines = 1,
  tooltip,
  tooltipPlacement = "top",
  className,
  children,
  ...rest
}: TruncatedTextProps) {
  const [overflowing, setOverflowing] = useState(false);
  const [el, setElState] = useState<HTMLElement | null>(null);
  const setEl = useCallback((node: HTMLElement | null) => setElState(node), []);

  useEffect(() => {
    if (!el) return;

    const measure = () => {
      const over =
        lines > 1
          ? el.scrollHeight > el.clientHeight
          : el.scrollWidth > el.clientWidth;
      setOverflowing(over);
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, lines, children]);

  const text = (
    <Text
      ref={setEl}
      truncate={lines <= 1}
      lineClamp={lines > 1 ? lines : undefined}
      className={cx("du_truncated_text", className)}
      {...rest}
    >
      {children}
    </Text>
  );

  if (!overflowing) return text;

  return (
    <Tooltip
      content={tooltip ?? children}
      placement={tooltipPlacement}
      className="du_truncated_text_tip"
    >
      {text}
    </Tooltip>
  );
}
