import {
  createContext,
  useContext,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  idBase: string;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs subcomponents must be used within <Tabs>.");
  return ctx;
}

export interface TabsProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  /** Selected tab value (controlled). */
  value?: string;
  /** Initial selected value (uncontrolled). Optional when fully controlled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Layout + arrow-key axis. Defaults to horizontal. */
  orientation?: TabsOrientation;
  /**
   * Whether arrow keys select on focus (`automatic`) or only move focus
   * (`manual`, activate with Enter/Space/click). Defaults to automatic.
   */
  activationMode?: TabsActivationMode;
}

/** Tabbed interface root. Provides selection state to Tab/TabPanel. */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  activationMode = "automatic",
  className,
  children,
  ...rest
}: TabsProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue: defaultValue ?? "",
    onChange: onValueChange,
  });
  const idBase = useId();

  return (
    <TabsContext.Provider
      value={{
        value: current,
        setValue: setCurrent,
        idBase,
        orientation,
        activationMode,
      }}
    >
      <div
        className={cx("du_tabs", className)}
        data-orientation={orientation}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabListProps = ComponentPropsWithoutRef<"div">;

/** Row (or column) of tabs with arrow-key roving focus. */
export function TabList({ className, children, ...rest }: TabListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const { orientation, activationMode } = useTabs();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])',
      ) ?? [],
    );
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;

    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

    let next = -1;
    if (event.key === nextKey) next = (index + 1) % tabs.length;
    else if (event.key === prevKey)
      next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;

    const target = tabs[next];
    if (next >= 0 && target) {
      event.preventDefault();
      target.focus();
      target.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      // Automatic mode selects on focus; manual waits for Enter/Space/click.
      if (activationMode === "automatic") target.click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={cx("du_tablist", className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps
  extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  /** This tab's value. */
  value: string;
}

/** A single tab button. */
export function Tab({ value, className, disabled, onClick, ...rest }: TabProps) {
  const ctx = useTabs();
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.idBase}_tab_${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.idBase}_panel_${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-selected={selected || undefined}
      className={cx("du_tab", className)}
      onClick={(event) => {
        ctx.setValue(value);
        event.currentTarget.scrollIntoView?.({
          block: "nearest",
          inline: "nearest",
        });
        onClick?.(event);
      }}
      {...rest}
    />
  );
}

export interface TabPanelProps extends ComponentPropsWithoutRef<"div"> {
  /** Value of the tab this panel belongs to. */
  value: string;
  /** Keep the panel mounted (hidden) when inactive instead of unmounting. */
  keepMounted?: boolean;
}

/** Content panel shown when its tab is selected. */
export function TabPanel({
  value,
  keepMounted,
  className,
  children,
  ...rest
}: TabPanelProps) {
  const ctx = useTabs();
  const selected = ctx.value === value;
  return (
    <div
      role="tabpanel"
      id={`${ctx.idBase}_panel_${value}`}
      aria-labelledby={`${ctx.idBase}_tab_${value}`}
      hidden={!selected}
      className={cx("du_tabpanel", className)}
      {...rest}
    >
      {(selected || keepMounted) && children}
    </div>
  );
}
