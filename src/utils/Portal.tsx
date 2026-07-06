import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePortalContainer } from "../theme/ThemeProvider";

export interface PortalProps {
  children: ReactNode;
  /** Target container. Defaults to the theme root, then `document.body`. */
  container?: Element | null;
}

/**
 * Renders children into a DOM node outside the parent tree (SSR-safe). Defaults
 * into the nearest theme root so portaled overlays keep the active palette.
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const themeContainer = usePortalContainer();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, container ?? themeContainer ?? document.body);
}
