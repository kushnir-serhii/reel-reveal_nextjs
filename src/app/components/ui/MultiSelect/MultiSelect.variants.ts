import { tv, type VariantProps } from "@/utils/tv";

export const multiSelectVariants = tv({
  slots: {
    root: "relative z-20 flex flex-col justify-end w-full",
    trigger: [
      "flex items-center gap-[4px] justify-between w-full h-10 sm:py-3 py-2 px-4 sm:px-4",
      "cursor-pointer transition-all ease-in-out duration-300 bg-bgSelect",
      "rounded-[20px]",
    ],
    icon: "w-4 h-4 text-white",
    dropdown:
      "w-full absolute -z-10 flex flex-wrap transition-all ease-in-out duration-500 overflow-hidden max-h-0 top-5",
    list: [
      "flex flex-wrap pb-1 h-full transition-all ease-in-out duration-500",
      "bg-bgSelectDropDown scrollbar scrollbar-w-2",
      "scrollbar-track-scrolBarTrackColor hover:scrollbar-thumb-textColor scrollbar-thumb-scrolBarThumbColor",
      "overflow-x-hidden overflow-y-scroll max-h-[200px]",
    ],
    item: "w-full",
    option: "flex w-full justify-start px-2 py-2 text-textColor",
    dropdownBottom: "-top-44 w-full h-5 bg-bgSelectDropDown rounded-b-[20px]",
  },
  variants: {
    open: {
      true: {
        trigger: "rounded-t-[20px] rounded-b-none",
        icon: "rotate-180",
        dropdown: "max-h-[220px] top-full",
      },
    },
    selected: {
      true: { option: "text-accentColor" },
    },
    disabled: {
      true: { option: "cursor-default" },
      false: {
        option:
          "cursor-pointer hover:bg-bgSelectItemHover active:text-accentClicked",
      },
    },
  },
});

export type MultiSelectVariantProps = VariantProps<typeof multiSelectVariants>;
