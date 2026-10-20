import { tv, type VariantProps } from "@/utils/tv";

// No colors here: count and icon inherit the parent's text color (the icon
// strokes with currentColor), so they always match the button label.
export const quizCountVariants = tv({
  slots: {
    base: "flex shrink-0 items-center gap-[3px]",
    value: "font-semibold text-base tabular-nums",
    icon: "shrink-0",
  },
});

export type QuizCountVariantProps = VariantProps<typeof quizCountVariants>;
