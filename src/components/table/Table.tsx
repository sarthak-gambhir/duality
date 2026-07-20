import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";

export interface TableProps extends ComponentPropsWithoutRef<"table"> {
  /** Cell padding scale. Defaults to `md`. */
  size?: "sm" | "md" | "lg";
  /** Pin the header row while the table's scroll container scrolls. */
  stickyHeader?: boolean;
}

/** Two-color data table with pixel rules. Use with the T* section primitives. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { size = "md", stickyHeader, className, ...rest },
  ref,
) {
  return (
    <table
      ref={ref}
      className={cx(
        "du_table",
        `du_table_${size}`,
        stickyHeader && "du_table_sticky",
        className,
      )}
      {...rest}
    />
  );
});

export const THead = forwardRef<
  HTMLTableSectionElement,
  ComponentPropsWithoutRef<"thead">
>(function THead({ className, ...rest }, ref) {
  return <thead ref={ref} className={cx("du_thead", className)} {...rest} />;
});

export const TBody = forwardRef<
  HTMLTableSectionElement,
  ComponentPropsWithoutRef<"tbody">
>(function TBody({ className, ...rest }, ref) {
  return <tbody ref={ref} className={cx("du_tbody", className)} {...rest} />;
});

export const Tr = forwardRef<
  HTMLTableRowElement,
  ComponentPropsWithoutRef<"tr">
>(function Tr({ className, ...rest }, ref) {
  return <tr ref={ref} className={cx("du_tr", className)} {...rest} />;
});

export interface ThProps extends Omit<ComponentPropsWithoutRef<"th">, "align"> {
  /** Text alignment of the column. */
  align?: "start" | "end" | "center";
}

export const Th = forwardRef<HTMLTableCellElement, ThProps>(function Th(
  { align, className, ...rest },
  ref,
) {
  return (
    <th
      ref={ref}
      data-align={align}
      className={cx("du_th", className)}
      {...rest}
    />
  );
});

export interface TdProps extends Omit<ComponentPropsWithoutRef<"td">, "align"> {
  /** Text alignment of the cell. */
  align?: "start" | "end" | "center";
}

export const Td = forwardRef<HTMLTableCellElement, TdProps>(function Td(
  { align, className, ...rest },
  ref,
) {
  return (
    <td
      ref={ref}
      data-align={align}
      className={cx("du_td", className)}
      {...rest}
    />
  );
});
