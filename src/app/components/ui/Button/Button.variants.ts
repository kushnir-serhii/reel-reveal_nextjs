import { tv, type VariantProps } from "@/utils/tv";

export const buttonVariants = tv(
  {
    base: [
      "flex items-center justify-center gap-2 h-10 w-full",
      "font-semibold uppercase rounded-full cursor-pointer",
      "transition-all duration-300",
      "focus:outline-2 focus:shadow-focusShadow",
    ],
    variants: {
      variant: {
        primary: [
          "bg-accentColor text-blackColor",
          "hover:bg-clickedColor hover:border hover:border-accentColor",
          "active:bg-clickedColor active:opacity-100",
          "focus:bg-accentColor",
        ],
        transparent: [
          "bg-transparent text-textColor border border-solid border-textColor",
          "hover:bg-transparent hover:border-accentColor hover:text-accentColor",
          "active:bg-transparent active:border-clickedColor",
          "focus:bg-transparent",
        ],
      },
      disabled: {
        true: "opacity-50 cursor-default pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
