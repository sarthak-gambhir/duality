import { useTheme, type Density } from "../../theme/ThemeProvider";
import { Select } from "../select/Select";

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

export interface DensitySelectProps {
  /** Accessible label. Defaults to "Density". */
  "aria-label"?: string;
  /** Which edge the dropdown anchors to. Defaults to "start". */
  align?: "start" | "end";
  className?: string;
}

/** A Select bound to the current spacing/sizing density. */
export function DensitySelect({
  "aria-label": ariaLabel = "Density",
  align = "start",
  className,
}: DensitySelectProps) {
  const { density, setDensity } = useTheme();

  return (
    <Select
      aria-label={ariaLabel}
      align={align}
      className={className}
      options={DENSITY_OPTIONS}
      value={density}
      onValueChange={(value) => setDensity(value as Density)}
    />
  );
}
