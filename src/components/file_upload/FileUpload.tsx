import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/mergeRefs";
import { useControllableState } from "../../utils/useControllableState";
import { useFormField } from "../form_field/FormFieldContext";
import { DisabledMessage } from "../form_field/disabledMessage";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

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
  /** When disabled, reason shown in a persistent caption below the field. */
  disabledReason?: ReactNode;
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
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  function FileUpload(
    {
      value,
      defaultValue,
      onValueChange,
      accept,
      multiple,
      disabled,
      disabledReason,
      label = "Drop files here or click to browse",
      id,
      className,
      "aria-describedby": ariaDescribedby,
    },
    ref,
  ) {
  const [files, setFiles] = useControllableState<File[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const icons = useIcons();
  const field = useFormField();
  const baseId = useId();
  const isDisabled = disabled ?? field?.disabled;
  const resolvedReason = disabledReason ?? field?.disabledReason;
  const showDisabledReason = !!isDisabled && resolvedReason != null;
  const disabledMsgId = `${baseId}_disabled`;
  const inputId = id ?? field?.id ?? `${baseId}_input`;
  const listId = `${baseId}_list`;
  const describedBy =
    cx(
      ariaDescribedby ?? field?.describedBy,
      showDisabledReason && disabledMsgId,
    ) || undefined;

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
    if (isDisabled) return;
    addFiles(event.dataTransfer.files);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDisabled) setDragOver(true);
  };

  const openPicker = () => {
    if (!isDisabled) inputRef.current?.click();
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
    <DisabledMessage
      active={showDisabledReason}
      id={disabledMsgId}
      reason={resolvedReason}
    >
    <div className={cx("du_file_upload", className)}>
      <input
        ref={mergeRefs(ref, inputRef)}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={isDisabled}
        className="du_file_upload_input"
        aria-describedby={describedBy}
        onChange={onInputChange}
      />
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled || undefined}
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
        <Icon
          icon={icons.upload}
          className="du_file_upload_zone_icon"
          size="xl"
        />
        <span>{label}</span>
      </div>

      {current.length > 0 && (
        <ul id={listId} className="du_file_upload_list">
          {current.map((file, index) => (
            <li key={`${file.name}_${index}`} className="du_file_upload_item">
              <span className="du_file_upload_name">{file.name}</span>
              <span className="du_file_upload_size">
                {formatSize(file.size)}
              </span>
              {!isDisabled && (
                <button
                  type="button"
                  className="du_file_upload_remove"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => remove(index)}
                >
                  <Icon icon={icons.close} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </DisabledMessage>
  );
});
