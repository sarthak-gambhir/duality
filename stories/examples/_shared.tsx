import type { ReactNode } from "react";
import { Inline, PaletteSelect, Text, ThemeToggle } from "../../src";

/**
 * Shared scaffolding + mock data for the Examples demos. These are showcase
 * pages that compose only public exports, so they double as usage references.
 */

/** A bordered, full-height page shell for a demo. */
export function Frame({
  children,
  style,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minBlockSize: "min(720px, 90vh)",
        border: "var(--border-width) solid var(--fg)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** App title bar with the theme + palette controls on the trailing edge. */
export function TopBar({
  title,
  actions,
}: {
  title: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Inline
      justify="between"
      align="center"
      wrap={false}
      style={{
        padding: "var(--space-3) var(--space-4)",
        borderBlockEnd: "var(--border-width) solid var(--fg)",
      }}
    >
      <Text as="h2" size="lg" weight="bold" style={{ margin: 0 }}>
        {title}
      </Text>
      <Inline gap={3} wrap={false}>
        {actions}
        <PaletteSelect aria-label="Palette" />
        <ThemeToggle />
      </Inline>
    </Inline>
  );
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  status: "active" | "invited" | "suspended";
  seats: number;
}

export const users: DemoUser[] = [
  {
    id: "u1",
    name: "Ada Lovelace",
    email: "ada@duality.dev",
    role: "Owner",
    status: "active",
    seats: 5,
  },
  {
    id: "u2",
    name: "Alan Turing",
    email: "alan@duality.dev",
    role: "Admin",
    status: "active",
    seats: 3,
  },
  {
    id: "u3",
    name: "Grace Hopper",
    email: "grace@duality.dev",
    role: "Admin",
    status: "invited",
    seats: 1,
  },
  {
    id: "u4",
    name: "Katherine Johnson",
    email: "katherine@duality.dev",
    role: "Member",
    status: "active",
    seats: 2,
  },
  {
    id: "u5",
    name: "Linus Torvalds",
    email: "linus@duality.dev",
    role: "Member",
    status: "suspended",
    seats: 1,
  },
  {
    id: "u6",
    name: "Margaret Hamilton",
    email: "margaret@duality.dev",
    role: "Member",
    status: "active",
    seats: 4,
  },
];

export interface DemoFile {
  id: string;
  name: string;
  kind: "folder" | "doc" | "image" | "code";
  size: number;
  modified: string;
}

export const files: DemoFile[] = [
  {
    id: "f1",
    name: "README.md",
    kind: "doc",
    size: 4200,
    modified: "2026-06-30",
  },
  {
    id: "f2",
    name: "logo.png",
    kind: "image",
    size: 88500,
    modified: "2026-06-28",
  },
  {
    id: "f3",
    name: "index.ts",
    kind: "code",
    size: 12700,
    modified: "2026-07-01",
  },
  {
    id: "f4",
    name: "tokens.scss",
    kind: "code",
    size: 5600,
    modified: "2026-07-02",
  },
  {
    id: "f5",
    name: "notes.txt",
    kind: "doc",
    size: 900,
    modified: "2026-06-20",
  },
];

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
