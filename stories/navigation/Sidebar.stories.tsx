import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  RiBarChartLine,
  RiFolderLine,
  RiHome2Line,
  RiSettings3Line,
} from "react-icons/ri";
import {
  Badge,
  Button,
  Drawer,
  Icon,
  Logo,
  SideNav,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  Text,
  ThemeProvider,
  useSidebar,
  useTheme,
  type SideNavSection,
} from "../../src";

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    // Reserve a compact height for the embedded Docs previews so the
    // full-height rail (Shell) fits the block instead of a whole screen.
    docsMinHeight: 460,
    docs: {
      description: {
        component:
          "Persistent, in-flow navigation rail that toggles between an expanded (icon + label) and collapsed (icon-only) width. It is a thin composition shell - compose `SidebarHeader`, `SidebarBody` (usually holding a `SideNav`), `SidebarFooter`, and a `SidebarTrigger` inside it. Collapse state is controllable (`collapsed` + `onCollapsedChange`) or uncontrolled (`defaultCollapsed`); in the rail, `SideNav` labels are visually hidden but keep their accessible names. Pass the collapse state to `SideNav`'s `collapsed` prop (read it via `useSidebar()`) so each icon-only item surfaces its label and badge as a hover/focus tooltip. Responsive behavior is intentionally left to the app - there is no built-in `matchMedia` switch (see the Responsive story).",
      },
    },
  },
  argTypes: {
    collapsible: {
      control: "boolean",
      description:
        "Whether the sidebar can collapse. When false it stays expanded, ignores collapse requests, and `SidebarTrigger` renders nothing.",
      table: { defaultValue: { summary: "true" } },
    },
    collapsed: {
      control: "boolean",
      description: "Controlled collapsed state.",
    },
    defaultCollapsed: {
      control: "boolean",
      description: "Initial collapsed state (uncontrolled).",
      table: { defaultValue: { summary: "false" } },
    },
    width: {
      control: "number",
      description: "Expanded width in px.",
      table: { defaultValue: { summary: "260" } },
    },
    collapsedWidth: {
      control: "number",
      description: "Collapsed (rail) width in px.",
      table: { defaultValue: { summary: "64" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

function useNavSections(setActive: (id: string) => void): SideNavSection[] {
  return [
    {
      id: "main",
      label: "Workspace",
      items: [
        {
          id: "home",
          label: "Home",
          icon: <Icon icon={RiHome2Line} />,
          onSelect: () => setActive("home"),
        },
        {
          id: "files",
          label: "Files",
          icon: <Icon icon={RiFolderLine} />,
          badge: <Badge>12</Badge>,
          onSelect: () => setActive("files"),
        },
        {
          id: "reports",
          label: "Reports",
          icon: <Icon icon={RiBarChartLine} />,
          onSelect: () => setActive("reports"),
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Icon icon={RiSettings3Line} />,
          onSelect: () => setActive("settings"),
        },
      ],
    },
  ];
}

// Fill the story so the rail reads as a real full-height sidebar. The preview
// decorator exposes --du-story-fill (the viewport in canvas, the reserved docs
// block in Docs), so we fit exactly in both without an outer scrollbar.
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        height: "var(--du-story-fill, calc(100vh - 2 * var(--space-5)))",
      }}
    >
      {children}
    </div>
  );
}

// Reads the surrounding Sidebar's collapse state so the SideNav can switch to
// tooltip-per-item (rail) mode automatically.
function RailNav({
  sections,
  active,
}: {
  sections: SideNavSection[];
  active: string;
}) {
  const { collapsed } = useSidebar();
  return (
    <SideNav
      sections={sections}
      activeId={active}
      collapsed={collapsed}
      aria-label="Primary"
    />
  );
}

function Demo() {
  const [active, setActive] = useState("home");
  const sections = useNavSections(setActive);
  return (
    <Shell>
      <Sidebar aria-label="App">
        <SidebarHeader>
          <Logo />
          <Text weight="bold" className="du_side_nav_label">
            Duality
          </Text>
        </SidebarHeader>
        <SidebarBody>
          <RailNav sections={sections} active={active} />
        </SidebarBody>
        <SidebarFooter>
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div style={{ flex: 1, padding: "var(--space-4)" }}>
        <Text>Active: {active}</Text>
      </div>
    </Shell>
  );
}

