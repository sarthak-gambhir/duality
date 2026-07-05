import {
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

export interface TreeNode {
  /** Unique node id. */
  id: string;
  /** Node label. */
  label: ReactNode;
  /** Child nodes. */
  children?: TreeNode[];
  /** Prevents selection. */
  disabled?: boolean;
}

interface FlatNode {
  node: TreeNode;
  level: number;
  hasChildren: boolean;
}

export interface TreeProps
  extends Omit<ComponentPropsWithoutRef<"ul">, "onChange"> {
  /** Tree data. */
  items: TreeNode[];
  /** Expanded node ids (controlled). */
  expanded?: string[];
  /** Initially expanded node ids (uncontrolled). */
  defaultExpanded?: string[];
  /** Called with the new set of expanded ids. */
  onExpandedChange?: (ids: string[]) => void;
  /** Selected node id (controlled). */
  selected?: string;
  /** Initially selected node id (uncontrolled). */
  defaultSelected?: string;
  /** Called with the newly selected id. */
  onSelectedChange?: (id: string) => void;
  /** Accessible tree label. */
  label?: string;
}

function flatten(
  nodes: TreeNode[],
  expanded: Set<string>,
  level = 1,
  acc: FlatNode[] = [],
): FlatNode[] {
  for (const node of nodes) {
    const hasChildren = !!node.children?.length;
    acc.push({ node, level, hasChildren });
    if (hasChildren && expanded.has(node.id)) {
      flatten(node.children as TreeNode[], expanded, level + 1, acc);
    }
  }
  return acc;
}

/**
 * Data-driven tree. `role="tree"` with roving focus over the visible nodes:
 * Up/Down move, Right expands or descends, Left collapses or ascends, Home/End
 * jump, Enter/Space select. Selection inverts the row (never color alone).
 */
export function Tree({
  items,
  expanded,
  defaultExpanded,
  onExpandedChange,
  selected,
  defaultSelected,
  onSelectedChange,
  label,
  className,
  ...rest
}: TreeProps) {
  const [expandedList, setExpandedList] = useControllableState<string[]>({
    value: expanded,
    defaultValue: defaultExpanded ?? [],
    onChange: onExpandedChange,
  });
  const [selectedId, setSelectedId] = useControllableState<string | undefined>({
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange as (v: string | undefined) => void,
  });

  const expandedSet = useMemo(() => new Set(expandedList), [expandedList]);
  const flat = useMemo(
    () => flatten(items, expandedSet),
    [items, expandedSet],
  );

  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);
  const rootRef = useRef<HTMLUListElement>(null);

  const focusNode = (id: string) => {
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-tree-id="${id}"]`)
      ?.focus();
  };
  const setActive = (id: string) => {
    setActiveId(id);
    focusNode(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedList(
      expandedSet.has(id)
        ? expandedList.filter((x) => x !== id)
        : [...expandedList, id],
    );
  };
  const expandNode = (id: string) => {
    if (!expandedSet.has(id)) setExpandedList([...expandedList, id]);
  };
  const collapseNode = (id: string) => {
    if (expandedSet.has(id)) setExpandedList(expandedList.filter((x) => x !== id));
  };

  const select = (node: TreeNode) => {
    if (!node.disabled) setSelectedId(node.id);
  };

  const indexOf = (id?: string) => flat.findIndex((f) => f.node.id === id);
  const parentOf = (index: number): FlatNode | undefined => {
    const { level } = flat[index] as FlatNode;
    for (let i = index - 1; i >= 0; i -= 1) {
      if ((flat[i] as FlatNode).level === level - 1) return flat[i];
    }
    return undefined;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const currentId = activeId ?? flat[0]?.node.id;
    const index = indexOf(currentId);
    if (index < 0) return;
    const entry = flat[index] as FlatNode;
    const { node, hasChildren } = entry;

    switch (event.key) {
      case "ArrowDown": {
        const nextNode = flat[index + 1];
        if (nextNode) {
          event.preventDefault();
          setActive(nextNode.node.id);
        }
        break;
      }
      case "ArrowUp": {
        const prev = flat[index - 1];
        if (prev) {
          event.preventDefault();
          setActive(prev.node.id);
        }
        break;
      }
      case "Home": {
        event.preventDefault();
        if (flat[0]) setActive(flat[0].node.id);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = flat[flat.length - 1];
        if (last) setActive(last.node.id);
        break;
      }
      case "ArrowRight": {
        if (hasChildren) {
          event.preventDefault();
          if (!expandedSet.has(node.id)) expandNode(node.id);
          else if (flat[index + 1]) setActive((flat[index + 1] as FlatNode).node.id);
        }
        break;
      }
      case "ArrowLeft": {
        if (hasChildren && expandedSet.has(node.id)) {
          event.preventDefault();
          collapseNode(node.id);
        } else {
          const parent = parentOf(index);
          if (parent) {
            event.preventDefault();
            setActive(parent.node.id);
          }
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        select(node);
        if (hasChildren) toggleExpand(node.id);
        break;
      }
      default:
        break;
    }
  };

  const activeOrFirst = activeId ?? flat[0]?.node.id;

  const renderNodes = (nodes: TreeNode[], level: number): ReactNode => (
    <ul
      role={level === 1 ? "tree" : "group"}
      aria-label={level === 1 ? label : undefined}
      className={level === 1 ? cx("du_tree", className) : "du_tree_group"}
      ref={level === 1 ? rootRef : undefined}
      onKeyDown={level === 1 ? onKeyDown : undefined}
      {...(level === 1 ? rest : {})}
    >
      {nodes.map((node) => {
        const hasChildren = !!node.children?.length;
        const isExpanded = expandedSet.has(node.id);
        const isSelected = selectedId === node.id;
        return (
          <li
            key={node.id}
            role="treeitem"
            aria-label={typeof node.label === "string" ? node.label : undefined}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={isSelected}
            aria-level={level}
            aria-disabled={node.disabled || undefined}
            data-tree-id={node.id}
            data-selected={isSelected || undefined}
            tabIndex={activeOrFirst === node.id ? 0 : -1}
            className="du_tree_item"
            onClick={(event) => {
              event.stopPropagation();
              setActiveId(node.id);
              select(node);
              if (hasChildren) toggleExpand(node.id);
            }}
          >
            <div
              className="du_tree_row"
              style={{ paddingInlineStart: `calc(${level - 1} * var(--space-4))` }}
            >
              {hasChildren ? (
                <span
                  className="du_tree_caret"
                  data-open={isExpanded || undefined}
                  aria-hidden="true"
                />
              ) : (
                <span className="du_tree_spacer" aria-hidden="true" />
              )}
              <span className="du_tree_label">{node.label}</span>
            </div>
            {hasChildren && isExpanded &&
              renderNodes(node.children as TreeNode[], level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return renderNodes(items, 1);
}
