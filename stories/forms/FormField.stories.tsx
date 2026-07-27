import type { Meta, StoryObj } from "@storybook/react";
import { FormField, Input, Select } from "../../src";

/**
 * FormField composes a label, optional hint, and error around a single control,
 * wiring `id`, `aria-describedby`, `aria-invalid`/`aria-errormessage`,
 * `aria-required`, and `disabled`. Use the render prop for custom controls, or
 * pass plain children - Input, Textarea, and Select read the same wiring from
 * context automatically.
 */
const meta: Meta<typeof FormField> = {
  title: "Forms/FormField",
  component: FormField,
  argTypes: {
    label: { control: "text", description: "Field label." },
    required: {
      control: "boolean",
      description: "Marks the field required (adds an asterisk + `aria-required`).",
    },
    disabled: {
      control: "boolean",
      description: "Dims the label and forwards `disabled` to the control.",
    },
    error: {
      control: "text",
      description: "Error message; also sets invalid + `aria-errormessage`.",
    },
    hint: { control: "text", description: "Helper text under the label." },
    disabledReason: {
      control: "text",
      description:
        "Shown in a persistent caption below the control when the field is disabled.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

/**
 * Args-driven playground: use the Controls panel to toggle `required`,
 * `disabled`, and to set the `label`, `hint`, and `error` text live.
 */
export const Default: Story = {
  args: { label: "Email", hint: "We never share it.", required: true },
  render: (args) => (
    <FormField {...args}>
      <Input type="email" placeholder="you@example.com" />
    </FormField>
  ),
};

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

/**
 * A disabled field dims the label and forwards `disabled` to the control. The
 * value stays crisp on a solid background, and the frame switches to a dithered
 * border to signal the disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <FormField label="Account ID" hint="Assigned automatically." disabled>
      {(props) => <Input defaultValue="acct_10423" {...props} />}
    </FormField>
  ),
};

/**
 * `disabledReason` renders a persistent caption below the control explaining
 * why the field is locked, and wires it to the control via `aria-describedby`.
 */
export const DisabledWithReason: Story = {
  render: () => (
    <FormField
      label="Account ID"
      hint="Assigned automatically."
      disabled
      disabledReason="Managed by your workspace admin"
    >
      {(props) => <Input defaultValue="acct_10423" {...props} />}
    </FormField>
  ),
};

/**
 * When required and invalid, the control receives `aria-required` and
 * `aria-errormessage` (pointing at the error) alongside `aria-invalid`.
 */
export const RequiredAndInvalid: Story = {
  render: () => (
    <FormField
      label="Email"
      required
      error="Enter a valid email address."
    >
      {(props) => <Input type="email" defaultValue="not-an-email" {...props} />}
    </FormField>
  ),
};

/**
 * No render prop: the control is a plain child and picks up `id`, describedby,
 * invalid, required, and disabled from the FormField context.
 */
export const AsContextChild: Story = {
  render: () => (
    <FormField
      label="Full name"
      hint="First and last."
      required
    >
      <Input placeholder="Ada Lovelace" />
    </FormField>
  ),
};
