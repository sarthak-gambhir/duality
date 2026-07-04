import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';

export type TableProps = ComponentPropsWithoutRef<'table'>;

/** Two-color data table with pixel rules. Use with the T* section primitives. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, ...rest },
  ref,
) {
  return <table ref={ref} className={cx('du_table', className)} {...rest} />;
});

export const THead = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'thead'>>(
  function THead({ className, ...rest }, ref) {
    return <thead ref={ref} className={cx('du_thead', className)} {...rest} />;
  },
);

export const TBody = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'tbody'>>(
  function TBody({ className, ...rest }, ref) {
    return <tbody ref={ref} className={cx('du_tbody', className)} {...rest} />;
  },
);

export const Tr = forwardRef<HTMLTableRowElement, ComponentPropsWithoutRef<'tr'>>(function Tr(
  { className, ...rest },
  ref,
) {
  return <tr ref={ref} className={cx('du_tr', className)} {...rest} />;
});

export const Th = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<'th'>>(function Th(
  { className, ...rest },
  ref,
) {
  return <th ref={ref} className={cx('du_th', className)} {...rest} />;
});

export const Td = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<'td'>>(function Td(
  { className, ...rest },
  ref,
) {
  return <td ref={ref} className={cx('du_td', className)} {...rest} />;
});
