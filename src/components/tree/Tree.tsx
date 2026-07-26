import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";
import { useControllableState } from "../../utils/useControllableState";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

export interface TreeNode {
  /** Unique node id. */
  id: string;
  /** Node label. */
  label: ReactNode;
  /** Leading icon/marker (decorative). */
  icon?: ReactNode;
  /** Plain-text value for typeahead / aria when `label` is not a string. */
  textValue?: string;
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

export interface TreeProps extends Omit<
  ComponentPropsWithoutRef<"ul">,
  "onChange"
> {
  /** Tree data. */
  items: TreeNode[];
  /** Expanded node ids (controlled). */
  expanded?: string[];
  /** Initially expanded node ids (uncontrolled). */
  defaultExpanded?: string[];
  /** Expand every parent node initially (uncontrolled convenience). */
  defaultExpandAll?: boolean;
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

/** Ids of every node that has children (for `defaultExpandAll`). */
function collectParentIds(nodes: TreeNode[], acc: string[] = []): string[] {
  for (const node of nodes) {
    if (node.children?.length) {
      acc.push(node.id);
      collectParentIds(node.children, acc);
    }
  }
  return acc;
}

/** Lowercased text used for typeahead matching and aria labels. */
function nodeText(node: TreeNode): string {
  if (node.textValue) return node.textValue.toLowerCase();
  return typeof node.label === "string" ? node.label.toLowerCase() : "";
}

/**
 * Data-driven tree. `role="tree"` with roving focus over the visible nodes:
 * Up/Down move, Right expands or descends, Left collapses or ascends, Home/End
 * jump, Enter/Space select. Selection inverts the row (never color alone).
 */
export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  {
    items,
    expanded,
    defaultExpanded,
    defaultExpandAll,
    onExpandedChange,
    selected,
    defaultSelected,
    onSelectedChange,
    label,
    className,
    ...rest
  },
  ref,
) {
  const [expandedList, setExpandedList] = useControllableState<string[]>({
    value: expanded,
    defaultValue:
      defaultExpanded ?? (defaultExpandAll ? collectParentIds(items) : []),
    onChange: onExpandedChange,
  });
  const [selectedId, setSelectedId] = useControllableState<string | undefined>({
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange as (v: string | undefined) => void,
  });

  const icons = useIcons();
  const expandedSet = useMemo(() => new Set(expandedList), [expandedList]);
  const flat = useMemo(() => flatten(items, expandedSet), [items, expandedSet]);

  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);
  const rootRef = useRef<HTMLUListElement>(null);
  const typeaheadBuffer = useRef("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(typeaheadTimer.current), []);

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
    if (expandedSet.has(id))
      setExpandedList(expandedList.filter((x) => x !== id));
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

  // Typeahead: focus the next visible node whose text starts with the buffered
  // keystrokes, wrapping around. The buffer clears after a short idle window.
  const onTypeahead = (char: string) => {
    clearTimeout(typeaheadTimer.current);
    typeaheadBuffer.current += char.toLowerCase();
    const buffer = typeaheadBuffer.current;
    const from = indexOf(activeId ?? flat[0]?.node.id);
    const count = flat.length;
    for (let step = 1; step <= count; step += 1) {
      const candidate = flat[(from + step) % count];
      if (candidate && nodeText(candidate.node).startsWith(buffer)) {
        setActive(candidate.node.id);
        break;
      }
    }
    typeaheadTimer.current = setTimeout(() => {
      typeaheadBuffer.current = "";
    }, 500);
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
          else if (flat[index + 1])
            setActive((flat[index + 1] as FlatNode).node.id);
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
      default: {
        if (
          event.key.length === 1 &&
          event.key !== " " &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          onTypeahead(event.key);
        }
        break;
      }
    }
  };

  const activeOrFirst = activeId ?? flat[0]?.node.id;

  const renderNodes = (nodes: TreeNode[], level: number): ReactNode => (
    <ul
      role={level === 1 ? "tree" : "group"}
      aria-label={level === 1 ? label : undefined}
      className={level === 1 ? cx("du_tree", className) : "du_tree_group"}
      ref={level === 1 ? mergeRefs(rootRef, ref) : undefined}
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
            aria-label={
              typeof node.label === "string" ? node.label : node.textValue
            }
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
              style={{
                paddingInlineStart: `calc(var(--space-2) + ${level - 1} * var(--space-4))`,
              }}
            >
              {hasChildren ? (
                <Icon
                  icon={isExpanded ? icons.chevronDown : icons.chevronRight}
                  className="du_tree_caret"
                />
              ) : (
                <span className="du_tree_spacer" aria-hidden="true" />
              )}
              {node.icon != null && (
                <span className="du_tree_icon" aria-hidden="true">
                  {node.icon}
                </span>
              )}
              <span className="du_tree_label">{node.label}</span>
            </div>
            {hasChildren &&
              isExpanded &&
              renderNodes(node.children as TreeNode[], level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return renderNodes(items, 1);
});
