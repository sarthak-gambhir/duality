import type { ComponentPropsWithRef, ElementType } from "react";

/**
 * Minimal polymorphic component typing: lets a component render as any element
 * via an `as` prop while keeping that element's props and ref typed.
 */
export type AsProp<T extends ElementType> = { as?: T };

export type PolymorphicProps<
  T extends ElementType,
  OwnProps = object,
> = OwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, keyof OwnProps | "as">;

export type PolymorphicRef<T extends ElementType> =
  ComponentPropsWithRef<T>["ref"];
