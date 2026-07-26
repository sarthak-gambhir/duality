import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Stack, Tab, TabList, TabPanel, Tabs, Text } from "../../src";

/**
 * Tabs follow the WAI-ARIA tabs pattern with roving focus. Arrow keys move
 * between tabs (Left/Right when horizontal, Up/Down when vertical), Home/End
 * jump to the ends. `activationMode` chooses whether focus selects immediately
 * (`automatic`) or waits for Enter/Space/click (`manual`).
 */
const meta: Meta<typeof Tabs> = {
  title: "Disclosure/Tabs",
  component: Tabs,
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Layout axis and which arrow keys navigate.",
    },
    activationMode: {
      control: "inline-radio",
      options: ["automatic", "manual"],
      description:
        "Whether arrow-key focus selects immediately or only moves focus.",
    },
    defaultValue: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabList aria-label="Sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="specs">Specs</Tab>
        <Tab value="reviews">Reviews</Tab>
      </TabList>
      <TabPanel value="overview">
        <Text>Overview content. Use arrow keys to move between tabs.</Text>
      </TabPanel>
      <TabPanel value="specs">
        <Text>Specifications content.</Text>
      </TabPanel>
      <TabPanel value="reviews">
        <Text>Reviews content.</Text>
      </TabPanel>
    </Tabs>
  ),
};

/** Vertical orientation: the tab list sits beside the panels and uses Up/Down. */
export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical">
      <TabList aria-label="Settings">
        <Tab value="general">General</Tab>
        <Tab value="account">Account</Tab>
        <Tab value="billing">Billing</Tab>
      </TabList>
      <TabPanel value="general">
        <Text>General settings.</Text>
      </TabPanel>
      <TabPanel value="account">
        <Text>Account settings.</Text>
      </TabPanel>
      <TabPanel value="billing">
        <Text>Billing settings.</Text>
      </TabPanel>
    </Tabs>
  ),
};

/**
 * Manual activation: arrow keys move focus only; press Enter or Space (or click)
 * to actually switch panels. Useful when switching is expensive.
 */
export const ManualActivation: Story = {
  render: () => (
    <Tabs defaultValue="one" activationMode="manual">
      <TabList aria-label="Manual tabs">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
        <Tab value="three">Three</Tab>
      </TabList>
      <TabPanel value="one">
        <Text>Focus a tab, then press Enter/Space to open it.</Text>
      </TabPanel>
      <TabPanel value="two">
        <Text>Panel two.</Text>
      </TabPanel>
      <TabPanel value="three">
        <Text>Panel three.</Text>
      </TabPanel>
    </Tabs>
  ),
};

/** A tab list wider than its container scrolls; the active tab scrolls into view. */
export const Scrollable: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Tabs defaultValue="m1">
        <TabList aria-label="Months">
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ].map((label, i) => (
            <Tab key={label} value={`m${i + 1}`}>
              {label}
            </Tab>
          ))}
        </TabList>
        <TabPanel value="m1">
          <Text>Use arrow keys - clipped tabs scroll into view.</Text>
        </TabPanel>
        {["m2", "m3", "m4", "m5", "m6", "m7"].map((v) => (
          <TabPanel key={v} value={v}>
            <Text>Panel {v}.</Text>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  ),
};

/** A disabled tab is skipped by both pointer and keyboard navigation. */
export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="a">
      <TabList aria-label="With disabled">
        <Tab value="a">Enabled</Tab>
        <Tab value="b" disabled>
          Disabled
        </Tab>
        <Tab value="c">Also enabled</Tab>
      </TabList>
      <TabPanel value="a">
        <Text>Arrow keys skip the disabled tab.</Text>
      </TabPanel>
      <TabPanel value="c">
        <Text>Third panel.</Text>
      </TabPanel>
    </Tabs>
  ),
};

function ControlledTabs() {
  const [value, setValue] = useState("overview");
  return (
    <Stack gap={3}>
      <Text size="sm">
        Selected: <strong>{value}</strong>
      </Text>
      <Tabs value={value} onValueChange={setValue}>
        <TabList aria-label="Controlled">
          <Tab value="overview">Overview</Tab>
          <Tab value="specs">Specs</Tab>
          <Tab value="reviews">Reviews</Tab>
        </TabList>
        <TabPanel value="overview">
          <Text>Overview.</Text>
        </TabPanel>
        <TabPanel value="specs">
          <Text>Specs.</Text>
        </TabPanel>
        <TabPanel value="reviews">
          <Text>Reviews.</Text>
        </TabPanel>
      </Tabs>
    </Stack>
  );
}

/** Fully controlled: `value` + `onValueChange`, no `defaultValue` needed. */
export const Controlled: Story = {
  render: () => <ControlledTabs />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState("overview");
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabList aria-label="Controlled">
        <Tab value="overview">Overview</Tab>
        <Tab value="specs">Specs</Tab>
        <Tab value="reviews">Reviews</Tab>
      </TabList>
      <TabPanel value="overview"><Text>Overview.</Text></TabPanel>
      <TabPanel value="specs"><Text>Specs.</Text></TabPanel>
      <TabPanel value="reviews"><Text>Reviews.</Text></TabPanel>
    </Tabs>
  );
}`,
      },
    },
  },
};
