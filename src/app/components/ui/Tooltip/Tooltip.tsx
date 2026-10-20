"use client";

import { ReactNode } from "react";
import { tooltipVariants } from "./Tooltip.variants";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
}) => {
  const { base, content: contentStyles } = tooltipVariants({ position });

  return (
    <div className={base()}>
      {children}
      <div className={contentStyles()}>{content}</div>
    </div>
  );
};
