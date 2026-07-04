import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Slider } from '../src/components/slider/Slider';

describe('Slider', () => {
  it('exposes a slider role and updates its value', () => {
    render(<Slider aria-label="volume" min={0} max={100} defaultValue={40} />);
    const slider = screen.getByRole('slider', { name: 'volume' });
    expect(slider).toHaveValue('40');
    fireEvent.change(slider, { target: { value: '75' } });
    expect(slider).toHaveValue('75');
  });

  it('sets aria-invalid when invalid', () => {
    render(<Slider aria-label="volume" invalid />);
    expect(screen.getByRole('slider', { name: 'volume' })).toHaveAttribute('aria-invalid', 'true');
  });
});
