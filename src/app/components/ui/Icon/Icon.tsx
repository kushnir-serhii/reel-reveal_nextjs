import React from "react";
import { iconVariants } from "./Icon.variants";

interface IconProps {
  id: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  id,
  width = "24px",
  height = "24px",
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      aria-label={`icon ${id}`}
      className={iconVariants({ className })}
    >
      <use xlinkHref={`/icons/sprite.svg#${id}`} />
    </svg>
  );
};