export const Default: Story = { render: () => <Demo /> };

function StaticDemo() {
  const [active, setActive] = useState("home");
  const sections = useNavSections(setActive);
  return (
    <Shell>
      <Sidebar aria-label="App" collapsible={false}>
        <SidebarHeader>
          <Logo />
          <Text weight="bold" className="du_side_nav_label">
            Duality
          </Text>
        </SidebarHeader>
        <SidebarBody>
          <RailNav sections={sections} active={active} />
        </SidebarBody>
        {/* No SidebarFooter: its only job here was to hold the trigger, which a
            non-collapsible sidebar doesn't render. Add one back only for real
            footer chrome (e.g. a user/account block). */}
      </Sidebar>
      <div style={{ flex: 1, padding: "var(--space-4)" }}>
        <Text>Active: {active}</Text>
      </div>
    </Shell>
  );
}

export const Static: Story = {
  render: () => <StaticDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "With `collapsible={false}` the rail stays expanded, ignores collapse requests, and the `SidebarTrigger` in the footer renders nothing - so a fixed-width nav needs no extra layout work.",
      },
    },
  },
};

function ControlledDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("home");
  const sections = useNavSections(setActive);
  return (
    <Shell>
      <Sidebar
        aria-label="Controlled"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        <SidebarHeader>
          <Logo />
          <Text weight="bold" className="du_side_nav_label">
            Duality
          </Text>
        </SidebarHeader>
        <SidebarBody>
          <RailNav sections={sections} active={active} />
        </SidebarBody>
        <SidebarFooter>
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div
        style={{
          flex: 1,
          padding: "var(--space-4)",
          display: "grid",
          gap: "var(--space-3)",
          alignContent: "start",
        }}
      >
        <Button variant="ghost" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? "Expand" : "Collapse"} (external)
        </Button>
        <Text>Active: {active}</Text>
      </div>
    </Shell>
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

function ResponsiveDemo() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { theme, density } = useTheme();
  const sections = useNavSections((id) => {
    setActive(id);
    setOpen(false);
  });
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Text size="sm">
        On narrow screens, render the same SideNav inside a Drawer instead of a
        persistent rail. This preview is framed to a phone-sized viewport.
      </Text>
      {/* Phone-sized frame. The transform makes it the containing block for the
          Drawer's fixed backdrop, and overflow clips the scrim to the frame -
          otherwise the portaled scrim would cover the whole page in Docs. The
          nested ThemeProvider re-roots the portal target inside the frame. */}
      <div
        style={{
          position: "relative",
          inlineSize: 320,
          blockSize: 520,
          overflow: "hidden",
          transform: "translateZ(0)",
          border: "var(--border-width) solid var(--fg)",
        }}
      >
        <ThemeProvider
          key={`${theme}-${density}`}
          defaultTheme={theme}
          defaultDensity={density}
        >
          <div
            style={{
              display: "grid",
              gap: "var(--space-3)",
              padding: "var(--space-4)",
            }}
          >
            <Button onClick={() => setOpen(true)}>Open menu</Button>
            <Text>Active: {active}</Text>
          </div>
          <Drawer
            isOpen={open}
            onClose={() => setOpen(false)}
            side="start"
            size="sm"
            aria-label="Navigation"
            showCloseButton
            lockScroll={false}
          >
            <div style={{ padding: "var(--space-4)" }}>
              <SideNav
                sections={sections}
                activeId={active}
                aria-label="Mobile"
              />
            </div>
          </Drawer>
        </ThemeProvider>
      </div>
    </div>
  );
}

export const Responsive: Story = {
  render: () => <ResponsiveDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "The Sidebar has no built-in breakpoint logic. On desktop you render the persistent rail; on mobile you render the *same* `SideNav` inside a `Drawer` (which brings its own focus trap, scrim, and dismiss). The app owns the breakpoint decision - typically a CSS media query or a `matchMedia` hook chooses which to mount - so teams keep full control over the breakpoint value and the mobile pattern (drawer vs. top bar vs. bottom nav).",
      },
    },
  },
};
