// ui/theme.js
export const theme = {
    colors: {
      text: "#FFFFFF",
      textMuted: "rgba(255,255,255,0.74)",
      textFaint: "rgba(255,255,255,0.55)",
  
      // Bright but premium (not “AI neon”)
      accent: "#B36BFF",   // violet
      accent2: "#6FE7FF",  // aqua
      warn: "#FFD84D",
      success: "#46F2A2",
  
      buttonTextDark: "#0B1028",
      card: "rgba(255,255,255,0.10)",
      cardBorder: "rgba(255,255,255,0.18)",
  
      shadow: "rgba(0,0,0,0.25)",
    },
  
    radius: { md: 14, lg: 18, xl: 22, pill: 999 },
    space: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 30 },
  
    // Background gradients per “mood” (not too dark)
    gradients: {
      base: ["#16235E", "#4D4CFF", "#B36BFF"],   // premium indigo → violet
      calm: ["#0E2A47", "#1F7AA6", "#6FE7FF"],   // ocean
      energetic: ["#2A1B6E", "#6B3BFF", "#FF62B8"], // pop
      alarm: ["#2A1B6E", "#6B3BFF", "#FF62B8"],  // alarm = energetic
      success: ["#1A7F6C", "#46F2A2", "#6FE7FF"],
    },
  };
  