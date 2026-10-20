import { tv, type VariantProps } from "@/utils/tv";

export const listSelectedValuesVariants = tv({
  slots: {
    list: "flex flex-wrap gap-2 sm:gap-4 transition-all duration-1000 h-[42px]",
    item: [
      "flex items-center rounded-full border border-bgLightColor px-4 py-2 bg-bgColor h-[42px]",
      "transition-all ease-in-out duration-500 opacity-0",
    ],
    removeBtn: "ml-2",
    removeIcon:
      "text-textColor hover:text-accentColor active:text-accentClicked transition-colors duration-300",
  },
  variants: {
    empty: {
      true: { list: "h-0" },
    },
    visible: {
      true: { item: "opacity-100" },
    },
  },
});

export type ListSelectedValuesVariantProps = VariantProps<
  typeof listSelectedValuesVariants
>;
