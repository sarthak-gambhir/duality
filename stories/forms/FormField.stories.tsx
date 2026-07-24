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
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "text" },
    hint: { control: "text" },
    disabledReason: {
      control: "text",
      description:
        "Shown (with the value) in a hover tooltip when the field is disabled. Hover-only, since disabled controls can't be focused.",
    },
  },
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

/**
 * A disabled field dims the label and forwards `disabled` to the control. When
 * the control has a value, hovering it shows the value in a tooltip (helpful
 * since the dithered field text can be hard to read). Hover-only, since
 * disabled controls cannot receive focus.
 */
export const Disabled: Story = {
  render: () => (
    <FormField label="Account ID" hint="Assigned automatically." disabled>
      {(props) => <Input defaultValue="acct_10423" {...props} />}
    </FormField>
  ),
};

/**
 * `disabledReason` adds a "Disabled due to:" line above the value in the hover
 * tooltip, explaining why the field is locked.
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
 * `disabledTooltip` overrides the default content formatting - here masking the
 * value and rewording the reason.
 */
export const CustomDisabledTooltip: Story = {
  render: () => (
    <FormField
      label="API token"
      disabled
      disabledReason="Rotate from the security page"
      disabledTooltip={({ value, reason }) => (
        <div>
          <div>{reason}</div>
          <div>Ends in ****{value.slice(-4)}</div>
        </div>
      )}
    >
      {(props) => <Input defaultValue="sk_live_8f2a91c4" {...props} />}
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
