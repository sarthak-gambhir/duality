import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "../src/components/toast/ToastProvider";

function Harness({ duration }: { duration?: number }) {
  const { toast } = useToast();
  return (
    <button
      onClick={() => toast({ title: "Hi", description: "Body", duration })}
    >
      show
    </button>
  );
}

describe("Toast", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows a toast and auto-dismisses after the duration", () => {
    render(
      <ToastProvider>
        <Harness duration={1000} />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText("show"));
    expect(screen.getByText("Hi")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });

  it("can be dismissed manually", () => {
    render(
      <ToastProvider>
        <Harness duration={0} />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText("show"));
    expect(screen.getByText("Hi")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });
});
