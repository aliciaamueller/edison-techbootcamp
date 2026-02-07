// ui/GlassCard.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "./theme";

export default function GlassCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.xl,
    padding: theme.space.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
});
