import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Button,
  Checkbox,
  Combobox,
  CommandPalette,
  DatePicker,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FileUpload,
  Inline,
  Input,
  Menu,
  MenuItem,
  MenuSeparator,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiSelect,
  NumberInput,
  PinInput,
  Progress,
  Radio,
  RadioGroup,
  RangeSlider,
  Rating,
  Select,
  SideNav,
  Skeleton,
  Slider,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TagInput,
  Text,
  Textarea,
  TimePicker,
  ToggleGroup,
  ToggleGroupItem,
  useDisclosure,
  type Command,
  type SelectOption,
  type SideNavItem,
} from "../../src";

/**
 * One place to eyeball every control in its normal state next to its disabled
 * state, plus every surface that leans on the dither pattern even without a
 * disabled state.
 *
 * Two disabled languages are in play:
 * - **Hatch** (diagonal lines + a --bg text-stroke plate behind the value):
 *   used on the value-entry controls so the value stays readable while the
 *   field clearly reads as locked. See the `du_disabled_field` mixin.
 * - **Dither** (checkerboard): used everywhere else - simpler selection
 *   controls, disabled option rows, internal chrome, and purely decorative
 *   fills like skeletons, tracks, and backdrop scrims.
 *
 * Both textures are driven by the same token, so the **Texture** toolbar
 * control flips every surface below between dither and hatch live - no need for
 * a separate side-by-side mock.
 */
const meta: Meta = {
  title: "Foundations/Disabled & Dither",
  parameters: {
    docsMinHeight: 320,
    docs: {
      description: {
        component:
          "Gallery of normal vs disabled for every control, followed by every place the dither (checkerboard) pattern is used even when there is no disabled state. Value-entry controls use the hatch fill; everything else uses dither. Flip the **Texture** toolbar control to preview any of it as hatch.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// -- Shared layout ----------------------------------------------------------

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(96px, max-content) minmax(0, 1fr) minmax(0, 1fr)",
  columnGap: "var(--space-5)",
  rowGap: "var(--space-4)",
  alignItems: "start",
  maxWidth: 820,
};

const headStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  fontSize: 14,
  paddingBottom: "var(--space-1)",
  borderBottom: "var(--border-width) solid var(--fg)",
};

const nameStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  paddingBlockStart: "var(--space-2)",
};

function Grid({ children }: { children: ReactNode }) {
  return (
    <div style={gridStyle}>
      <div />
      <div style={headStyle}>Normal</div>
      <div style={headStyle}>Disabled</div>
      {children}
    </div>
  );
}

function Row({
  name,
  normal,
  disabled,
}: {
  name: string;
  normal: ReactNode;
  disabled: ReactNode;
}) {
  return (
    <>
      <div style={nameStyle}>{name}</div>
      <div>{normal}</div>
      <div>{disabled}</div>
    </>
  );
}

// -- Sample data ------------------------------------------------------------

const palettes: SelectOption[] = [
  { value: "classic", label: "Classic" },
  { value: "paper", label: "Paper" },
  { value: "amber", label: "Amber" },
  { value: "crt", label: "CRT (unavailable)", disabled: true },
];

const frameworks: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular", disabled: true },
];

// -- Value-entry controls (hatch on disabled) -------------------------------

/**
 * Value-entry controls. Disabled fills the field with the diagonal hatch and
 * keeps the value legible on a --bg text-stroke plate. A `disabledReason`
 * renders a persistent caption below the control (wired via `aria-describedby`).
 */
