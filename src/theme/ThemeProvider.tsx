import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultPalette, type PaletteName } from "./palettes";

export interface ThemeContextValue {
  /** Active palette name. */
  theme: PaletteName;
  /** Whether the two colors are currently swapped. */
  inverted: boolean;
  setTheme: (theme: PaletteName) => void;
  setInverted: (inverted: boolean) => void;
  toggleInverted: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial palette. Defaults to `classic`. */
  defaultTheme?: PaletteName;
  /** Whether to start inverted. Defaults to `false`. */
  defaultInverted?: boolean;
  /** Element type for the theme root. Defaults to `div`. */
  as?: "div" | "section" | "main" | "article";
  className?: string;
}

/**
 * Establishes a Duality theme scope. Renders a `du_theme_root` element carrying
 * `data-theme` and `data-inverted`, which the tokens stylesheet uses to resolve
 * `--fg` / `--bg`. Requires `import '@duality/ui/styles.css'` once in the app.
 */
export function ThemeProvider({
  children,
  defaultTheme = defaultPalette,
  defaultInverted = false,
  as: Element = "div",
  className,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<PaletteName>(defaultTheme);
  const [inverted, setInverted] = useState<boolean>(defaultInverted);

  const toggleInverted = useCallback(() => setInverted((prev) => !prev), []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, inverted, setTheme, setInverted, toggleInverted }),
    [theme, inverted, toggleInverted],
  );

  const rootClassName = className
    ? `du_theme_root ${className}`
    : "du_theme_root";

  return (
    <ThemeContext.Provider value={value}>
      <Element
        className={rootClassName}
        data-theme={theme}
        data-inverted={inverted}
      >
        {children}
      </Element>
    </ThemeContext.Provider>
  );
}

/** Access and control the current Duality theme. Must be used within a ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return context;
}
