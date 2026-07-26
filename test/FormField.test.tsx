import { render, screen } from "@testing-library/react";
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

describe("FormField disabled reason caption", () => {
  it("renders the reason caption and wires it via aria-describedby", () => {
    const { container } = render(
      <FormField label="Account ID" disabled disabledReason="Managed by admin">
        {(props) => <Input defaultValue="acct_10423" {...props} />}
      </FormField>,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Managed by admin");
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toContain(
      caption!.id,
    );
  });

  it("renders no caption for a disabled field with a value but no reason", () => {
    const { container } = render(
      <FormField label="Account ID" disabled>
        {(props) => <Input defaultValue="acct_10423" {...props} />}
      </FormField>,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
    expect(container.querySelector(".du_disabled_message_wrap")).toBeNull();
  });

  it("renders no caption for an enabled field", () => {
    const { container } = render(
      <FormField label="Account ID" disabledReason="Managed by admin">
        {(props) => <Input defaultValue="acct_10423" {...props} />}
      </FormField>,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
  });
});
