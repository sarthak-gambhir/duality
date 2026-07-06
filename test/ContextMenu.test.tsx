import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu, type ContextMenuItem } from '../src/components/context_menu/ContextMenu';

function renderMenu(onSelect = vi.fn()) {
  const items: ContextMenuItem[] = [
    { id: 'copy', label: 'Copy', onSelect },
    { id: 'sep', separator: true },
    { id: 'delete', label: 'Delete', disabled: true },
  ];
  render(
    <ContextMenu items={items} aria-label="row actions">
      <div data-testid="target">Right-click me</div>
    </ContextMenu>,
  );
  return { target: screen.getByTestId('target'), onSelect };
}

describe('ContextMenu', () => {
  it('opens at the cursor on right-click', () => {
    const { target } = renderMenu();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.contextMenu(target);
    expect(screen.getByRole('menu', { name: 'row actions' })).toBeInTheDocument();
  });

  it('selects an item and closes', async () => {
    const user = userEvent.setup();
    const { target, onSelect } = renderMenu();
    fireEvent.contextMenu(target);
    await user.click(screen.getByRole('menuitem', { name: 'Copy' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('marks disabled items and does not select them', async () => {
    const user = userEvent.setup();
    const { target } = renderMenu();
    fireEvent.contextMenu(target);
    const del = screen.getByRole('menuitem', { name: 'Delete' });
    expect(del).toHaveAttribute('aria-disabled', 'true');
    await user.click(del);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const { target } = renderMenu();
    fireEvent.contextMenu(target);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
