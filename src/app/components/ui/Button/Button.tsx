import React from "react";
import { buttonVariants, type ButtonVariantProps } from "./Button.variants";

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    Omit<ButtonVariantProps, "disabled"> {}

export const Button = ({
  variant,
  size,
  disabled,
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    className={buttonVariants({ variant, size, disabled, className })}
    {...props}
  />
);
