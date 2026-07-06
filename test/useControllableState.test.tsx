import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "../src/utils/useControllableState";

function Counter({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (n: number) => void;
}) {
  const [count, setCount] = useControllableState<number>({
    value,
    defaultValue: 0,
    onChange,
  });
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount((prev) => prev + 1)}>inc-fn</button>
      <button onClick={() => setCount(10)}>set-10</button>
    </div>
  );
}

describe("useControllableState", () => {
  it("resolves an updater function in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByText("inc-fn"));
    await user.click(screen.getByText("inc-fn"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  it("accepts a plain value in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByText("set-10"));
    expect(screen.getByTestId("count")).toHaveTextContent("10");
  });

  it("resolves an updater against the controlled value and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Counter value={5} onChange={onChange} />);
    await user.click(screen.getByText("inc-fn"));
    // Controlled: internal state does not change, but onChange gets prev + 1.
    expect(onChange).toHaveBeenCalledWith(6);
    expect(screen.getByTestId("count")).toHaveTextContent("5");
  });
});
