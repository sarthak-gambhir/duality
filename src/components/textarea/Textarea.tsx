import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  /** Marks the field invalid (border-style change + `aria-invalid`). */
  invalid?: boolean;
  /** Control size. */
  size?: "sm" | "md" | "lg";
  /** Grow the field to fit its content. */
  autosize?: boolean;
  /** Minimum visible rows (also the starting height). */
  minRows?: number;
  /** Maximum rows before the field scrolls (only with `autosize`). */
  maxRows?: number;
  /** Show a character counter (uses `maxLength` when set). */
  showCount?: boolean;
}

/** Multi-line text field sharing the Input styling. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      invalid,
      size = "md",
      autosize,
      minRows,
      maxRows,
      showCount,
      className,
      value,
      defaultValue,
      onChange,
      maxLength,
      rows,
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref,
  ) {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const isControlled = value !== undefined;
    const [length, setLength] = useState(
      () => String(value ?? defaultValue ?? "").length,
    );

    const resize = () => {
      const el = innerRef.current;
      if (!el || !autosize) return;
      el.style.height = "auto";
      const style = getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight) || 20;
      const extra =
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) +
        parseFloat(style.borderTopWidth) +
        parseFloat(style.borderBottomWidth);
      let height = el.scrollHeight;
      if (maxRows) {
        const max = maxRows * lineHeight + extra;
        if (height > max) {
          height = max;
          el.style.overflowY = "auto";
        } else {
          el.style.overflowY = "hidden";
        }
      } else {
        el.style.overflowY = "hidden";
      }
      el.style.height = `${height}px`;
    };

    useLayoutEffect(() => {
      resize();
      // Re-run when the controlled value changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, autosize, minRows, maxRows]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setLength(event.target.value.length);
      onChange?.(event);
      resize();
    };

    const currentLength = isControlled ? String(value ?? "").length : length;

    const field = (
      <textarea
        ref={mergeRefs(ref, innerRef)}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        maxLength={maxLength}
        rows={rows ?? minRows}
        className={cx(
          "du_input",
          "du_textarea",
          `du_textarea_${size}`,
          autosize && "du_textarea_autosize",
          invalid && "du_input_invalid",
          !showCount && className,
        )}
        {...rest}
      />
    );

    if (!showCount) return field;

    return (
      <span className={cx("du_textarea_wrap", className)}>
        {field}
        <span className="du_textarea_count" aria-hidden="true">
          {maxLength != null ? `${currentLength} / ${maxLength}` : currentLength}
        </span>
      </span>
    );
  },
);
