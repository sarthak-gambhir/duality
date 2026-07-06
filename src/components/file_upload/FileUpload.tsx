import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

export interface FileUploadProps {
  /** Selected files (controlled). */
  value?: File[];
  /** Initial files (uncontrolled). */
  defaultValue?: File[];
  /** Called with the next list of files. */
  onValueChange?: (files: File[]) => void;
  /** `accept` attribute forwarded to the input. */
  accept?: string;
  /** Allow selecting more than one file. */
  multiple?: boolean;
  disabled?: boolean;
  /** Prompt shown inside the dropzone. */
  label?: string;
  id?: string;
  className?: string;
  "aria-describedby"?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** File picker with a drag-and-drop dropzone and a removable file list. */
export function FileUpload({
  value,
  defaultValue,
  onValueChange,
  accept,
  multiple,
  disabled,
  label = "Drop files here or click to browse",
  id,
  className,
  "aria-describedby": ariaDescribedby,
}: FileUploadProps) {
  const [files, setFiles] = useControllableState<File[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const inputId = id ?? `${baseId}_input`;
  const listId = `${baseId}_list`;

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const next = multiple
      ? [...(files ?? []), ...Array.from(incoming)]
      : [Array.from(incoming)[0]!];
    setFiles(next);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (disabled) return;
    addFiles(event.dataTransfer.files);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const onZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  const remove = (index: number) => {
    setFiles((files ?? []).filter((_, i) => i !== index));
  };

  const current = files ?? [];

  return (
    <div className={cx("du_file_upload", className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="du_file_upload_input"
        aria-describedby={ariaDescribedby}
        onChange={onInputChange}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-controls={current.length > 0 ? listId : undefined}
        className={cx(
          "du_file_upload_zone",
          dragOver && "du_file_upload_zone_over",
        )}
        onClick={openPicker}
        onKeyDown={onZoneKeyDown}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragOver(false)}
      >
        {label}
      </div>

      {current.length > 0 && (
        <ul id={listId} className="du_file_upload_list">
          {current.map((file, index) => (
            <li key={`${file.name}_${index}`} className="du_file_upload_item">
              <span className="du_file_upload_name">{file.name}</span>
              <span className="du_file_upload_size">
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                className="du_file_upload_remove"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={() => remove(index)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
