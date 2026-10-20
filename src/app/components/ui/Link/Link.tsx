import React from "react";
import NextLink from "next/link";
import { buttonVariants, type ButtonVariantProps } from "../Button";

export interface LinkProps
  extends React.ComponentPropsWithoutRef<typeof NextLink>,
    Omit<ButtonVariantProps, "disabled"> {
  disabled?: boolean;
}

export const Link = ({
  variant,
  size,
  disabled,
  className,
  ...props
}: LinkProps) => (
  <NextLink
    aria-disabled={disabled || undefined}
    tabIndex={disabled ? -1 : undefined}
    className={buttonVariants({ variant, size, disabled, className })}
    {...props}
  />
);
