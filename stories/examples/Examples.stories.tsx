import type { Meta, StoryObj } from "@storybook/react";
import { DashboardDemo } from "./Dashboard";
import { SettingsDemo } from "./Settings";
import { EmailDemo } from "./Email";
import { FileManagerDemo } from "./FileManager";
import { CheckoutDemo } from "./Checkout";
import { CommandCenterDemo } from "./CommandCenter";

/**
 * Full composed demo pages built entirely from public exports. These are
 * showcases (no autodocs, no controls) - one story per real-world screen.
 */
const meta: Meta = {
  title: "Examples",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Dashboard: Story = { render: () => <DashboardDemo /> };
export const Settings: Story = { render: () => <SettingsDemo /> };
export const Email: Story = { render: () => <EmailDemo /> };
export const FileManager: Story = { render: () => <FileManagerDemo /> };
export const Checkout: Story = { render: () => <CheckoutDemo /> };
export const CommandCenter: Story = { render: () => <CommandCenterDemo /> };
