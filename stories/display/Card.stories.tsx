import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "../../src";

const meta: Meta<typeof Card> = {
  title: "Display/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const WithSections: Story = {
  render: () => (
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
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};
