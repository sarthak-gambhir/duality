import type { CSSProperties, ReactNode } from "react";

/** A bordered cell used to visualize layout components in stories. */
export function Cell({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        border: "var(--border-width) solid var(--fg)",
        padding: "var(--space-3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
