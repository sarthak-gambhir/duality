# FileUpload

File picker with a drag-and-drop dropzone and a removable file list.

## Props

| Prop               | Type                        | Default                              | Description                                                          |
| ------------------ | --------------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| `accept`           | `string`                    | -                                    | `accept` attribute forwarded to the input.                           |
| `aria-describedby` | `string`                    | -                                    |                                                                      |
| `className`        | `string`                    | -                                    |                                                                      |
| `defaultValue`     | `File[]`                    | -                                    | Initial files (uncontrolled).                                        |
| `disabled`         | `boolean`                   | -                                    |                                                                      |
| `disabledReason`   | `ReactNode`                 | -                                    | When disabled, reason shown in a persistent caption below the field. |
| `id`               | `string`                    | -                                    |                                                                      |
| `label`            | `string`                    | `Drop files here or click to browse` | Prompt shown inside the dropzone.                                    |
| `multiple`         | `boolean`                   | -                                    | Allow selecting more than one file.                                  |
| `onValueChange`    | `((files: File[]) => void)` | -                                    | Called with the next list of files.                                  |
| `value`            | `File[]`                    | -                                    | Selected files (controlled).                                         |
