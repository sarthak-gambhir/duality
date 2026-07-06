import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker } from '../src/components/time_picker/TimePicker';

describe('TimePicker', () => {
  it('opens the panel and reflects the current selection', async () => {
    const user = userEvent.setup();
    render(<TimePicker defaultValue="09:30" aria-label="Time" />);
    const trigger = screen.getByRole('button', { name: 'Time' });
    expect(trigger).toHaveTextContent('09:30');

    await user.click(trigger);
    expect(screen.getByRole('listbox', { name: 'Hours' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '09' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: '30' })).toHaveAttribute('aria-selected', 'true');
  });

  it('commits an HH:mm value when an hour is chosen', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TimePicker defaultValue="09:30" onValueChange={onValueChange} aria-label="Time" />,
    );
    await user.click(screen.getByRole('button', { name: 'Time' }));
    await user.click(screen.getByRole('option', { name: '11' }));
    expect(onValueChange).toHaveBeenCalledWith('11:30');
  });

  it('supports a 12-hour clock with an AM/PM column', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TimePicker defaultValue="09:30" hour12 onValueChange={onValueChange} aria-label="Time" />,
    );
    await user.click(screen.getByRole('button', { name: 'Time' }));
    expect(screen.getByRole('listbox', { name: 'Period' })).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'PM' }));
    expect(onValueChange).toHaveBeenCalledWith('21:30');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<TimePicker defaultValue="09:30" aria-label="Time" />);
    await user.click(screen.getByRole('button', { name: 'Time' }));
    expect(screen.getByRole('listbox', { name: 'Hours' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox', { name: 'Hours' })).not.toBeInTheDocument();
  });
});
