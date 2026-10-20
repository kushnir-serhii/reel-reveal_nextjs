import { tv, type VariantProps } from "@/utils/tv";

export const headerSearchBarVariants = tv({
  slots: {
    form: "group relative flex w-fit mx-2",
    input: [
      "w-full h-[38px] pl-5 pr-[54px] rounded-[20px]",
      "font-light text-base text-textColor placeholder:text-textColor/50 bg-inputColor",
      "border border-transparent outline-none transition-colors duration-200",
      "hover:border-accentColor focus:border-accentColor",
    ],
    button: [
      "absolute inset-y-0 right-0 flex w-[42px] items-center justify-center",
      "rounded-r-[20px] text-textColor transition-colors duration-200",
      "hover:text-accentColor focus-visible:text-accentColor",
    ],
  },
});

export type HeaderSearchBarVariantProps = VariantProps<
  typeof headerSearchBarVariants
>;
