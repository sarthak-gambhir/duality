import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Card,
  CardBody,
  Inline,
  Input,
  Stack,
  Text,
  ThemeProvider,
  paletteNames,
  useTheme,
} from "../../src";

/**
 * `ThemeProvider` establishes a theme scope: it renders a `du_theme_root`
 * element carrying `data-theme` and `data-density`, from which `--fg`/`--bg` and
 * the spacing scale resolve. `useTheme()` reads and updates the active theme and
 * density from anywhere inside it. Providers nest, so any subtree can run its
 * own theme independent of the rest of the page.
 */
const meta: Meta<typeof ThemeProvider> = {
  title: "Theming/ThemeProvider",
  component: ThemeProvider,
  argTypes: {
    defaultTheme: {
      control: "select",
      options: paletteNames,
      description: "Initial theme name.",
    },
    defaultDensity: {
      control: "inline-radio",
      options: ["comfortable", "compact"],
      description: "Initial spacing/sizing density.",
    },
    storageKey: {
      control: "text",
      description: "When set, persists theme + density to `localStorage`.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

function ThemeSwitcher() {
  const { theme, density, setTheme, setDensity } = useTheme();
  return (
    <Stack gap={4}>
      <Text size="sm">
        Active theme: <strong>{theme}</strong> &middot; density:{" "}
        <strong>{density}</strong>
      </Text>
      <Inline gap={2} wrap>
        {paletteNames.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={name === theme ? "solid" : "ghost"}
            onClick={() => setTheme(name)}
          >
            {name}
          </Button>
        ))}
      </Inline>
      <Inline gap={2}>
        <Button
          size="sm"
          variant={density === "comfortable" ? "solid" : "ghost"}
          onClick={() => setDensity("comfortable")}
        >
          Comfortable
        </Button>
        <Button
          size="sm"
          variant={density === "compact" ? "solid" : "ghost"}
          onClick={() => setDensity("compact")}
        >
          Compact
        </Button>
      </Inline>
      <Input placeholder="Sample control follows the scope" />
    </Stack>
  );
}

/**
 * A self-contained theme scope. The nested `ThemeProvider` runs its own theme,
 * independent of the toolbar globals; `useTheme` drives it from the buttons.
 */
export const Scoped: Story = {
  render: () => (
    <ThemeProvider defaultTheme="phosphor">
      <Card>
        <CardBody>
          <ThemeSwitcher />
        </CardBody>
      </Card>
    </ThemeProvider>
  ),
};

/**
 * Two independent providers side by side, each pinned to its own theme, showing
 * that theme state is scoped to the subtree rather than global.
 */
export const NestedScopes: Story = {
  render: () => (
    <Inline gap={4} align="stretch" wrap>
      <ThemeProvider defaultTheme="classic">
        <Card>
          <CardBody>
            <Stack gap={2}>
              <Text weight="bold">Classic</Text>
              <Input placeholder="Scoped control" />
              <Button size="sm">Action</Button>
            </Stack>
          </CardBody>
        </Card>
      </ThemeProvider>
      <ThemeProvider defaultTheme="amber">
        <Card>
          <CardBody>
            <Stack gap={2}>
              <Text weight="bold">Amber CRT</Text>
              <Input placeholder="Scoped control" />
              <Button size="sm">Action</Button>
            </Stack>
          </CardBody>
        </Card>
      </ThemeProvider>
    </Inline>
  ),
};
