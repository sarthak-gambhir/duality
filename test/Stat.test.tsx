import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stat, StatGroup } from "../src/components/stat/Stat";

describe("Stat", () => {
  it("renders label and value", () => {
    render(<Stat label="Active users" value="12,480" />);
    expect(screen.getByText("Active users")).toBeInTheDocument();
    expect(screen.getByText("12,480")).toBeInTheDocument();
  });

  it("labels the delta direction for assistive tech", () => {
    render(
      <Stat label="Revenue" value="$48k" delta="+12%" deltaDirection="up" />,
    );
    expect(screen.getByRole("img", { name: "increase" })).toBeInTheDocument();
  });

  it("renders an icon slot", () => {
    render(
      <Stat
        label="Revenue"
        value="$48k"
        icon={<span data-testid="icon">$</span>}
      />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});

describe("StatGroup", () => {
  it("groups stats under a group role", () => {
    render(
      <StatGroup>
        <Stat label="A" value="1" />
        <Stat label="B" value="2" />
      </StatGroup>,
    );
    const group = screen.getByRole("group");
    expect(group).toBeInTheDocument();
    expect(group).toHaveTextContent("A");
    expect(group).toHaveTextContent("B");
  });
});
