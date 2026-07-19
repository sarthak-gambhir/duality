import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarGroup } from "../src/components/avatar/Avatar";

describe("Avatar", () => {
  it("derives initials from the name", () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("names the container when showing initials only", () => {
    render(<Avatar name="Grace Hopper" />);
    expect(screen.getByRole("img", { name: "Grace Hopper" })).toBeInTheDocument();
  });

  it("renders an image when src is provided", () => {
    render(<Avatar name="Ada" src="https://example.com/a.png" />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/a.png",
    );
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar name="Ada Lovelace" src="https://example.com/broken.png" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});

describe("AvatarGroup", () => {
  it("collapses avatars beyond max into a surplus chip", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Alan Turing" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Katherine Johnson" />
      </AvatarGroup>,
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "2 more" }),
    ).toBeInTheDocument();
  });

  it("shows all avatars when under max", () => {
    render(
      <AvatarGroup max={5}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Alan Turing" />
      </AvatarGroup>,
    );
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });
});
