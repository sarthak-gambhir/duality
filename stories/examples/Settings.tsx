import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  ConfirmDialog,
  FileUpload,
  FormField,
  Inline,
  Input,
  PaletteSelect,
  RangeSlider,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  Textarea,
  ThemeToggle,
  ToggleGroup,
  ToggleGroupItem,
  useTheme,
} from "../../src";
import { Frame, TopBar } from "./_shared";

function ProfileTab() {
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("ada@duality.dev");
  const [avatar, setAvatar] = useState<File[]>([]);

  return (
    <Stack gap={4} style={{ maxWidth: 520 }}>
      <Inline gap={3}>
        <Avatar name={name} size="lg" />
        <Stack gap={1}>
          <Text weight="bold">{name}</Text>
          <Text size="sm">{email}</Text>
        </Stack>
      </Inline>

      <FormField label="Full name">
        {(props) => (
          <Input
            {...props}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
      </FormField>

      <FormField
        label="Email"
        hint="Used for sign-in and notifications."
        error={email.includes("@") ? undefined : "Enter a valid email address."}
      >
        {(props) => (
          <Input
            {...props}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
      </FormField>

      <FormField label="Bio">
        {(props) => (
          <Textarea {...props} rows={3} defaultValue="Countess of computing." />
        )}
      </FormField>

      <FormField label="Role">
        {(props) => (
          <Select
            {...props}
            defaultValue="owner"
            options={[
              { value: "owner", label: "Owner" },
              { value: "admin", label: "Admin" },
              { value: "member", label: "Member" },
            ]}
          />
        )}
      </FormField>

      <FormField label="Avatar" hint="PNG or JPG, up to 2 MB.">
        {() => (
          <FileUpload
            accept="image/*"
            value={avatar}
            onValueChange={setAvatar}
          />
        )}
      </FormField>

      <Inline gap={3}>
        <Button>Save changes</Button>
        <Button variant="ghost">Cancel</Button>
      </Inline>
    </Stack>
  );
}

function PreferencesTab() {
  const { density, setDensity } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [digest, setDigest] = useState(false);
  const [view, setView] = useState("comfortable");
  const [volume, setVolume] = useState<[number, number]>([20, 80]);

  return (
    <Stack gap={5} style={{ maxWidth: 520 }}>
      <Stack gap={3}>
        <Text as="h3" size="lg" weight="bold" style={{ margin: 0 }}>
          Appearance
        </Text>
        <Inline gap={4}>
          <ThemeToggle />
          <PaletteSelect aria-label="Palette" />
        </Inline>
        <FormField label="Density">
          {() => (
            <ToggleGroup
              type="single"
              value={density}
              onValueChange={(v) => setDensity(v as "comfortable" | "compact")}
              label="Density"
            >
              <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
              <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
            </ToggleGroup>
          )}
        </FormField>
        <FormField label="Default list view">
          {() => (
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => setView(v as string)}
              label="View"
            >
              <ToggleGroupItem value="comfortable">List</ToggleGroupItem>
              <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
              <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
            </ToggleGroup>
          )}
        </FormField>
      </Stack>

      <Stack gap={3}>
        <Text as="h3" size="lg" weight="bold" style={{ margin: 0 }}>
          Notifications
        </Text>
        <Switch
          label="Product notifications"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        <Switch
          label="Weekly digest email"
          checked={digest}
          onChange={(e) => setDigest(e.target.checked)}
        />
        <FormField label="Quiet hours">
          {() => (
            <RangeSlider
              value={volume}
              onValueChange={setVolume}
              minLabel="Start hour"
              maxLabel="End hour"
              max={24}
            />
          )}
        </FormField>
      </Stack>
    </Stack>
  );
}

function DangerTab() {
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <Card
      style={{
        maxWidth: 520,
        borderStyle: "double",
        borderWidth: "var(--border-width-thick)",
      }}
    >
      <CardHeader>
        <Text weight="bold">Danger zone</Text>
      </CardHeader>
      <CardBody>
        <Stack gap={3}>
          <Text>
            {deleted
              ? "Workspace deleted."
              : "Deleting the workspace removes all members, data, and billing. This cannot be undone."}
          </Text>
          <Inline>
            <Button
              variant="inverse"
              disabled={deleted}
              onClick={() => setConfirming(true)}
            >
              Delete workspace
            </Button>
          </Inline>
        </Stack>
      </CardBody>
      <ConfirmDialog
        isOpen={confirming}
        tone="danger"
        title="Delete workspace?"
        description="This permanently removes all members, data, and billing history."
        confirmLabel="Delete"
        onConfirm={() => {
          setDeleted(true);
          setConfirming(false);
        }}
        onCancel={() => setConfirming(false)}
      />
    </Card>
  );
}

export function SettingsDemo() {
  return (
    <Frame>
      <TopBar title="Settings" />
      <div style={{ flex: 1, overflow: "auto", padding: "var(--space-5)" }}>
        <Tabs defaultValue="profile">
          <TabList>
            <Tab value="profile">Profile</Tab>
            <Tab value="preferences">Preferences</Tab>
            <Tab value="danger">Danger</Tab>
          </TabList>
          <div style={{ paddingBlockStart: "var(--space-4)" }}>
            <TabPanel value="profile">
              <ProfileTab />
            </TabPanel>
            <TabPanel value="preferences">
              <PreferencesTab />
            </TabPanel>
            <TabPanel value="danger">
              <DangerTab />
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </Frame>
  );
}
