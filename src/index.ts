// @duality/ui public API.
//
// NOTE: import the stylesheet once in your app: `import '@duality/ui/styles.css'`.

// Theme
export { ThemeProvider, useTheme } from "./theme/ThemeProvider";
export type {
  ThemeProviderProps,
  ThemeContextValue,
  Density,
} from "./theme/ThemeProvider";
export { palettes, paletteNames, defaultPalette } from "./theme/palettes";
export type { Palette, PaletteName } from "./theme/palettes";
export { PaletteSelect } from "./components/theme_controls/PaletteSelect";
export type { PaletteSelectProps } from "./components/theme_controls/PaletteSelect";
export {
  contrastRatio,
  relativeLuminance,
  meetsAAA,
  AAA_CONTRAST,
} from "./theme/contrast";

// Shared
export { cx } from "./utils/cx";
export type {
  PolymorphicProps,
  PolymorphicRef,
  AsProp,
} from "./utils/polymorphic";
export type { SpaceStep, SizeToken } from "./tokens/scale";
export { Portal } from "./utils/Portal";
export type { PortalProps } from "./utils/Portal";
export { useDisclosure } from "./utils/useDisclosure";
export type { Disclosure } from "./utils/useDisclosure";
export { useControllableState } from "./utils/useControllableState";

// Layout
export { Box } from "./components/box/Box";
export type { BoxProps } from "./components/box/Box";
export { Stack } from "./components/stack/Stack";
export type { StackProps } from "./components/stack/Stack";
export { Inline } from "./components/inline/Inline";
export type { InlineProps } from "./components/inline/Inline";
export { Grid } from "./components/grid/Grid";
export type { GridProps } from "./components/grid/Grid";
export { Container } from "./components/container/Container";
export type { ContainerProps } from "./components/container/Container";
export { Divider } from "./components/divider/Divider";
export type { DividerProps } from "./components/divider/Divider";

// Typography
export { Text } from "./components/text/Text";
export type { TextProps, TextSize } from "./components/text/Text";
export { Heading } from "./components/heading/Heading";
export type { HeadingProps, HeadingLevel } from "./components/heading/Heading";
export { Link } from "./components/link/Link";
export type { LinkProps } from "./components/link/Link";
export { Code } from "./components/code/Code";
export type { CodeProps } from "./components/code/Code";
export { Kbd } from "./components/kbd/Kbd";
export type { KbdProps } from "./components/kbd/Kbd";

// Form controls
export { Button } from "./components/button/Button";
export type { ButtonProps } from "./components/button/Button";
export { Input } from "./components/input/Input";
export type { InputProps } from "./components/input/Input";
export { Textarea } from "./components/textarea/Textarea";
export type { TextareaProps } from "./components/textarea/Textarea";
export { Checkbox } from "./components/checkbox/Checkbox";
export type { CheckboxProps } from "./components/checkbox/Checkbox";
export { Radio } from "./components/radio/Radio";
export type { RadioProps } from "./components/radio/Radio";
export { RadioGroup, useRadioGroup } from "./components/radio/RadioGroup";
export type { RadioGroupProps } from "./components/radio/RadioGroup";
export { Switch } from "./components/switch/Switch";
export type { SwitchProps } from "./components/switch/Switch";
export { Select } from "./components/select/Select";
export type { SelectProps, SelectOption } from "./components/select/Select";
export { NumberInput } from "./components/number_input/NumberInput";
export type { NumberInputProps } from "./components/number_input/NumberInput";
export {
  ToggleGroup,
  ToggleGroupItem,
} from "./components/toggle_group/ToggleGroup";
export type {
  ToggleGroupProps,
  ToggleGroupItemProps,
} from "./components/toggle_group/ToggleGroup";
export { Rating } from "./components/rating/Rating";
export type { RatingProps } from "./components/rating/Rating";
export { Combobox } from "./components/combobox/Combobox";
export type { ComboboxProps } from "./components/combobox/Combobox";
export { DatePicker } from "./components/date_picker/DatePicker";
export type { DatePickerProps } from "./components/date_picker/DatePicker";
export { Slider } from "./components/slider/Slider";
export type { SliderProps } from "./components/slider/Slider";
export { RangeSlider } from "./components/range_slider/RangeSlider";
export type { RangeSliderProps } from "./components/range_slider/RangeSlider";
export { TagInput } from "./components/tag_input/TagInput";
export type { TagInputProps } from "./components/tag_input/TagInput";
export { TimePicker } from "./components/time_picker/TimePicker";
export type { TimePickerProps } from "./components/time_picker/TimePicker";
export { MultiSelect } from "./components/multi_select/MultiSelect";
export type { MultiSelectProps } from "./components/multi_select/MultiSelect";
export { FileUpload } from "./components/file_upload/FileUpload";
export type { FileUploadProps } from "./components/file_upload/FileUpload";
export { PinInput } from "./components/pin_input/PinInput";
export type { PinInputProps } from "./components/pin_input/PinInput";

