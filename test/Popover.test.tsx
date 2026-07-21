import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../src/components/button/Button";
import { Popover } from "../src/components/popover/Popover";

function renderPopover() {
  render(
    <Popover trigger={<Button>Open</Button>}>
      <p>Panel body</p>
    </Popover>,
  );
  return screen.getByRole("button", { name: "Open" });
}

describe("Popover", () => {
  it("toggles the panel and wires aria attributes", async () => {
    const user = userEvent.setup();
    const trigger = renderPopover();
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    const panel = screen.getByRole("dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);

    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("dismisses on outside press", async () => {
    const user = userEvent.setup();
    const trigger = renderPopover();
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("dismisses on Escape", async () => {
    const user = userEvent.setup();
    const trigger = renderPopover();
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exposes the resolved side via data-side and renders an arrow", async () => {
    const user = userEvent.setup();
    render(
      <Popover placement="top" arrow trigger={<Button>Open</Button>}>
        <p>Panel body</p>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("data-side");
    expect(panel.querySelector(".du_popover_arrow")).toBeInTheDocument();
  });

  it("supports a controlled open state", () => {
    const { rerender } = render(
      <Popover open={false} trigger={<Button>Open</Button>}>
        <p>Panel body</p>
      </Popover>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(
      <Popover open trigger={<Button>Open</Button>}>
        <p>Panel body</p>
      </Popover>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