export const Default: Story = {
  render: () => (
    <Grid>
      <Row
        name="Input"
        normal={<Input defaultValue="Ada Lovelace" aria-label="name" />}
        disabled={
          <Input
            defaultValue="Ada Lovelace"
            disabled
            disabledReason="Managed by your identity provider"
            aria-label="name"
          />
        }
      />
      <Row
        name="Input (group)"
        normal={<Input prefix="$" suffix="USD" defaultValue="42.00" aria-label="amount" />}
        disabled={
          <Input prefix="$" suffix="USD" defaultValue="42.00" disabled aria-label="amount" />
        }
      />
      <Row
        name="Textarea"
        normal={<Textarea defaultValue={"Release notes\nfor v2.0"} rows={3} aria-label="notes" />}
        disabled={
          <Textarea defaultValue={"Release notes\nfor v2.0"} rows={3} disabled aria-label="notes" />
        }
      />
      <Row
        name="NumberInput"
        normal={<NumberInput defaultValue={3} min={0} max={10} aria-label="qty" />}
        disabled={
          <NumberInput
            defaultValue={3}
            min={0}
            max={10}
            disabled
            disabledReason="Set by your plan tier"
            aria-label="qty"
          />
        }
      />
      <Row
        name="Select"
        normal={<Select options={palettes} defaultValue="amber" aria-label="palette" />}
        disabled={
          <Select
            options={palettes}
            defaultValue="amber"
            disabled
            disabledReason="Locked for this workspace"
            aria-label="palette"
          />
        }
      />
      <Row
        name="Combobox"
        normal={<Combobox options={palettes} defaultValue="paper" aria-label="palette 2" />}
        disabled={
          <Combobox options={palettes} defaultValue="paper" disabled aria-label="palette 2" />
        }
      />
      <Row
        name="MultiSelect"
        normal={
          <MultiSelect options={frameworks} defaultValue={["react", "svelte"]} aria-label="stack" />
        }
        disabled={
          <MultiSelect
            options={frameworks}
            defaultValue={["react", "svelte"]}
            disabled
            disabledReason="Framework set is fixed"
            aria-label="stack"
          />
        }
      />
      <Row
        name="TagInput"
        normal={<TagInput defaultValue={["design", "system"]} aria-label="tags" />}
        disabled={
          <TagInput defaultValue={["design", "system"]} disabled aria-label="tags" />
        }
      />
      <Row
        name="DatePicker"
        normal={<DatePicker defaultValue={new Date(2026, 6, 15)} aria-label="date" />}
        disabled={
          <DatePicker
            defaultValue={new Date(2026, 6, 15)}
            disabled
            disabledReason="Billing period is locked"
            aria-label="date"
          />
        }
      />
      <Row
        name="TimePicker"
        normal={<TimePicker defaultValue="09:30" aria-label="time" />}
        disabled={<TimePicker defaultValue="09:30" disabled aria-label="time" />}
      />
      <Row
        name="PinInput"
        normal={<PinInput defaultValue="1234" />}
        disabled={<PinInput defaultValue="1234" disabled />}
      />
    </Grid>
  ),
};

// -- Selection / action controls (dither on disabled) -----------------------

/**
 * Selection and action controls. Their disabled state uses the checkerboard
 * dither rather than the hatch - the value here is a state (on/off, selected),
 * not free text, so there is nothing to keep "readable" behind a plate.
 */
