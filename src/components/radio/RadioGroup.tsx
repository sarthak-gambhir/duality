import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { useFormField } from "../form_field/FormFieldContext";

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroup(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext);
}

export interface RadioGroupProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onChange" | "defaultValue"
> {
  /** Shared input name. Auto-generated when omitted. */
  name?: string;
  /** Selected value (controlled). */
  value?: string;
  /** Initial selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Layout direction of the radios. Defaults to vertical. */
  orientation?: "horizontal" | "vertical";
  /** Accessible group label. */
  label?: ReactNode;
  children?: ReactNode;
}

/** Groups Radio inputs, managing shared name/value/onChange. */
export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  disabled,
  orientation = "vertical",
  label,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const field = useFormField();
  const isDisabled = disabled ?? field?.disabled;

  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? "",
    onChange: onValueChange,
  });

  return (
    <div
      role="radiogroup"
      aria-label={typeof label === "string" ? label : undefined}
      aria-orientation={orientation}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      aria-required={field?.required || undefined}
      className={cx(
        "du_radio_group",
        orientation === "horizontal" && "du_radio_group_horizontal",
        className,
      )}
      {...rest}
    >
      <RadioGroupContext.Provider
        value={{
          name: groupName,
          value: selected,
          onValueChange: setSelected,
          disabled: isDisabled,
        }}
      >
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}
