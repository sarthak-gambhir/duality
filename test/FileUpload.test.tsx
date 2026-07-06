import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { FileUpload } from '../src/components/file_upload/FileUpload';

function Harness({ multiple }: { multiple?: boolean }) {
  const [files, setFiles] = useState<File[]>([]);
  return <FileUpload value={files} onValueChange={setFiles} multiple={multiple} />;
}

function getInput(): HTMLInputElement {
  return document.querySelector('input[type="file"]') as HTMLInputElement;
}

describe('FileUpload', () => {
  it('lists a selected file', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    await user.upload(getInput(), file);
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
  });

  it('appends multiple files when multiple is set', async () => {
    const user = userEvent.setup();
    render(<Harness multiple />);
    const a = new File(['a'], 'a.txt', { type: 'text/plain' });
    const b = new File(['b'], 'b.txt', { type: 'text/plain' });
    await user.upload(getInput(), [a, b]);
    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.getByText('b.txt')).toBeInTheDocument();
  });

  it('removes a file from the list', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    await user.upload(getInput(), file);

    await user.click(screen.getByRole('button', { name: 'Remove notes.txt' }));
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();
  });
});
