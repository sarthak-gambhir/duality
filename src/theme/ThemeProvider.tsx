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

export type Texture = "dither" | "hatch";

interface PersistedTheme {
  theme?: PaletteName;
  density?: Density;
  texture?: Texture;
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
  /** Active texture fill (dither or hatch) for disabled and decorative surfaces. */
  texture: Texture;
  setTheme: (theme: PaletteName) => void;
  setDensity: (density: Density) => void;
  setTexture: (texture: Texture) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme. Defaults to `classic`. */
  defaultTheme?: PaletteName;
  /** Initial spacing/sizing density. Defaults to `comfortable`. */
  defaultDensity?: Density;
  /** Initial texture fill. Defaults to `dither`. */
  defaultTexture?: Texture;
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
 * `data-theme`, `data-density`, and `data-texture`, which the tokens stylesheet
 * uses to resolve `--fg` / `--bg`, the spacing / sizing scale, and the texture
 * fill. Requires `import '@duality/ui/styles.css'` once in the app.
 */
export function ThemeProvider({
  children,
  defaultTheme = defaultPalette,
  defaultDensity = "comfortable",
  defaultTexture = "dither",
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
  const [texture, setTexture] = useState<Texture>(
    () => readPersisted(storageKey)?.texture ?? defaultTexture,
  );
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  // Persist on change.
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ theme, density, texture }),
      );
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  }, [storageKey, theme, density, texture]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      density,
      texture,
      setTheme,
      setDensity,
      setTexture,
    }),
    [theme, density, texture],
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
        data-texture={texture}
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
