// theme/theme.js
import { Platform, StatusBar } from "react-native";

export const Theme = {
  colors: {
    bgTop: "#0C1229",
    bgMid: "#0F1733",
    bgBottom: "#0C122A",

    card: "rgba(255,255,255,0.08)",
    cardBorder: "rgba(255,255,255,0.14)",

    text: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.72)",
    textFaint: "rgba(255,255,255,0.52)",

    accent: "#7B8CFF",
    accent2: "#C96BFF",
    success: "#2EF2A0",
    warning: "#FFD166",

    buttonText: "#0B1026",
  },

  gradients: {
    appBg: ["#0C1229", "#0F1733", "#0C122A"],
    cta: ["#7B8CFF", "#C96BFF"],
    alarmDefault: ["#1A1040", "#4B2D8E", "#9B4DCA"],

    alarmByPersonality: {
      motivational: ["#1A1040", "#4B2D8E", "#9B4DCA"],
      sassy: ["#3A1B6B", "#C2457A", "#FFB86B"],
      "drill-sergeant": ["#2B2F4A", "#4A1B2A", "#C96BFF"],
      zen: ["#0E2F44", "#123A5A", "#3C86FF"],
    },

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