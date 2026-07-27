import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardMedia,
  Heading,
  Text,
} from "../../src";

const meta: Meta<typeof Card> = {
  title: "Display/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'Bordered surface composed with CardHeader/CardBody/CardFooter/CardMedia. Pass `interactive` (with `as="a"`/`as="button"`) to make the whole card actionable.',
      },
    },
  },
  argTypes: {
    interactive: {
      control: "boolean",
      description:
        'Adds focus ring + hover state; pair with as="a"/as="button".',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

function WithSectionsDemo() {
  const [count, setCount] = useState(0);
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <Heading level={3}>Card title</Heading>
      </CardHeader>
      <CardBody>
        <Text>
          Body content lives here, split from the header and footer by pixel
          rules.
        </Text>
      </CardBody>
      <CardFooter>
        <Button size="sm" onClick={() => setCount((prev) => prev + 1)}>
          Action
        </Button>
        {count > 0 && <Text size="sm">Ran {count}×</Text>}
      </CardFooter>
    </Card>
  );
}

export const Default: Story = {
  render: () => <WithSectionsDemo />,
};

export const WithMedia: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardMedia>
        <svg viewBox="0 0 360 160" role="img" aria-label="Placeholder">
          <rect width="360" height="160" fill="var(--fg)" />
        </svg>
      </CardMedia>
      <CardBody>
        <Heading level={3}>With media</Heading>
        <Text>A full-bleed media region framed by a pixel rule.</Text>
      </CardBody>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card
      as="a"
      href="#card"
      interactive
      style={{ maxWidth: 360, display: "block" }}
    >
      <CardBody>
        <Heading level={3}>Interactive card</Heading>
        <Text>The whole card is a link. Hover or focus to see the state.</Text>
      </CardBody>
    </Card>
  ),
};
