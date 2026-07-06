import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  CommandPalette,
  type Command,
  ContextMenu,
  type ContextMenuItem,
  Inline,
  Kbd,
  Menu,
  MenuItem,
  MenuSeparator,
  SideNav,
  type SideNavSection,
  Stack,
  Table,
  TBody,
  Td,
  Text,
  ToastProvider,
  Tr,
  useToast,
} from "../../src";
import { Frame, TopBar } from "./_shared";

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  folder: string;
  body: string;
}

const initialMessages: Message[] = [
  {
    id: "m1",
    from: "Ada Lovelace",
    subject: "Analytical engine notes",
    preview: "Attached are the notes on Bernoulli numbers...",
    time: "9:14",
    unread: true,
    folder: "inbox",
    body: "Attached are the notes on Bernoulli numbers. Let me know if the loop table makes sense before I hand it to the printer.",
  },
  {
    id: "m2",
    from: "Alan Turing",
    subject: "Re: decidability",
    preview: "The halting case is trickier than we thought...",
    time: "8:02",
    unread: true,
    folder: "inbox",
    body: "The halting case is trickier than we thought. I sketched a diagonal argument on the back of the napkin, will type it up.",
  },
  {
    id: "m3",
    from: "Grace Hopper",
    subject: "Compiler demo Friday",
    preview: "Bring the punch cards, I will bring the moth...",
    time: "Mon",
    unread: false,
    folder: "inbox",
    body: "Bring the punch cards, I will bring the moth. Demo is at 2pm sharp. We finally have the A-0 running end to end.",
  },
  {
    id: "m4",
    from: "Katherine Johnson",
    subject: "Trajectory review",
    preview: "Numbers check out for the re-entry window...",
    time: "Sun",
    unread: false,
    folder: "sent",
    body: "Numbers check out for the re-entry window. I re-ran them by hand to be safe; margins are comfortable.",
  },
];

const folders: SideNavSection[] = [
  {
    id: "mail",
    label: "Mail",
    items: [
      { id: "inbox", label: "Inbox" },
      { id: "sent", label: "Sent" },
      { id: "drafts", label: "Drafts", disabled: true },
      { id: "archive", label: "Archive" },
    ],
  },
];

