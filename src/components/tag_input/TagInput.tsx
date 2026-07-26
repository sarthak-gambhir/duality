import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { Badge } from "../badge/Badge";
import { useFormField } from "../form_field/FormFieldContext";
import { DisabledMessage } from "../form_field/disabledMessage";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

export interface TagInputProps {
  /** Current tags (controlled). */
  value?: string[];
  /** Initial tags (uncontrolled). */
  defaultValue?: string[];
  /** Called with the new tag list. */
  onValueChange?: (tags: string[]) => void;
  /** Placeholder shown in the text field. */
  placeholder?: string;
  /** Allow the same tag more than once. Defaults to false. */
  allowDuplicates?: boolean;
  /** Maximum number of tags. */
  max?: number;
  /** Disable the whole control. */
  disabled?: boolean;
  /** When disabled, reason shown in a persistent caption below the field. */
  disabledReason?: ReactNode;
  /** Mark invalid (dashed border + `aria-invalid`). */
  invalid?: boolean;
  /** Name for hidden inputs so tags submit with a form (one per tag). */
  name?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  className?: string;
}

/**
 * Token entry field. Type and press Enter or comma to add a chip; remove via
 * the chip button or Backspace on an empty field. Chips reuse the Badge.
 */
export function TagInput({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  allowDuplicates = false,
  max,
  disabled,
  disabledReason,
  invalid,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: TagInputProps) {
  const [tags, setTags] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const icons = useIcons();
  const field = useFormField();
  const disabledMsgId = useId();
  const isDisabled = disabled ?? field?.disabled;
  const resolvedReason = disabledReason ?? field?.disabledReason;
  const showDisabledReason = !!isDisabled && resolvedReason != null;
  const describedBy =
    cx(ariaDescribedby, showDisabledReason && disabledMsgId) || undefined;

  const commit = () => {
    const tag = draft.trim();
    if (tag === "") return;
    if (max !== undefined && tags.length >= max) return;
    if (!allowDuplicates && tags.includes(tag)) {
      setDraft("");
      return;
    }
    setTags([...tags, tag]);
    setDraft("");
  };

  const removeAt = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      event.preventDefault();
      removeAt(tags.length - 1);
    }
  };

  return (
    <DisabledMessage
      active={showDisabledReason}
      id={disabledMsgId}
      reason={resolvedReason}
    >
    <div
      className={cx(
        "du_tag_input",
        invalid && "du_tag_input_invalid",
        isDisabled && "du_tag_input_disabled",
        className,
      )}
      data-disabled={isDisabled || undefined}
      onClick={() => inputRef.current?.focus()}
    >
      <ul className="du_tag_input_list">
        {tags.map((tag, index) => (
          <li key={`${tag}_${index}`} className="du_tag_input_chip">
            <Badge className="du_tag_input_badge du_badge_removable">
              <span className="du_tag_input_text">{tag}</span>
              {!isDisabled && (
                <button
                  type="button"
                  className="du_tag_input_remove"
                  aria-label={`Remove ${tag}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeAt(index);
                  }}
                >
                  <Icon icon={icons.close} />
                </button>
              )}
            </Badge>
          </li>
        ))}
        <li className="du_tag_input_field">
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={draft}
            placeholder={placeholder}
            disabled={isDisabled}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="du_tag_input_input"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            onBlur={commit}
          />
        </li>
      </ul>

      {name &&
        tags.map((tag, index) => (
          <input key={index} type="hidden" name={name} value={tag} />
        ))}
    </div>
    </DisabledMessage>
  );
}
