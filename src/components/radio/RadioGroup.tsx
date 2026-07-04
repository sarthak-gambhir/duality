import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";

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
  "onChange"
> {
  /** Shared input name. Auto-generated when omitted. */
  name?: string;
  /** Selected value (controlled). */
  value?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Accessible group label. */
  label?: ReactNode;
  children?: ReactNode;
}

/** Groups Radio inputs, managing shared name/value/onChange. */
export function RadioGroup({
  name,
  value,
  onValueChange,
  disabled,
  label,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;

  return (
    <div
      role="radiogroup"
      aria-label={typeof label === "string" ? label : undefined}
      className={cx("du_radio_group", className)}
      {...rest}
    >
      <RadioGroupContext.Provider
        value={{ name: groupName, value, onValueChange, disabled }}
      >
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}
