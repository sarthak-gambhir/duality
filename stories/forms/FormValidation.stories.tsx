import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, FormField, Input, Stack, Text } from "../../src";

/**
 * A live validation pattern: each field validates on blur and again on submit.
 * `FormField`'s `error` prop drives the message, the dashed invalid border, and
 * `aria-invalid` / `aria-errormessage` on the control (Input reads these from
 * context), so the accessible wiring stays in sync with no extra markup.
 */
const meta: Meta = {
  title: "Forms/FormValidation",
  parameters: {
    docs: {
      description: {
        component:
          "A live validation pattern where each field validates on blur and again on submit. `FormField`'s `error` prop drives the message, the dashed invalid border, and `aria-invalid`/`aria-errormessage` on the control.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface Values {
  email: string;
  password: string;
}
type Errors = Partial<Record<keyof Values, string>>;

function validate({ email, password }: Values): Errors {
  const errors: Errors = {};
  if (!email) errors.email = "Email is required.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 8)
    errors.password = "Use at least 8 characters.";
  return errors;
}

function ValidatedForm() {
  const [values, setValues] = useState<Values>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const change =
    (name: keyof Values) => (e: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [name]: e.target.value };
      setValues(next);
      if (touched[name]) setErrors(validate(next));
      setSubmitted(false);
    };

  const blur = (name: keyof Values) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    setTouched({ email: true, password: true });
    setSubmitted(Object.keys(next).length === 0);
  };

  const errorFor = (name: keyof Values) =>
    touched[name] ? errors[name] : undefined;

  return (
    <form onSubmit={onSubmit} noValidate style={{ maxWidth: 320 }}>
      <Stack gap={4}>
        <FormField label="Email" required error={errorFor("email")}>
          <Input
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={change("email")}
            onBlur={blur("email")}
          />
        </FormField>
        <FormField
          label="Password"
          required
          hint="At least 8 characters."
          error={errorFor("password")}
        >
          <Input
            type="password"
            value={values.password}
            onChange={change("password")}
            onBlur={blur("password")}
          />
        </FormField>
        <Button type="submit">Create account</Button>
        {submitted && (
          <Text size="sm" role="status">
            Submitted successfully.
          </Text>
        )}
      </Stack>
    </form>
  );
}

/** Validate on blur, then on submit; errors clear as the user corrects them. */
export const Default: Story = {
  render: () => <ValidatedForm />,
};
