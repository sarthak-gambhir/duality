import type { ReactElement, ReactNode } from "react";

export interface DisabledMessageProps {
  /** Whether to render the caption (disabled and a reason is present). */
  active?: boolean;
  /** Caption id; the control references it via `aria-describedby`. */
  id: string;
  /** Reason the field is disabled, shown in the caption. */
  reason?: ReactNode;
  /** The control to caption; rendered unchanged when inactive. */
  children: ReactElement;
}

/**
 * Renders a disabled control with a persistent reason caption below it. The
 * control owns its own `aria-describedby` wiring (pointing at `id`), so this
 * wrapper stays purely presentational and never clones the child. When
 * inactive the child is returned as-is, adding no DOM.
 */
export function DisabledMessage({
  active,
  id,
  reason,
  children,
}: DisabledMessageProps): ReactElement {
  if (!active) return children;
  return (
    <div className="du_disabled_message_wrap">
      {children}
      <span id={id} className="du_disabled_message">
        {reason}
      </span>
    </div>
  );
}
