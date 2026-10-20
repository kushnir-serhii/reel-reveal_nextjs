import { tv, type VariantProps } from "@/utils/tv";

export const mainLogoVariants = tv({
  slots: {
    base: "flex items-center justify-center",
    icon: "fill-textColor",
    text: "hidden font-bold text-xl text-textColor lg:flex",
  },
});

export type MainLogoVariantProps = VariantProps<typeof mainLogoVariants>;
