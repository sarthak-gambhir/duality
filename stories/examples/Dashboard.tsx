import { useState } from "react";
import {
  Avatar,
  Badge,
  Banner,
  Button,
  DataTable,
  type DataTableColumn,
  Inline,
  Progress,
  SideNav,
  type SideNavSection,
  Skeleton,
  Stack,
  Stat,
  Text,
  Timeline,
  type TimelineItem,
} from "../../src";
import { Frame, TopBar, users, type DemoUser } from "./_shared";

const navSections: SideNavSection[] = [
  {
    id: "main",
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview" },
      { id: "members", label: "Members" },
      { id: "billing", label: "Billing" },
      { id: "activity", label: "Activity" },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { id: "settings", label: "Settings" },
      { id: "logs", label: "Logs", disabled: true },
    ],
  },
];

const columns: DataTableColumn<DemoUser>[] = [
  {
    id: "name",
    header: "Member",
    sortable: true,
    value: (row) => row.name,
    cell: (row) => (
      <Inline gap={2} wrap={false}>
        <Avatar name={row.name} size="sm" />
        <Stack gap={0}>
          <Text weight="bold">{row.name}</Text>
          <Text size="sm">{row.email}</Text>
        </Stack>
      </Inline>
    ),
  },
  {
    id: "role",
    header: "Role",
    sortable: true,
    value: (row) => row.role,
    cell: (row) => row.role,
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    value: (row) => row.status,
    cell: (row) => (
      <Badge variant={row.status === "active" ? "solid" : "outline"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "seats",
    header: "Seats",
    align: "end",
    sortable: true,
    value: (row) => row.seats,
    cell: (row) => row.seats,
  },
];

const activity: TimelineItem[] = [
  {
    id: "a1",
    title: "Grace invited",
    time: "09:12",
    description: "Admin invite sent.",
    status: "complete",
  },
  {
    id: "a2",
    title: "Plan upgraded",
    time: "10:40",
    description: "Team -> Business.",
    status: "complete",
  },
  {
    id: "a3",
    title: "Seat limit reached",
    time: "13:05",
    description: "5 of 5 seats in use.",
    status: "current",
  },
  {
    id: "a4",
    title: "Renewal",
    time: "Jul 30",
    description: "Auto-renews.",
    status: "upcoming",
  },
];

export function DashboardDemo() {
  const [active, setActive] = useState("overview");
  const [loading, setLoading] = useState(false);

  const sections = navSections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onSelect: item.disabled ? undefined : () => setActive(item.id),
    })),
  }));

  return (
    <Frame>
      <TopBar title="Duality Console" />
      <div style={{ display: "flex", flex: 1, minBlockSize: 0 }}>
        <div
          style={{
            flex: "0 0 220px",
            padding: "var(--space-4)",
            borderInlineEnd: "var(--border-width) solid var(--fg)",
          }}
        >
          <SideNav sections={sections} activeId={active} aria-label="Console" />
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "var(--space-5)" }}>
          <Stack gap={5}>
            <Banner
              tone="warning"
              title="Seat limit reached"
              action={<Button size="sm">Add seats</Button>}
            >
              You are using all 5 seats on the Business plan.
            </Banner>

            <Inline gap={4} align="stretch">
              <Stat
                label="Members"
                value="6"
                delta="+2 this month"
                deltaDirection="up"
              />
              <Stat
                label="Active"
                value="4"
                delta="67%"
                deltaDirection="neutral"
              />
              <Stat
                label="Suspended"
                value="1"
                delta="+1"
                deltaDirection="down"
              />
              <Stat
                label="Seats used"
                value="16"
                delta="+3"
                deltaDirection="up"
              />
            </Inline>

            <div
              style={{
                display: "grid",
                gap: "var(--space-5)",
                gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
              }}
            >
              <Stack gap={3}>
                <Text as="h3" size="lg" weight="bold" style={{ margin: 0 }}>
                  Members
                </Text>
                <DataTable
                  columns={columns}
                  data={users}
                  getRowId={(row) => row.id}
                  initialSort={{ columnId: "name", direction: "asc" }}
                  filterPlaceholder="Filter members..."
                  aria-label="Members"
                />
              </Stack>

              <Stack gap={3}>
                <Text as="h3" size="lg" weight="bold" style={{ margin: 0 }}>
                  Activity
                </Text>
                <Timeline items={activity} />

                <Text weight="bold">Sync status</Text>
                {loading ? (
                  <Stack gap={2}>
                    <Progress indeterminate aria-label="Syncing" />
                    <Skeleton style={{ blockSize: 16 }} />
                    <Skeleton style={{ blockSize: 16, inlineSize: "70%" }} />
                  </Stack>
                ) : (
                  <Stack gap={2}>
                    <Progress value={72} aria-label="Storage used" />
                    <Text size="sm">72% of storage used</Text>
                  </Stack>
                )}
                <Button
                  variant="inverse"
                  size="sm"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 1600);
                  }}
                >
                  Simulate sync
                </Button>
              </Stack>
            </div>
          </Stack>
        </div>
      </div>
    </Frame>
  );
}
