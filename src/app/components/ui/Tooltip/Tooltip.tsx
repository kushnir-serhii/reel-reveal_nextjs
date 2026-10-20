"use client";

import { ReactNode } from "react";
import { tooltipVariants, type TooltipVariantProps } from "./Tooltip.variants";

interface TooltipProps extends TooltipVariantProps {
  children: ReactNode;
  content: string;
  // Renders only the children, e.g. when the hint doesn't apply right now.
  disabled?: boolean;
}

export const Tooltip = ({
  children,
  content,
  position,
  disabled = false,
}: TooltipProps) => {
  if (disabled) return <>{children}</>;

  const { base, content: contentStyles } = tooltipVariants({ position });

  return (
    <div className={base()}>
      {children}
      <div role="tooltip" className={contentStyles()}>
        {content}
      </div>
    </div>
  );
};
