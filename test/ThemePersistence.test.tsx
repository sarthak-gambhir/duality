import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';

function Probe() {
  const { theme, inverted, setTheme, toggleInverted } = useTheme();
  return (
    <div>
      <span data-testid="state">
        {theme}:{String(inverted)}
      </span>
      <button onClick={() => setTheme('amber')}>amber</button>
      <button onClick={toggleInverted}>invert</button>
    </div>
  );
}

describe('ThemeProvider persistence', () => {
  afterEach(() => window.localStorage.clear());

  it('writes theme and inversion to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider storageKey="du_test">
        <Probe />
      </ThemeProvider>,
    );

    await user.click(screen.getByText('amber'));
    await user.click(screen.getByText('invert'));

    const stored = JSON.parse(window.localStorage.getItem('du_test') as string);
    expect(stored).toEqual({ theme: 'amber', inverted: true });
  });

  it('restores from localStorage on init', () => {
    window.localStorage.setItem('du_test', JSON.stringify({ theme: 'phosphor', inverted: true }));
    render(
      <ThemeProvider storageKey="du_test">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('state')).toHaveTextContent('phosphor:true');
  });
});
