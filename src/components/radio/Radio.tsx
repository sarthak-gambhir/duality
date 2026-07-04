import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useRadioGroup } from "./RadioGroup";

export interface RadioProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type"
> {
  /** Text shown next to the indicator. */
  label?: ReactNode;
  /** This option's value. Required within a RadioGroup. */
  value?: string;
}

/** Two-color radio. Inside a RadioGroup it wires name/checked/onChange. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, value, className, name, checked, onChange, disabled, ...rest },
  ref,
) {
  const group = useRadioGroup();

  const resolvedName = name ?? group?.name;
  const resolvedChecked =
    group && value != null ? group.value === value : checked;
  const resolvedDisabled = disabled ?? group?.disabled;

  return (
    <label
      className={cx(
        "du_radio",
        resolvedDisabled && "du_radio_disabled",
        className,
      )}
    >
      <input
        ref={ref}
        type="radio"
        className="du_radio_input"
        name={resolvedName}
        value={value}
        checked={resolvedChecked}
        disabled={resolvedDisabled}
        onChange={(event) => {
          onChange?.(event);
          if (group && value != null) group.onValueChange?.(value);
        }}
        {...rest}
      />
      <span className="du_radio_dot" aria-hidden="true" />
      {label != null && <span className="du_radio_label">{label}</span>}
    </label>
  );
});
