import { tv, type VariantProps } from "@/utils/tv";

export const loaderVariants = tv({
  slots: {
    base: "flex items-center justify-center w-full h-screen",
    wrapper: "flex justify-center items-center",
    spinner: [
      "size-14 border-[8px] border-gray-200 border-solid rounded-full animate-spin",
      "border-t-[#A5FCDF] border-r-[#77F8D8] border-b-[#20E8DA] border-l-[#17C3C7]",
    ],
  },
});

export type LoaderVariantProps = VariantProps<typeof loaderVariants>;
