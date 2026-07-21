import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ToastProvider,
  useToast,
  type ToastOptions,
} from "../src/components/toast/ToastProvider";

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

function OptionHarness({ options }: { options: ToastOptions }) {
  const { toast, dismissAll } = useToast();
  return (
    <>
      <button onClick={() => toast(options)}>show</button>
      <button onClick={dismissAll}>clear</button>
    </>
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

  it("renders an accessible live region", () => {
    render(
      <ToastProvider>
        <Harness duration={0} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("show"));
    const region = screen.getByRole("region", { name: "Notifications" });
    expect(region).toHaveAttribute("aria-live", "polite");
  });

  it("uses an assertive live region when an error toast is present", () => {
    render(
      <ToastProvider>
        <OptionHarness options={{ tone: "error", title: "Boom", duration: 0 }} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("show"));
    expect(
      screen.getByRole("region", { name: "Notifications" }),
    ).toHaveAttribute("aria-live", "assertive");
  });

  it("runs an action and dismisses the toast", () => {
    const onClick = vi.fn();
    render(
      <ToastProvider>
        <OptionHarness
          options={{ title: "Deleted", duration: 0, action: { label: "Undo", onClick } }}
        />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("show"));
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByText("Deleted")).not.toBeInTheDocument();
  });

  it("pauses the auto-dismiss timer while hovered", () => {
    render(
      <ToastProvider>
        <Harness duration={1000} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("show"));
    const region = screen.getByRole("region", { name: "Notifications" });

    fireEvent.mouseEnter(region);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // Still visible: the timer is paused while hovered.
    expect(screen.getByText("Hi")).toBeInTheDocument();

    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });

  it("dismisses all toasts", () => {
    render(
      <ToastProvider>
        <OptionHarness options={{ title: "Keep", duration: 0 }} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("show"));
    fireEvent.click(screen.getByText("show"));
    expect(screen.getAllByText("Keep")).toHaveLength(2);

    fireEvent.click(screen.getByText("clear"));
    expect(screen.queryByText("Keep")).not.toBeInTheDocument();
  });
});
