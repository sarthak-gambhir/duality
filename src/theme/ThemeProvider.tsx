import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultPalette, type PaletteName } from "./palettes";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(DARK_QUERY).matches
  );
}

export type Density = "comfortable" | "compact";

interface PersistedTheme {
  theme?: PaletteName;
  inverted?: boolean;
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
  /** Active palette name. */
  theme: PaletteName;
  /** Whether the two colors are currently swapped. */
  inverted: boolean;
  /** Active spacing/sizing density. */
  density: Density;
  setTheme: (theme: PaletteName) => void;
  setInverted: (inverted: boolean) => void;
  toggleInverted: () => void;
  setDensity: (density: Density) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial palette. Defaults to `classic`. */
  defaultTheme?: PaletteName;
  /**
   * Whether to start inverted. Pass `"system"` to derive it from the OS
   * `prefers-color-scheme` and follow live changes. Defaults to `false`.
   */
  defaultInverted?: boolean | "system";
  /** Initial spacing/sizing density. Defaults to `comfortable`. */
  defaultDensity?: Density;
  /**
   * When set, the active theme, inversion, and density are persisted to
   * `localStorage` under this key and restored on next load.
   */
  storageKey?: string;
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
  defaultDensity = "comfortable",
  storageKey,
  as: Element = "div",
  className,
}: ThemeProviderProps) {
  const followSystem = defaultInverted === "system";

  const [theme, setTheme] = useState<PaletteName>(
    () => readPersisted(storageKey)?.theme ?? defaultTheme,
  );
  const [inverted, setInverted] = useState<boolean>(() => {
    const persisted = readPersisted(storageKey)?.inverted;
    if (persisted !== undefined) return persisted;
    return followSystem ? prefersDark() : defaultInverted === true;
  });
  const [density, setDensity] = useState<Density>(
    () => readPersisted(storageKey)?.density ?? defaultDensity,
  );
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  const toggleInverted = useCallback(() => setInverted((prev) => !prev), []);

  // Persist on change.
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ theme, inverted, density }),
      );
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  }, [storageKey, theme, inverted, density]);

  // Follow live OS scheme changes when requested and not persisted.
  useEffect(() => {
    if (!followSystem || typeof window === "undefined") return undefined;
    if (readPersisted(storageKey)?.inverted !== undefined) return undefined;
    const mql = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => setInverted(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [followSystem, storageKey]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      inverted,
      density,
      setTheme,
      setInverted,
      toggleInverted,
      setDensity,
    }),
    [theme, inverted, density, toggleInverted],
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
        data-inverted={inverted}
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
