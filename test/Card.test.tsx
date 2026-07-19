import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardBody,
  CardMedia,
} from "../src/components/card/Card";

describe("Card", () => {
  it("renders body content", () => {
    render(
      <Card>
        <CardBody>Hello</CardBody>
      </Card>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders as a link when interactive with as='a'", () => {
    render(
      <Card as="a" href="#go" interactive>
        <CardBody>Go</CardBody>
      </Card>,
    );
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("href", "#go");
    expect(link).toHaveClass("du_card_interactive");
  });

  it("renders a media region", () => {
    render(
      <Card>
        <CardMedia>
          <img src="x.png" alt="media" />
        </CardMedia>
      </Card>,
    );
    expect(screen.getByRole("img", { name: "media" })).toBeInTheDocument();
  });
});
