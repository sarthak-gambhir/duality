import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultPalette, type PaletteName } from "./palettes";

export type Density = "comfortable" | "compact";

interface PersistedTheme {
  theme?: PaletteName;
  density?: Density;
}

function readPersisted(storageKey?: string): PersistedTheme | null {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as PersistedTheme) : null;
  } catch {
    return null;
  }
}

/**
 * The nearest theme-root DOM element. Portaled overlays default into this node
 * so they inherit the active `--fg`/`--bg` instead of the document default.
 */
const PortalContainerContext = createContext<HTMLElement | null>(null);

export function usePortalContainer(): HTMLElement | null {
  return useContext(PortalContainerContext);
}

export interface ThemeContextValue {
  /** Active theme name. */
  theme: PaletteName;
  /** Active spacing/sizing density. */
  density: Density;
  setTheme: (theme: PaletteName) => void;
  setDensity: (density: Density) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme. Defaults to `classic`. */
  defaultTheme?: PaletteName;
  /** Initial spacing/sizing density. Defaults to `comfortable`. */
  defaultDensity?: Density;
  /**
   * When set, the active theme and density are persisted to `localStorage`
   * under this key and restored on next load.
   */
  storageKey?: string;
  /** Element type for the theme root. Defaults to `div`. */
  as?: "div" | "section" | "main" | "article";
  className?: string;
}

/**
 * Establishes a Duality theme scope. Renders a `du_theme_root` element carrying
 * `data-theme` and `data-density`, which the tokens stylesheet uses to resolve
 * `--fg` / `--bg` and the spacing / sizing scale. Requires
 * `import '@duality/ui/styles.css'` once in the app.
 */
export function ThemeProvider({
  children,
  defaultTheme = defaultPalette,
  defaultDensity = "comfortable",
  storageKey,
  as: Element = "div",
  className,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<PaletteName>(
    () => readPersisted(storageKey)?.theme ?? defaultTheme,
  );
  const [density, setDensity] = useState<Density>(
    () => readPersisted(storageKey)?.density ?? defaultDensity,
  );
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  // Persist on change.
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ theme, density }),
      );
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  }, [storageKey, theme, density]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      density,
      setTheme,
      setDensity,
    }),
    [theme, density],
  );

  const rootClassName = className
    ? `du_theme_root ${className}`
    : "du_theme_root";

  return (
    <ThemeContext.Provider value={value}>
      <Element
        ref={setRootEl as never}
        className={rootClassName}
        data-theme={theme}
        data-density={density}
      >
        <PortalContainerContext.Provider value={rootEl}>
          {children}
        </PortalContainerContext.Provider>
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
