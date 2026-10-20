import { tv, type VariantProps } from "@/utils/tv";

export const errorComponentVariants = tv({
  slots: {
    base: "flex items-center justify-center w-full flex-col h-96 gap-12",
    message: "text-textColor",
    button: [
      "w-40 h-12 text-bgColor bg-accentColor border-solid rounded-md",
      "z-30 transition border-r-2 hover:cursor-pointer active:bg-accentClicked",
    ],
  },
});

export type ErrorComponentVariantProps = VariantProps<
  typeof errorComponentVariants
>;
