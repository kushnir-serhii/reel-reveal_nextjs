import { tv, type VariantProps } from "@/utils/tv";

export const tooltipVariants = tv({
  slots: {
    base: "relative group inline-block",
    content: [
      "absolute z-10 overflow-hidden h-0 w-80 px-3 py-2 font-light text-base text-white bg-black rounded-lg shadow-md",
      "opacity-0 transition-all duration-500 ease-in-out group-hover:flex group-hover:opacity-100 group-hover:h-16",
    ],
  },
  variants: {
    position: {
      top: { content: "bottom-full left-1/2 transform -translate-x-1/2 mb-2" },
      bottom: { content: "top-full left-1/2 transform -translate-x-1/2 mt-2" },
      left: { content: "right-full top-1/2 transform -translate-y-1/2 mr-2" },
      right: { content: "left-full top-1/2 transform -translate-y-1/2 ml-2" },
    },
  },
  defaultVariants: {
    position: "top",
  },
});

export type TooltipVariantProps = VariantProps<typeof tooltipVariants>;
