import { useMemo, useState } from "react";
import {
  Badge,
  Breadcrumbs,
  Button,
  ContextMenu,
  type ContextMenuItem,
  DataTable,
  type DataTableColumn,
  FileUpload,
  Inline,
  Menu,
  MenuItem,
  MenuSeparator,
  Stack,
  Text,
  ToastProvider,
  Tree,
  type TreeNode,
  useToast,
} from "../../src";
import { Frame, TopBar, formatSize } from "./_shared";

const tree: TreeNode[] = [
  {
    id: "root",
    label: "duality",
    children: [
      {
        id: "src",
        label: "src",
        children: [
          { id: "components", label: "components" },
          { id: "tokens", label: "tokens" },
          { id: "styles", label: "styles" },
        ],
      },
      {
        id: "assets",
        label: "assets",
        children: [
          { id: "images", label: "images" },
          { id: "fonts", label: "fonts", disabled: true },
        ],
      },
      { id: "docs", label: "docs" },
    ],
  },
];

interface FileRow {
  id: string;
  name: string;
  kind: "doc" | "image" | "code" | "folder";
  size: number;
  modified: string;
}

const filesByFolder: Record<string, FileRow[]> = {
  components: [
    {
      id: "c1",
      name: "Button.tsx",
      kind: "code",
      size: 4200,
      modified: "2026-07-01",
    },
    {
      id: "c2",
      name: "Select.tsx",
      kind: "code",
      size: 9800,
      modified: "2026-07-02",
    },
    {
      id: "c3",
      name: "Tree.tsx",
      kind: "code",
      size: 7100,
      modified: "2026-07-03",
    },
  ],
  tokens: [
    {
      id: "t1",
      name: "tokens.scss",
      kind: "code",
      size: 5600,
      modified: "2026-06-30",
    },
    {
      id: "t2",
      name: "scale.ts",
      kind: "code",
      size: 400,
      modified: "2026-06-29",
    },
  ],
  images: [
    {
      id: "i1",
      name: "logo.png",
      kind: "image",
      size: 88500,
      modified: "2026-06-28",
    },
    {
      id: "i2",
      name: "hero.jpg",
      kind: "image",
      size: 240000,
      modified: "2026-06-27",
    },
  ],
  docs: [
    {
      id: "d1",
      name: "README.md",
      kind: "doc",
      size: 4200,
      modified: "2026-07-01",
    },
    {
      id: "d2",
      name: "CHANGELOG.md",
      kind: "doc",
      size: 1200,
      modified: "2026-07-02",
    },
  ],
};

const pathOf: Record<string, string[]> = {
  components: ["duality", "src", "components"],
  tokens: ["duality", "src", "tokens"],
  styles: ["duality", "src", "styles"],
  images: ["duality", "assets", "images"],
  docs: ["duality", "docs"],
};

function Manager() {
  const { toast } = useToast();
  const [selected, setSelected] = useState("components");
  const [uploads, setUploads] = useState<File[]>([]);

  const rows = filesByFolder[selected] ?? [];
  const crumbs = useMemo(
    () => (pathOf[selected] ?? ["duality"]).map((label) => ({ label })),
    [selected],
  );

  const folderActions: ContextMenuItem[] = [
    {
      id: "new",
      label: "New folder",
      onSelect: () => toast({ title: "New folder created" }),
    },
    {
      id: "refresh",
      label: "Refresh",
      onSelect: () => toast({ title: "Refreshed" }),
    },
    { id: "sep", separator: true },
    {
      id: "upload",
      label: "Upload here",
      onSelect: () => toast({ title: "Choose files to upload" }),
    },
  ];

  const rowMenu = (row: FileRow) => (
    <Menu
      trigger={
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Actions for ${row.name}`}
        >
          ...
        </Button>
      }
      placement="bottom-end"
      aria-label={`${row.name} actions`}
    >
      <MenuItem
        onSelect={() => toast({ title: "Renamed", description: row.name })}
      >
        Rename
      </MenuItem>
      <MenuItem
        onSelect={() => toast({ title: "Duplicated", description: row.name })}
      >
        Duplicate
      </MenuItem>
      <MenuSeparator />
      <MenuItem
        onSelect={() =>
          toast({ title: "Deleted", description: row.name, tone: "warning" })
        }
      >
        Delete
      </MenuItem>
    </Menu>
  );

  const columns: DataTableColumn<FileRow>[] = [
    {
      id: "name",
      header: "Name",
      sortable: true,
      value: (r) => r.name,
      cell: (r) => (
        <Inline gap={2} wrap={false}>
          <Text weight="bold">{r.name}</Text>
        </Inline>
      ),
    },
    {
      id: "kind",
      header: "Kind",
      sortable: true,
      value: (r) => r.kind,
      cell: (r) => <Badge variant="outline">{r.kind}</Badge>,
    },
    {
      id: "size",
      header: "Size",
      align: "end",
      sortable: true,
      value: (r) => r.size,
      cell: (r) => formatSize(r.size),
    },
    {
      id: "modified",
      header: "Modified",
      sortable: true,
      value: (r) => r.modified,
      cell: (r) => r.modified,
    },
    {
      id: "actions",
      header: "",
      align: "end",
      cell: (r) => rowMenu(r),
    },
  ];

  return (
    <Frame>
      <TopBar title="Duality Files" />
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          borderBlockEnd: "var(--border-width) solid var(--fg)",
        }}
      >
        <Breadcrumbs items={crumbs} />
      </div>
      <div style={{ display: "flex", flex: 1, minBlockSize: 0 }}>
        <div
          style={{
            flex: "0 0 220px",
            overflow: "auto",
            padding: "var(--space-4)",
            borderInlineEnd: "var(--border-width) solid var(--fg)",
          }}
        >
          <Tree
            items={tree}
            label="Folders"
            defaultExpanded={["root", "src", "assets"]}
            selected={selected}
            onSelectedChange={setSelected}
          />
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "var(--space-5)" }}>
          <Stack gap={5}>
            <ContextMenu items={folderActions} aria-label="Folder actions">
              <DataTable
                columns={columns}
                data={rows}
                getRowId={(r) => r.id}
                initialSort={{ columnId: "name", direction: "asc" }}
                filterPlaceholder="Filter files..."
                emptyMessage="This folder is empty"
                aria-label="Files"
              />
            </ContextMenu>

            <Stack gap={2}>
              <Text as="h3" size="lg" weight="bold" style={{ margin: 0 }}>
                Upload
              </Text>
              <FileUpload
                multiple
                value={uploads}
                onValueChange={(next) => {
                  setUploads(next);
                  if (next.length > uploads.length) {
                    toast({
                      title: "Upload queued",
                      description: `${next.length} file(s)`,
                    });
                  }
                }}
              />
            </Stack>
          </Stack>
        </div>
      </div>
    </Frame>
  );
}

export function FileManagerDemo() {
  return (
    <ToastProvider>
      <Manager />
    </ToastProvider>
  );
}
