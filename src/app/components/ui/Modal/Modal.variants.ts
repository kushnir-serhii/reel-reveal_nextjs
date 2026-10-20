import { tv, type VariantProps } from "@/utils/tv";

export const modalVariants = tv({
  slots: {
    overlay:
      "fixed inset-0 z-50 flex items-center justify-center w-screen bg-black/80",
    content: "relative max-w-screen inline-block",
    closeBtn: "absolute z-50 p-1 top-4 right-4",
    closeIcon:
      "w-[20px] h-[20px] text-disabledColor transition duration-300 ease-in-out hover:text-accentColor",
  },
});

export type ModalVariantProps = VariantProps<typeof modalVariants>;
