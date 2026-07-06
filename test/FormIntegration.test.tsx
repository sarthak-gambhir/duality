import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MultiSelect } from '../src/components/multi_select/MultiSelect';
import { PinInput } from '../src/components/pin_input/PinInput';
import { RangeSlider } from '../src/components/range_slider/RangeSlider';
import { ToggleGroup, ToggleGroupItem } from '../src/components/toggle_group/ToggleGroup';
import type { SelectOption } from '../src/components/select/Select';

function formValues(form: HTMLFormElement, key: string): string[] {
  return new FormData(form).getAll(key).map(String);
}

describe('form integration (hidden inputs)', () => {
  it('MultiSelect mirrors each selected value under its name', async () => {
    const user = userEvent.setup();
    const options: SelectOption[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ];
    render(
      <form data-testid="form">
        <MultiSelect
          options={options}
          defaultValue={['a']}
          name="picks"
          aria-label="picks"
        />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(formValues(form, 'picks')).toEqual(['a']);

    await user.click(screen.getByRole('combobox', { name: 'picks' }));
    await user.click(screen.getByRole('option', { name: 'B' }));
    expect(formValues(form, 'picks')).toEqual(['a', 'b']);
  });

  it('RangeSlider mirrors low and high under its name', () => {
    render(
      <form data-testid="form">
        <RangeSlider defaultValue={[20, 80]} name="range" />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(formValues(form, 'range')).toEqual(['20', '80']);
  });

  it('PinInput mirrors the assembled value under its name', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <PinInput length={4} name="otp" />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    const inputs = screen.getAllByRole('textbox');
    inputs[0]!.focus();
    await user.keyboard('1234');
    expect(formValues(form, 'otp')).toEqual(['1234']);
  });

  it('ToggleGroup mirrors selection under its name', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <ToggleGroup type="multiple" name="tools" defaultValue={['bold']}>
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
          <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        </ToggleGroup>
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(formValues(form, 'tools')).toEqual(['bold']);

    await user.click(screen.getByRole('button', { name: 'Italic' }));
    expect(formValues(form, 'tools')).toEqual(['bold', 'italic']);
  });
});