// Form composition
export { Label } from "./components/label/Label";
export type { LabelProps } from "./components/label/Label";
export { FormField } from "./components/form_field/FormField";
export type {
  FormFieldProps,
  FormFieldControlProps,
} from "./components/form_field/FormField";

// Display
export { Card, CardHeader, CardBody, CardFooter } from "./components/card/Card";
export type { CardProps } from "./components/card/Card";
export { Badge } from "./components/badge/Badge";
export { Badge as Tag } from "./components/badge/Badge";
export type { BadgeProps } from "./components/badge/Badge";
export { Alert } from "./components/alert/Alert";
export type { AlertProps } from "./components/alert/Alert";
export { Avatar } from "./components/avatar/Avatar";
export type { AvatarProps } from "./components/avatar/Avatar";
export { Progress } from "./components/progress/Progress";
export type { ProgressProps } from "./components/progress/Progress";
export { Spinner } from "./components/spinner/Spinner";
export type { SpinnerProps } from "./components/spinner/Spinner";
export { Skeleton } from "./components/skeleton/Skeleton";
export type { SkeletonProps } from "./components/skeleton/Skeleton";
export { Stat } from "./components/stat/Stat";
export type { StatProps } from "./components/stat/Stat";
export { EmptyState } from "./components/empty_state/EmptyState";
export type { EmptyStateProps } from "./components/empty_state/EmptyState";
export { Banner } from "./components/banner/Banner";
export type { BannerProps } from "./components/banner/Banner";

// Data
export { Table, THead, TBody, Tr, Th, Td } from "./components/table/Table";
export type { TableProps } from "./components/table/Table";
export { DataTable } from "./components/data_table/DataTable";
export type {
  DataTableProps,
  DataTableColumn,
} from "./components/data_table/DataTable";
export { Tree } from "./components/tree/Tree";
export type { TreeProps, TreeNode } from "./components/tree/Tree";
export { Timeline } from "./components/timeline/Timeline";
export type {
  TimelineProps,
  TimelineItem,
} from "./components/timeline/Timeline";

// Navigation
export { Breadcrumbs } from "./components/breadcrumbs/Breadcrumbs";
export type {
  BreadcrumbsProps,
  BreadcrumbItem,
} from "./components/breadcrumbs/Breadcrumbs";
export { Pagination } from "./components/pagination/Pagination";
export type { PaginationProps } from "./components/pagination/Pagination";
export { Stepper } from "./components/stepper/Stepper";
export type { StepperProps, StepperStep } from "./components/stepper/Stepper";
export { SideNav } from "./components/side_nav/SideNav";
export type {
  SideNavProps,
  SideNavItem,
  SideNavSection,
} from "./components/side_nav/SideNav";

// Disclosure
export { Tabs, TabList, Tab, TabPanel } from "./components/tabs/Tabs";
export type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
} from "./components/tabs/Tabs";
export { Accordion, AccordionItem } from "./components/accordion/Accordion";
export type {
  AccordionProps,
  AccordionItemProps,
} from "./components/accordion/Accordion";

// Overlays
export {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "./components/modal/Modal";
export type { ModalProps, ModalSectionProps } from "./components/modal/Modal";
export {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "./components/drawer/Drawer";
export type {
  DrawerProps,
  DrawerSectionProps,
  DrawerSide,
} from "./components/drawer/Drawer";
export { ConfirmDialog } from "./components/confirm_dialog/ConfirmDialog";
export type { ConfirmDialogProps } from "./components/confirm_dialog/ConfirmDialog";
export { Tooltip } from "./components/tooltip/Tooltip";
export type {
  TooltipProps,
  TooltipPlacement,
} from "./components/tooltip/Tooltip";
export { Popover } from "./components/popover/Popover";
export type {
  PopoverProps,
  PopoverPlacement,
} from "./components/popover/Popover";
export { Menu, MenuItem, MenuSeparator } from "./components/menu/Menu";
export type {
  MenuProps,
  MenuItemProps,
  MenuPlacement,
} from "./components/menu/Menu";
export { ContextMenu } from "./components/context_menu/ContextMenu";
export type {
  ContextMenuProps,
  ContextMenuItem,
} from "./components/context_menu/ContextMenu";
export { CommandPalette } from "./components/command_palette/CommandPalette";
export type {
  CommandPaletteProps,
  Command,
} from "./components/command_palette/CommandPalette";
export { ToastProvider, useToast } from "./components/toast/ToastProvider";
export type {
  ToastProviderProps,
  ToastOptions,
  ToastPlacement,
} from "./components/toast/ToastProvider";
