import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FormField } from "../src/components/form_field/FormField";
import { Input } from "../src/components/input/Input";

describe("FormField", () => {
  it("associates the label with the control", () => {
    render(
      <FormField label="Email">
        {(props) => <Input type="email" {...props} />}
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("wires the hint through aria-describedby", () => {
    render(
      <FormField label="Email" hint="No spam">
        {(props) => <Input type="email" {...props} />}
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent("No spam");
  });

  it("marks the control invalid and exposes the error via alert", () => {
    render(
      <FormField label="Email" error="Required">
        {(props) => <Input type="email" {...props} />}
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Required");
    expect(input.getAttribute("aria-describedby")).toContain(alert.id);
  });

  it("sets aria-required on the control when required", () => {
    render(
      <FormField label="Email" required>
        {(props) => <Input type="email" {...props} />}
      </FormField>,
    );
    expect(screen.getByLabelText(/Email/)).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("points aria-errormessage at the error element when invalid", () => {
    render(
      <FormField label="Email" error="Required">
        {(props) => <Input type="email" {...props} />}
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    const alert = screen.getByRole("alert");
    expect(input).toHaveAttribute("aria-errormessage", alert.id);
  });

  it("propagates field-level disabled to the control", () => {
    render(
      <FormField label="Email" disabled>
        {(props) => <Input type="email" {...props} />}
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("uses a custom id for the label/control association", () => {
    render(
      <FormField label="Email" id="my-email">
        {(props) => <Input type="email" {...props} />}
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "my-email");
  });

  it("wires plain children through context (no render prop)", () => {
    render(
      <FormField label="Email" required error="Bad" hint="No spam">
        <Input type="email" />
      </FormField>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const alert = screen.getByRole("alert");
    expect(input.getAttribute("aria-describedby")).toContain(alert.id);
    expect(input).toHaveAttribute("aria-errormessage", alert.id);
  });
});

describe("FormField disabled tooltip", () => {
  it("shows the value in a hover tooltip on a disabled field", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FormField label="Account ID" disabled>
        {(props) => <Input defaultValue="acct_10423" {...props} />}
      </FormField>,
    );
    const root = container.querySelector(".du_tooltip_root");
    expect(root).not.toBeNull();
    await user.hover(root!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Value: acct_10423");
    expect(tip).not.toHaveTextContent("Disabled due to");
  });

  it("shows only the reason when the field has no value", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FormField label="Token" disabled disabledReason="Locked by admin">
        {(props) => <Input {...props} />}
      </FormField>,
    );
    const root = container.querySelector(".du_tooltip_root");
    expect(root).not.toBeNull();
    await user.hover(root!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Disabled due to: Locked by admin");
    expect(tip).not.toHaveTextContent("Value:");
  });

  it("shows both reason and value when both are present", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FormField label="Account ID" disabled disabledReason="Managed by admin">
        {(props) => <Input defaultValue="acct_10423" {...props} />}
      </FormField>,
    );
    await user.hover(container.querySelector(".du_tooltip_root")!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Disabled due to: Managed by admin");
    expect(tip).toHaveTextContent("Value: acct_10423");
  });

  it("honors a custom disabledTooltip formatter", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FormField
        label="API token"
        disabled
        disabledReason="Rotate it"
        disabledTooltip={({ value, reason }) => (
          <span>
            {reason} ****{value.slice(-4)}
          </span>
        )}
      >
        {(props) => <Input defaultValue="sk_live_8f2a91c4" {...props} />}
      </FormField>,
    );
    await user.hover(container.querySelector(".du_tooltip_root")!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Rotate it ****91c4");
  });

  it("does not wrap an enabled field", () => {
    const { container } = render(
      <FormField label="Account ID">
        {(props) => <Input defaultValue="acct_10423" {...props} />}
      </FormField>,
    );
    expect(container.querySelector(".du_tooltip_root")).toBeNull();
  });

  it("does not wrap a disabled field with no value and no reason", () => {
    const { container } = render(
      <FormField label="Account ID" disabled>
        {(props) => <Input {...props} />}
      </FormField>,
    );
    expect(container.querySelector(".du_tooltip_root")).toBeNull();
  });
});
