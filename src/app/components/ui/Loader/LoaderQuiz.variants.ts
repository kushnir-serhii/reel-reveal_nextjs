import { tv, type VariantProps } from "@/utils/tv";

export const loaderQuizVariants = tv({
  slots: {
    base: "flex flex-col items-center justify-center h-64 w-full space-y-6",
    robot: "relative flex flex-col items-center",
    robotHead:
      "w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-xl font-bold animate-pulse",
    robotBody: "w-2 h-24 bg-gray-400 mt-2 animate-pulse",
    projector: "relative w-64 h-32",
    light:
      "absolute inset-0 bg-yellow-200 opacity-20 rounded-xl transform rotate-[-15deg]",
    cards: "absolute inset-0 flex justify-around items-center",
    card: "w-14 h-20 bg-gray-300 rounded-lg shadow-md",
    text: "text-gray-700 font-medium",
  },
});

export type LoaderQuizVariantProps = VariantProps<typeof loaderQuizVariants>;
