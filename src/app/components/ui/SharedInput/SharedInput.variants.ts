import { tv, type VariantProps } from "@/utils/tv";

export const sharedInputVariants = tv({
  slots: {
    wrapper: "relative",
    input: [
      "text-input grow w-full font-light h-10 text-light text-xl text-textColor bg-inputColor tracking-widest font-mono",
      "rounded-[18px] px-5 focus:outline-none transition-all duration-200 ease-in-out outline-none border",
      "autofill:shadow-[inset_0_0_0px_1000px_rgb(32,36,59)]",
    ],
    label:
      "absolute bg-transparent left-5 text-textColor transition-all duration-200 ease-in-out",
    eyeBtn: "absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer",
  },
  variants: {
    // none: has errors but not submitted yet -> default border color
    state: {
      empty: { input: "border-transparent" },
      filled: { input: "border-accentColor" },
      error: { input: "border-error text-error" },
      none: {},
    },
    floated: {
      true: { label: "-top-6" },
      false: { label: "top-2" },
    },
  },
  defaultVariants: {
    state: "empty",
    floated: false,
  },
});

export type SharedInputVariantProps = VariantProps<typeof sharedInputVariants>;
