import { useCallback, useRef, useState } from 'react';

/** A next value, or an updater function receiving the current value. */
export type SetStateAction<T> = T | ((prev: T) => T);

export interface UseControllableStateOptions<T> {
  /** Controlled value. When defined, the hook is in controlled mode. */
  value?: T;
  /** Initial value for uncontrolled mode. */
  defaultValue: T;
  /** Called whenever the value should change. */
  onChange?: (value: T) => void;
}

function isUpdater<T>(next: SetStateAction<T>): next is (prev: T) => T {
  return typeof next === 'function';
}

/**
 * Supports both controlled and uncontrolled usage: uses `value` when provided,
 * otherwise keeps internal state. Always calls `onChange` on updates. The setter
 * accepts either a value or an updater function, resolved against the current
 * value in both modes (like React's `useState`).
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: SetStateAction<T>) => void] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<T>(defaultValue);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const current = isControlled ? (value as T) : internal;

  // Keep the latest resolved value in a ref so an updater function can resolve
  // against it even in controlled mode (where there is no internal state).
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved = isUpdater(next) ? next(currentRef.current) : next;
      if (!isControlled) setInternal(resolved);
      onChangeRef.current?.(resolved);
    },
    [isControlled],
  );

  return [current, setValue];
}
