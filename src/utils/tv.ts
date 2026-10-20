import { createTV } from "tailwind-variants";

/**
 * Project-wide `tv` with tailwind-merge aware of the custom theme tokens
 * from tailwind.config.js, so e.g. `text-blackColor` isn't treated as a
 * font-size and dropped when merged with `text-sm`.
 * Import from "@/utils/tv" (not the "@/utils" barrel, which pulls in server code).
 */
export const tv = createTV({
  twMergeConfig: {
    extend: {
      theme: {
        color: [
          "error",
          "bgLightColor",
          "bgColor",
          "accentColor",
          "clickedColor",
          "textColor",
          "inputColor",
          "disabledColor",
          "disabledBgColor",
          "enableBgColor",
          "hoverBgColor",
          "accentClicked",
          "bgSelectDropDown",
          "bgSelect",
          "bgSelectItemHover",
          "scrolBarTrackColor",
          "scrolBarThumbColor",
          "greyColor",
          "blackColor",
        ],
        shadow: ["0", "hoverShadow", "focusShadow"],
        blur: ["header", "hero", "footer"],
      },
      // Custom classes from globals.css that look like Tailwind utilities
      // (e.g. `text-input` would otherwise be merged away as a text color).
      classGroups: {
        "custom-text-input": ["text-input"],
        "custom-autofill-text": ["autofill-text"],
        "custom-font-urbanist": ["font-urbanist"],
        "custom-border-r-hidden": ["border-r-hidden"],
        "custom-border-r-round": ["border-r-round"],
      },
    },
  },
});

export type { VariantProps } from "tailwind-variants";
