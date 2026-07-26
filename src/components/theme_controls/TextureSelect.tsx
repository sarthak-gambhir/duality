import { useTheme, type Texture } from "../../theme/ThemeProvider";
import { Select } from "../select/Select";

const TEXTURE_OPTIONS: { value: Texture; label: string }[] = [
  { value: "dither", label: "Dither" },
  { value: "hatch", label: "Hatch" },
];

export interface TextureSelectProps {
  /** Accessible label. Defaults to "Texture". */
  "aria-label"?: string;
  /** Which edge the dropdown anchors to. Defaults to "start". */
  align?: "start" | "end";
  className?: string;
}

/** A Select bound to the current texture fill (dither or hatch). */
export function TextureSelect({
  "aria-label": ariaLabel = "Texture",
  align = "start",
  className,
}: TextureSelectProps) {
  const { texture, setTexture } = useTheme();

  return (
    <Select
      aria-label={ariaLabel}
      align={align}
      className={className}
      options={TEXTURE_OPTIONS}
      value={texture}
      onValueChange={(value) => setTexture(value as Texture)}
    />
  );
}