function Client() {
  const { toast } = useToast();
  const [messages, setMessages] = useState(initialMessages);
  const [folder, setFolder] = useState("inbox");
  const [selectedId, setSelectedId] = useState<string | null>("m1");
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  const visible = useMemo(
    () => messages.filter((m) => m.folder === folder),
    [messages, folder],
  );
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const openMessage = (id: string) => {
    setSelectedId(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: false } : m)),
    );
  };

  const archive = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, folder: "archive" } : m)),
    );
    toast({
      title: "Archived",
      description: "Message moved to Archive.",
      tone: "info",
    });
  };

  const remove = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast({
      title: "Deleted",
      description: "Message removed.",
      tone: "warning",
    });
  };

  const markUnread = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: true } : m)),
    );
  };

  const [contextId, setContextId] = useState<string | null>(null);
  const contextTarget = messages.find((m) => m.id === contextId) ?? selected;
  const rowItems: ContextMenuItem[] = contextTarget
    ? [
        {
          id: "open",
          label: "Open",
          onSelect: () => openMessage(contextTarget.id),
        },
        {
          id: "unread",
          label: "Mark as unread",
          onSelect: () => markUnread(contextTarget.id),
        },
        { id: "sep", separator: true },
        {
          id: "archive",
          label: "Archive",
          onSelect: () => archive(contextTarget.id),
        },
        {
          id: "delete",
          label: "Delete",
          onSelect: () => remove(contextTarget.id),
        },
      ]
    : [{ id: "none", label: "No message", disabled: true }];

  const commands: Command[] = [
    ...messages.map((m) => ({
      id: `go_${m.id}`,
      label: `Open: ${m.subject}`,
      group: "Messages",
      keywords: [m.from],
      onSelect: () => {
        setFolder(m.folder);
        openMessage(m.id);
      },
    })),
    {
      id: "c_inbox",
      label: "Go to Inbox",
      group: "Navigate",
      onSelect: () => setFolder("inbox"),
    },
    {
      id: "c_sent",
      label: "Go to Sent",
      group: "Navigate",
      onSelect: () => setFolder("sent"),
    },
    {
      id: "c_archive",
      label: "Go to Archive",
      group: "Navigate",
      onSelect: () => setFolder("archive"),
    },
  ];

  const navSections = folders.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onSelect: item.disabled ? undefined : () => setFolder(item.id),
    })),
  }));

  return (
    <Frame>
      <TopBar
        title="Duality Mail"
        actions={
          <Button
            variant="inverse"
            size="sm"
            onClick={() => setPaletteOpen(true)}
          >
            Search <Kbd>Cmd K</Kbd>
          </Button>
        }
      />
      <div style={{ display: "flex", flex: 1, minBlockSize: 0 }}>
        <div
          style={{
            flex: "0 0 180px",
            padding: "var(--space-4)",
            borderInlineEnd: "var(--border-width) solid var(--fg)",
          }}
        >
          <SideNav
            sections={navSections}
            activeId={folder}
            aria-label="Folders"
          />
        </div>

        <div
          style={{
            flex: "0 0 320px",
            overflow: "auto",
            borderInlineEnd: "var(--border-width) solid var(--fg)",
          }}
        >
          {visible.length === 0 ? (
            <Text style={{ display: "block", padding: "var(--space-4)" }}>
              No messages.
            </Text>
          ) : (
            <ContextMenu items={rowItems} aria-label="Message actions">
              <Table aria-label={`${folder} messages`}>
                <TBody>
                  {visible.map((m) => (
                    <Tr
                      key={m.id}
                      data-selected={m.id === selectedId || undefined}
                      style={{
                        cursor: "pointer",
                        background:
                          m.id === selectedId ? "var(--fg)" : undefined,
                        color: m.id === selectedId ? "var(--bg)" : undefined,
                      }}
                      onClick={() => openMessage(m.id)}
                      onContextMenu={() => setContextId(m.id)}
                    >
                      <Td>
                        <Inline gap={2} wrap={false} align="start">
                          <Avatar name={m.from} size="sm" />
                          <Stack gap={0} style={{ minInlineSize: 0 }}>
                            <Inline gap={2} justify="between" wrap={false}>
                              <Text weight={m.unread ? "bold" : "normal"}>
                                {m.from}
                              </Text>
                              <Text size="sm">{m.time}</Text>
                            </Inline>
                            <Inline gap={2} wrap={false}>
                              {m.unread && <Badge>new</Badge>}
                              <Text weight={m.unread ? "bold" : "normal"}>
                                {m.subject}
                              </Text>
                            </Inline>
                            <Text size="sm">{m.preview}</Text>
                          </Stack>
                        </Inline>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </ContextMenu>
          )}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "var(--space-5)" }}>
          {selected ? (
            <Stack gap={4}>
              <Inline justify="between" align="start" wrap={false}>
                <Stack gap={1}>
                  <Text as="h3" size="xl" weight="bold" style={{ margin: 0 }}>
                    {selected.subject}
                  </Text>
                  <Inline gap={2}>
                    <Avatar name={selected.from} size="sm" />
                    <Text weight="bold">{selected.from}</Text>
                    <Text size="sm">{selected.time}</Text>
                  </Inline>
                </Stack>
                <Menu
                  trigger={
                    <Button variant="inverse" size="sm">
                      Actions
                    </Button>
                  }
                  placement="bottom-end"
                  aria-label="Message actions"
                >
                  <MenuItem onSelect={() => markUnread(selected.id)}>
                    Mark as unread
                  </MenuItem>
                  <MenuItem onSelect={() => archive(selected.id)}>
                    Archive
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem onSelect={() => remove(selected.id)}>
                    Delete
                  </MenuItem>
                </Menu>
              </Inline>
              <Text style={{ display: "block", maxWidth: 640 }}>
                {selected.body}
              </Text>
              <Inline gap={3}>
                <Button size="sm">Reply</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => archive(selected.id)}
                >
                  Archive
                </Button>
              </Inline>
            </Stack>
          ) : (
            <Text>Select a message to read.</Text>
          )}
        </div>
      </div>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
        placeholder="Jump to a message or folder..."
      />
    </Frame>
  );
}

export function EmailDemo() {
  return (
    <ToastProvider>
      <Client />
    </ToastProvider>
  );
}
