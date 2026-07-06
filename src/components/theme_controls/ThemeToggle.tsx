import { useTheme } from "../../theme/ThemeProvider";
import { Switch } from "../switch/Switch";

export interface ThemeToggleProps {
  /** Label shown next to the switch. */
  label?: string;
  className?: string;
}

/** A Switch bound to the current theme's inversion state. */
export function ThemeToggle({
  label = "Invert colors",
  className,
}: ThemeToggleProps) {
  const { inverted, toggleInverted } = useTheme();
  return (
    <Switch
      checked={inverted}
      onChange={toggleInverted}
      label={label}
      className={className}
    />
  );
}
