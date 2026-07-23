import {
  createContext,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

interface SidebarContextValue {
  collapsed: boolean;
  /** Whether the sidebar can collapse at all (drives trigger visibility). */
  collapsible: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Access the surrounding Sidebar's collapse state (e.g. for a custom trigger). */
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a <Sidebar>");
  }
  return ctx;
}

export interface SidebarProps {
  children: ReactNode;
  /**
   * Whether the sidebar can collapse. When `false` it stays expanded, ignores
   * collapse requests, and `SidebarTrigger` renders nothing. Defaults to true.
   */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Initial collapsed state (uncontrolled). Defaults to false. */
  defaultCollapsed?: boolean;
  /** Called when the collapsed state changes. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Expanded width in px. Defaults to 260. */
  width?: number;
  /** Collapsed (rail) width in px. Defaults to 64. */
  collapsedWidth?: number;
  /** Accessible name for the landmark. Defaults to "Sidebar". */
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Persistent, in-flow navigation rail that toggles between an expanded
 * (icon + label) and collapsed (icon-only) width. A thin composition shell -
 * put a `SideNav` (and brand/user chrome) inside it. Responsive behavior is the
 * app's responsibility (e.g. render the `SideNav` in a `Drawer` on mobile).
 */
export function Sidebar({
  children,
  collapsible = true,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  width = 260,
  collapsedWidth = 64,
  className,
  style,
  "aria-label": ariaLabel = "Sidebar",
}: SidebarProps) {
  const [rawCollapsed, setRawCollapsed] = useControllableState({
    value: collapsed,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });

  // A non-collapsible sidebar stays expanded and ignores collapse requests.
  const isCollapsed = collapsible ? rawCollapsed : false;

  const ctx = useMemo<SidebarContextValue>(
    () => ({
      collapsed: isCollapsed,
      collapsible,
      toggle: () => {
        if (collapsible) setRawCollapsed(!isCollapsed);
      },
      setCollapsed: (next: boolean) => {
        if (collapsible) setRawCollapsed(next);
      },
    }),
    [isCollapsed, collapsible, setRawCollapsed],
  );

  const vars = {
    "--du-sidebar-w": `${width}px`,
    "--du-sidebar-collapsed-w": `${collapsedWidth}px`,
    ...style,
  } as CSSProperties;

  return (
    <SidebarContext.Provider value={ctx}>
      <aside
        aria-label={ariaLabel}
        data-collapsed={isCollapsed ? "" : undefined}
        className={cx("du_sidebar", className)}
        style={vars}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

export type SidebarSectionProps = ComponentPropsWithoutRef<"div">;

/** Top brand/logo slot, separated by a pixel rule. */
export function SidebarHeader({ className, ...rest }: SidebarSectionProps) {
  return <div className={cx("du_sidebar_header", className)} {...rest} />;
}

/** Scrollable main area, typically holding a `SideNav`. */
export function SidebarBody({ className, ...rest }: SidebarSectionProps) {
  return <div className={cx("du_sidebar_body", className)} {...rest} />;
}

/** Bottom account/user slot, separated by a pixel rule. */
export function SidebarFooter({ className, ...rest }: SidebarSectionProps) {
  return <div className={cx("du_sidebar_footer", className)} {...rest} />;
}

export interface SidebarTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "aria-label"> {
  /** Accessible label. Defaults to Expand/Collapse based on state. */
  label?: string;
}

/** Button that toggles the surrounding Sidebar's collapsed state. */
export function SidebarTrigger({
  label,
  className,
  onClick,
  ...rest
}: SidebarTriggerProps) {
  const { collapsed, collapsible, toggle } = useSidebar();
  const icons = useIcons();
  const resolvedLabel = label ?? (collapsed ? "Expand sidebar" : "Collapse sidebar");

  // Nothing to toggle when the sidebar is fixed-open.
  if (!collapsible) return null;

  return (
    <button
      type="button"
      aria-label={resolvedLabel}
      aria-expanded={!collapsed}
      className={cx("du_sidebar_trigger", className)}
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
      {...rest}
    >
      <Icon icon={collapsed ? icons.chevronRight : icons.chevronLeft} />
    </button>
  );
}
