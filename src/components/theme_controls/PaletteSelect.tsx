import { useTheme } from "../../theme/ThemeProvider";
import { palettes, paletteNames, type PaletteName } from "../../theme/palettes";
import { Select } from "../select/Select";

export interface PaletteSelectProps {
  /** Accessible label. Defaults to "Palette". */
  "aria-label"?: string;
  className?: string;
}

/** A Select bound to the current palette, listing all named palettes. */
export function PaletteSelect({
  "aria-label": ariaLabel = "Palette",
  className,
}: PaletteSelectProps) {
  const { theme, setTheme } = useTheme();
  const options = paletteNames.map((name) => ({
    value: name,
    label: palettes[name].label,
  }));

  return (
    <Select
      aria-label={ariaLabel}
      className={className}
      options={options}
      value={theme}
      onValueChange={(value) => setTheme(value as PaletteName)}
    />
  );
}