export const SelectionControls: Story = {
  render: () => (
    <Grid>
      <Row
        name="Button"
        normal={<Button>Save changes</Button>}
        disabled={<Button disabled>Save changes</Button>}
      />
      <Row
        name="Checkbox"
        normal={<Checkbox label="Accept terms" defaultChecked />}
        disabled={<Checkbox label="Accept terms" defaultChecked disabled />}
      />
      <Row
        name="Radio"
        normal={
          <RadioGroup label="Plan" defaultValue="pro">
            <Radio value="pro" label="Pro" />
            <Radio value="team" label="Team" />
          </RadioGroup>
        }
        disabled={
          <RadioGroup label="Plan" defaultValue="pro" disabled>
            <Radio value="pro" label="Pro" />
            <Radio value="team" label="Team" />
          </RadioGroup>
        }
      />
      <Row
        name="Switch"
        normal={<Switch label="Notifications" defaultChecked />}
        disabled={<Switch label="Notifications" defaultChecked disabled />}
      />
      <Row
        name="ToggleGroup"
        normal={
          <ToggleGroup type="single" defaultValue="center" label="Align">
            <ToggleGroupItem value="left">L</ToggleGroupItem>
            <ToggleGroupItem value="center">C</ToggleGroupItem>
            <ToggleGroupItem value="right">R</ToggleGroupItem>
          </ToggleGroup>
        }
        disabled={
          <ToggleGroup type="single" defaultValue="center" label="Align" disabled>
            <ToggleGroupItem value="left">L</ToggleGroupItem>
            <ToggleGroupItem value="center">C</ToggleGroupItem>
            <ToggleGroupItem value="right">R</ToggleGroupItem>
          </ToggleGroup>
        }
      />
      <Row
        name="Rating"
        normal={<Rating defaultValue={3} label="Score" />}
        disabled={<Rating defaultValue={3} label="Score" disabled />}
      />
      <Row
        name="Slider"
        normal={<Slider defaultValue={40} showValue aria-label="volume" />}
        disabled={<Slider defaultValue={40} showValue disabled aria-label="volume" />}
      />
      <Row
        name="RangeSlider"
        normal={<RangeSlider defaultValue={[30, 70]} showValues />}
        disabled={<RangeSlider defaultValue={[30, 70]} showValues disabled />}
      />
      <Row
        name="FileUpload"
        normal={<FileUpload />}
        disabled={<FileUpload disabled />}
      />
    </Grid>
  ),
};

// -- Disabled items inside a larger component --------------------------------

const navItems: SideNavItem[] = [
  { id: "overview", label: "Overview", href: "#" },
  { id: "projects", label: "Projects", href: "#" },
  { id: "billing", label: "Billing", href: "#", disabled: true },
];

/**
 * Some components stay enabled but disable an individual row. Those rows use the
 * dither pattern too: a disabled `Tab`, a disabled `SideNav` item, and disabled
 * option rows inside `Select`/`Combobox`/`MultiSelect` listboxes (open one to
 * see the dithered, unselectable row).
 */
export const DisabledItems: Story = {
  render: () => (
    <Stack gap={5} style={{ maxWidth: 520 }}>
      <Stack gap={2}>
        <Text size="sm">Tabs - the third tab is disabled (dithered):</Text>
        <Tabs defaultValue="overview">
          <TabList aria-label="Sections">
            <Tab value="overview">Overview</Tab>
            <Tab value="specs">Specs</Tab>
            <Tab value="archived" disabled>
              Archived
            </Tab>
          </TabList>
          <TabPanel value="overview">
            <Text>Overview content.</Text>
          </TabPanel>
          <TabPanel value="specs">
            <Text>Specs content.</Text>
          </TabPanel>
          <TabPanel value="archived">
            <Text>Archived content.</Text>
          </TabPanel>
        </Tabs>
      </Stack>

      <Stack gap={2}>
        <Text size="sm">SideNav - the Billing item is disabled (dithered):</Text>
        <div style={{ maxWidth: 240 }}>
          <SideNav items={navItems} activeId="overview" />
        </div>
      </Stack>

      <Stack gap={2}>
        <Text size="sm">
          Select - open it; the CRT option row is disabled (dithered):
        </Text>
        <Select options={palettes} defaultValue="classic" aria-label="palette 3" />
      </Stack>
    </Stack>
  ),
};

// -- Dither used without any disabled state ----------------------------------

/**
 * The dither pattern is also the system's neutral "textured fill", used with no
 * disabled state at all: loading skeletons, progress tracks, disabled slider
 * tracks (shown above), and the semi-opaque scrims behind overlays (Modal,
 * Drawer, CommandPalette).
 */
