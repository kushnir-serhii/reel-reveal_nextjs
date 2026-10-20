import { tv, type VariantProps } from "@/utils/tv";

export const aiChatLimitNoticeVariants = tv({
  slots: {
    base: "flex flex-col gap-3 p-4 border-t border-bgSelect",
    header: "flex items-center gap-2",
    badge: [
      "flex shrink-0 items-center justify-center size-8 rounded-full",
      "bg-accentColor/15 text-accentColor",
    ],
    title: "font-semibold text-base leading-5 tracking-normal opacity-100",
    text: "font-light text-sm leading-5 tracking-normal opacity-80",
    reset: "text-center text-xs text-greyColor",
  },
});

export type AiChatLimitNoticeVariantProps = VariantProps<
  typeof aiChatLimitNoticeVariants
>;
