import type { Meta, StoryObj } from "@storybook/react";
import { FormField, Input, Select } from "../../src";

const meta: Meta<typeof FormField> = {
  title: "Forms/FormField",
  component: FormField,
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const WithHint: Story = {
  render: () => (
    <FormField label="Email" hint="We never share it." required>
      {(props) => (
        <Input type="email" placeholder="you@example.com" {...props} />
      )}
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField label="Username" error="This name is already taken.">
      {(props) => <Input defaultValue="duality" {...props} invalid />}
    </FormField>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <FormField label="Palette" hint="Pick a two-color pair.">
      {(props) => (
        <Select {...props}>
          <option value="classic">Classic</option>
          <option value="amber">Amber</option>
        </Select>
      )}
    </FormField>
  ),
};
