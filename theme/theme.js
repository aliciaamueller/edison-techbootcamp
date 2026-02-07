// theme/theme.js
import { Platform, StatusBar } from "react-native";

export const Theme = {
  // Not-too-dark premium navy + soft glow
  colors: {
    bgTop: "#101B3A",
    bgMid: "#0F1733",
    bgBottom: "#0C122A",

    card: "rgba(255,255,255,0.08)",
    cardBorder: "rgba(255,255,255,0.14)",

    text: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.72)",
    textFaint: "rgba(255,255,255,0.52)",

    // “Edison” accent (premium electric)
    accent: "#7B8CFF",
    accent2: "#C96BFF",
    success: "#2EF2A0",
    warning: "#FFD166",

    buttonText: "#0B1026",
  },

  gradients: {
    // Default app background (consistent across screens)
    appBg: ["#101B3A", "#0F1733", "#0C122A"],

    // CTA buttons (premium)
    cta: ["#7B8CFF", "#C96BFF"],

    // Alarm “wake” backgrounds (brighter but still premium)
    alarmDefault: ["#1B2A6B", "#6A2CA0", "#C96BFF"],

    // Personality variants (optional, but makes it feel “designed”)
    alarmByPersonality: {
      motivational: ["#1B2A6B", "#6A2CA0", "#C96BFF"],
      sassy: ["#3A1B6B", "#C2457A", "#FFB86B"],
      "drill-sergeant": ["#2B2F4A", "#4A1B2A", "#C96BFF"],
      zen: ["#0E2F44", "#123A5A", "#3C86FF"],
    },

    // Success screen
    success: ["#2EF2A0", "#58E1FF", "#7B8CFF"],
  },

  radius: {
    xl: 24,
    lg: 18,
    md: 14,
  },

  spacing: {
    screenX: 22,
    screenBottom: 28,
  },

  // Consistent safe top padding (fixes “too high” content)
  safeTop: (Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0) + 10,

  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
  },
};