export const DitherWithoutDisabled: Story = {
  render: () => (
    <Stack gap={5} style={{ maxWidth: 520 }}>
      <Stack gap={2}>
        <Text size="sm">Skeleton - dither fill as a loading placeholder:</Text>
        <Stack gap={2}>
          <Skeleton height={24} width="60%" />
          <Skeleton />
          <Skeleton width="80%" />
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Text size="sm">Progress - dithered track behind the fill:</Text>
        <Stack gap={3}>
          <Progress value={40} showValue aria-label="upload" />
          <Progress indeterminate aria-label="loading" />
        </Stack>
      </Stack>

      <Text size="sm">
        Overlay scrims and disabled menu rows are dithered too - open them live
        in the next section. Flip the <strong>Texture</strong> toolbar control to
        see any of these surfaces rendered as hatch instead.
      </Text>
    </Stack>
  ),
};

// -- Dithered overlays and menus (open them live) ----------------------------

function ModalScrimDemo() {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>Open modal</Button>
      <Modal isOpen={isOpen} onClose={close} aria-labelledby="dither_modal_title">
        <ModalHeader>
          <Text id="dither_modal_title" weight="bold" size="lg">
            Dither scrim
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text>The page behind this dialog is dimmed with the dither pattern.</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={close}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

function DrawerScrimDemo() {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>Open drawer</Button>
      <Drawer
        isOpen={isOpen}
        onClose={close}
        side="end"
        showCloseButton
        aria-labelledby="dither_drawer_title"
      >
        <DrawerHeader>
          <Text id="dither_drawer_title" weight="bold" size="lg">
            Dither scrim
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Text>The edge panel dims the page with the same dither scrim.</Text>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="ghost" onClick={close}>
            Close
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}

function CommandPaletteScrimDemo() {
  const { isOpen, open, close } = useDisclosure();
  const [last, setLast] = useState<string | null>(null);
  const commands: Command[] = [
    { id: "new", label: "New file", group: "File", onSelect: () => setLast("New file") },
    { id: "open", label: "Open file", group: "File", onSelect: () => setLast("Open file") },
    {
      id: "paste",
      label: "Paste (disabled)",
      group: "Edit",
      disabled: true,
      onSelect: () => setLast("Paste"),
    },
  ];
  return (
    <Inline gap={3} align="center">
      <Button onClick={open}>Open command palette</Button>
      <Text size="sm">Ran: {last ?? "none"}</Text>
      <CommandPalette isOpen={isOpen} onClose={close} commands={commands} />
    </Inline>
  );
}

function MenuDisabledDemo() {
  const [action, setAction] = useState<string | null>(null);
  return (
    <Inline gap={3} align="center">
      <Menu trigger={<Button>Actions</Button>} aria-label="Actions">
        <MenuItem onSelect={() => setAction("Edit")}>Edit</MenuItem>
        <MenuItem onSelect={() => setAction("Duplicate")}>Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem disabled>Archive (disabled)</MenuItem>
      </Menu>
      <Text size="sm">Last action: {action ?? "none"}</Text>
    </Inline>
  );
}

/**
 * The dithered surfaces that live inside overlays, rendered with real triggers
 * so you can open them. Modal, Drawer, and CommandPalette dim the page with a
 * dither scrim; Menu and CommandPalette dither their disabled rows. Flip the
 * **Texture** toolbar control to open them as hatch instead.
 */
export const OverlayScrimsAndMenus: Story = {
  render: () => (
    <Stack gap={5} style={{ maxWidth: 520 }}>
      <Stack gap={2}>
        <Text size="sm">Modal - dither scrim dims the page behind the dialog:</Text>
        <ModalScrimDemo />
      </Stack>
      <Stack gap={2}>
        <Text size="sm">Drawer - same dither scrim behind an edge panel:</Text>
        <DrawerScrimDemo />
      </Stack>
      <Stack gap={2}>
        <Text size="sm">
          CommandPalette - dither scrim, plus a dithered disabled command row:
        </Text>
        <CommandPaletteScrimDemo />
      </Stack>
      <Stack gap={2}>
        <Text size="sm">Menu - the Archive row is disabled (dithered):</Text>
        <MenuDisabledDemo />
      </Stack>
    </Stack>
  ),
};
