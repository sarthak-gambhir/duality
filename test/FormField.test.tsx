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
});
