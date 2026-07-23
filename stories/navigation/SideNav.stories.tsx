import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  RiBarChartLine,
  RiFolderLine,
  RiHome2Line,
  RiSettings3Line,
} from "react-icons/ri";
import { Badge, Icon, SideNav, type SideNavSection } from "../../src";

const meta: Meta<typeof SideNav> = {
  title: "Navigation/SideNav",
  component: SideNav,
  parameters: {
    docs: {
      description: {
        component:
          "Sidebar navigation content in a `nav` landmark: a flat `items` list or grouped `sections` with optional headings. The item matching `activeId` inverts and gets `aria-current=\"page\"`. Items render as links (with `href`) or buttons (with `onSelect`), may carry a leading `icon` and a trailing `badge`, and can be `disabled`. Sections can be `collapsible` (heading becomes an `aria-expanded` toggle controlling its list). Pair with the `Sidebar` container for a collapsible rail.",
      },
    },
  },
  argTypes: {
    sections: {
      control: false,
      description:
        "Grouped items. Each section: `{ id, label?, items, collapsible?, defaultCollapsed? }`.",
    },
    items: {
      control: false,
      description:
        "Flat items (used when `sections` is omitted). Each: `{ id, label, icon?, badge?, href?, onSelect?, disabled? }`.",
    },
    activeId: {
      control: false,
      description: "Id of the current item.",
    },
    collapsed: {
      control: "boolean",
      description:
        "Rail mode: shows each item's label (and badge) as a hover/focus tooltip. Pair with a collapsed `Sidebar`, which visually hides the inline labels.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SideNav>;

function Demo() {
  const [active, setActive] = useState("overview");
  const sections: SideNavSection[] = [
    {
      id: "main",
      label: "Workspace",
      items: [
        {
          id: "overview",
          label: "Overview",
          onSelect: () => setActive("overview"),
        },
        {
          id: "projects",
          label: "Projects",
          onSelect: () => setActive("projects"),
        },
        { id: "tasks", label: "Tasks", onSelect: () => setActive("tasks") },
      ],
    },
    {
      id: "account",
      label: "Account",
      items: [
        {
          id: "settings",
          label: "Settings",
          onSelect: () => setActive("settings"),
        },
        { id: "billing", label: "Billing", disabled: true },
      ],
    },
  ];
  return (
    <div style={{ maxWidth: 240 }}>
      <SideNav sections={sections} activeId={active} aria-label="Main" />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };

function IconsAndBadgesDemo() {
  const [active, setActive] = useState("home");
  const sections: SideNavSection[] = [
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
  return (
    <div style={{ maxWidth: 240 }}>
      <SideNav sections={sections} activeId={active} aria-label="With icons" />
    </div>
  );
}

export const IconsAndBadges: Story = { render: () => <IconsAndBadgesDemo /> };

function CollapsibleDemo() {
  const [active, setActive] = useState("overview");
  const sections: SideNavSection[] = [
    {
      id: "main",
      label: "Workspace",
      collapsible: true,
      items: [
        {
          id: "overview",
          label: "Overview",
          onSelect: () => setActive("overview"),
        },
        {
          id: "projects",
          label: "Projects",
          onSelect: () => setActive("projects"),
        },
      ],
    },
    {
      id: "admin",
      label: "Admin",
      collapsible: true,
      defaultCollapsed: true,
      items: [
        {
          id: "users",
          label: "Users",
          onSelect: () => setActive("users"),
        },
        {
          id: "audit",
          label: "Audit log",
          onSelect: () => setActive("audit"),
        },
      ],
    },
  ];
  return (
    <div style={{ maxWidth: 240 }}>
      <SideNav
        sections={sections}
        activeId={active}
        aria-label="Collapsible"
      />
    </div>
  );
}

export const CollapsibleSections: Story = {
  render: () => <CollapsibleDemo />,
};
