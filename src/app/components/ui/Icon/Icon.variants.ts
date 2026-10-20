import { tv, type VariantProps } from "@/utils/tv";

// The svg has no styling of its own; classes come from the caller via `className`.
export const iconVariants = tv({
  base: "",
});

export type IconVariantProps = VariantProps<typeof iconVariants>;
