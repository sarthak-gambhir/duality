import { useCallback, useMemo, useState } from 'react';

export interface Disclosure {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/** Minimal open/close state helper for overlays (Modal, Popover, Menu). */
export function useDisclosure(defaultOpen = false): Disclosure {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);
}
