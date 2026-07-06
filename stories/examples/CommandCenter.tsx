import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Code,
  CommandPalette,
  type Command,
  Divider,
  Inline,
  Kbd,
  Spinner,
  Stack,
  Stat,
  Table,
  TBody,
  Td,
  Text,
  Th,
  THead,
  ThemeProvider,
  Tr,
} from "../../src";

interface LogRow {
  id: number;
  time: string;
  node: string;
  event: string;
  level: "OK" | "WARN" | "ERR";
}

const seedLog: LogRow[] = [
  {
    id: 1,
    time: "00:00:01",
    node: "core-01",
    event: "boot sequence complete",
    level: "OK",
  },
  {
    id: 2,
    time: "00:00:04",
    node: "relay-07",
    event: "uplink acquired",
    level: "OK",
  },
  {
    id: 3,
    time: "00:00:09",
    node: "sensor-3",
    event: "calibration drift 0.2%",
    level: "WARN",
  },
  {
    id: 4,
    time: "00:00:12",
    node: "core-02",
    event: "packet retransmit",
    level: "WARN",
  },
];

const EVENTS = [
  "telemetry frame received",
  "buffer flushed",
  "checksum verified",
  "thermal nominal",
  "orbit adjust queued",
];

function now(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Console() {
  const [log, setLog] = useState<LogRow[]>(seedLog);
  const [uptime, setUptime] = useState(12);
  const [scanning, setScanning] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const nextId = useRef(seedLog.length + 1);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!scanning) return undefined;
    const timer = setInterval(() => {
      setUptime((u) => u + 3);
      setLog((prev) => {
        const id = nextId.current++;
        const row: LogRow = {
          id,
          time: now(uptime + 3),
          node: `node-${String((id % 9) + 1).padStart(2, "0")}`,
          event: EVENTS[id % EVENTS.length]!,
          level: id % 7 === 0 ? "ERR" : id % 3 === 0 ? "WARN" : "OK",
        };
        return [...prev.slice(-7), row];
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [scanning, uptime]);

  const packets = 4096 + log.length * 128;

  const commands: Command[] = [
    {
      id: "scan",
      label: scanning ? "Pause scan" : "Resume scan",
      group: "System",
      onSelect: () => setScanning((s) => !s),
    },
    {
      id: "clear",
      label: "Clear log",
      group: "System",
      onSelect: () => setLog([]),
    },
    {
      id: "ping",
      label: "Ping all nodes",
      group: "Network",
      onSelect: () =>
        setLog((prev) => [
          ...prev.slice(-7),
          {
            id: nextId.current++,
            time: now(uptime),
            node: "all",
            event: "ping broadcast",
            level: "OK",
          },
        ]),
    },
  ];

  return (
    <div
      style={{
        minBlockSize: "min(720px, 90vh)",
        padding: "var(--space-5)",
        border: "var(--border-width) solid var(--fg)",
      }}
    >
      <Stack gap={5}>
        <Inline justify="between" align="center">
          <Stack gap={0}>
            <Text as="h2" size="xl" weight="bold" mono style={{ margin: 0 }}>
              DUALITY // COMMAND CENTER
            </Text>
            <Text size="sm" mono>
              press <Kbd>Cmd K</Kbd> for command palette
            </Text>
          </Stack>
          <Inline gap={3}>
            <Badge variant={scanning ? "solid" : "outline"}>
              {scanning ? "SCANNING" : "PAUSED"}
            </Badge>
            <Button
              variant="inverse"
              size="sm"
              onClick={() => setPaletteOpen(true)}
            >
              Command
            </Button>
          </Inline>
        </Inline>

        <Divider />

        <Inline gap={4} align="stretch">
          <Stat label="Uptime" value={now(uptime)} />
          <Stat
            label="Packets"
            value={packets.toLocaleString()}
            delta="+128/s"
            deltaDirection="up"
          />
          <Stat
            label="Nodes"
            value="9"
            delta="0 down"
            deltaDirection="neutral"
          />
          <Stat
            label="Status"
            value={
              <Inline gap={2}>
                {scanning && <Spinner size="sm" label="Scanning" />}
                <span>{scanning ? "LIVE" : "IDLE"}</span>
              </Inline>
            }
          />
        </Inline>

        <Stack gap={2}>
          <Inline justify="between" align="center">
            <Text weight="bold" mono>
              EVENT LOG
            </Text>
            <Code>tail -f /var/log/duality</Code>
          </Inline>
          <Table aria-label="Event log">
            <THead>
              <Tr>
                <Th>Time</Th>
                <Th>Node</Th>
                <Th>Event</Th>
                <Th data-align="end">Level</Th>
              </Tr>
            </THead>
            <TBody>
              {log.length === 0 ? (
                <Tr>
                  <Td colSpan={4}>-- log cleared --</Td>
                </Tr>
              ) : (
                log.map((row) => (
                  <Tr key={row.id}>
                    <Td>
                      <Code>{row.time}</Code>
                    </Td>
                    <Td>
                      <Code>{row.node}</Code>
                    </Td>
                    <Td>{row.event}</Td>
                    <Td data-align="end">
                      <Badge variant={row.level === "OK" ? "outline" : "solid"}>
                        {row.level}
                      </Badge>
                    </Td>
                  </Tr>
                ))
              )}
            </TBody>
          </Table>
        </Stack>
      </Stack>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
        placeholder="Run a system command..."
      />
    </div>
  );
}

export function CommandCenterDemo() {
  return (
    <ThemeProvider defaultTheme="phosphor">
      <Console />
    </ThemeProvider>
  );
}
