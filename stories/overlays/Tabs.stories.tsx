import type { Meta, StoryObj } from '@storybook/react';
import { Tab, TabList, TabPanel, Tabs, Text } from '../../src';

const meta: Meta<typeof Tabs> = {
  title: 'Overlays/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabList aria-label="Sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="specs">Specs</Tab>
        <Tab value="reviews">Reviews</Tab>
      </TabList>
      <TabPanel value="overview">
        <Text>Overview content. Use arrow keys to move between tabs.</Text>
      </TabPanel>
      <TabPanel value="specs">
        <Text>Specifications content.</Text>
      </TabPanel>
      <TabPanel value="reviews">
        <Text>Reviews content.</Text>
      </TabPanel>
    </Tabs>
  ),
};
