// ui/theme.js
export const theme = {
  colors: {
    text: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.74)",
    textFaint: "rgba(255,255,255,0.55)",

    // Accent (only for CTAs, never for the whole background)
    accent: "#B36BFF", // violet
    accent2: "#6FE7FF", // aqua
    warn: "#FFD84D",
    success: "#46F2A2",

    buttonTextDark: "#0A0F1F",

    // Glass surfaces
    card: "rgba(255,255,255,0.08)",
    card2: "rgba(255,255,255,0.10)",
    cardBorder: "rgba(255,255,255,0.18)",
    cardBorderStrong: "rgba(255,255,255,0.26)",

    shadow: "rgba(0,0,0,0.30)",
  },

  radius: { md: 14, lg: 18, xl: 24, pill: 999 },
  space: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 30 },

  // Very subtle — the “space” look comes from Background circles + stars.
  gradients: {
    base: ["#050B1C", "#06102A"],
    alarm: ["#050B1C", "#071533"],
    success: ["#061C18", "#072A22"],
  },
};
