import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { defaultIcons, type DualityIcons } from "./icons";

const IconsContext = createContext<DualityIcons>(defaultIcons);

export interface IconsProviderProps {
  /** Partial overrides merged over the built-in Remix fill icon set. */
  icons: Partial<DualityIcons>;
  children: ReactNode;
}

/** Globally re-skin Duality's semantic icons by supplying overrides. */
export function IconsProvider({ icons, children }: IconsProviderProps) {
  const parent = useContext(IconsContext);
  const value = useMemo(
    () => ({ ...parent, ...icons }),
    [parent, icons],
  );
  return (
    <IconsContext.Provider value={value}>{children}</IconsContext.Provider>
  );
}

/** Resolve the active icon set (built-in defaults merged with any overrides). */
export function useIcons(): DualityIcons {
  return useContext(IconsContext);
}
