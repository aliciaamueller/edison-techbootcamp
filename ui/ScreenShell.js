// ui/ScreenShell.js
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "./theme";

export default function ScreenShell({ children, variant = "base" }) {
  const colors = theme.gradients[variant] || theme.gradients.base;

  return (
    <LinearGradient colors={colors} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.inner}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.lg,
    paddingBottom: theme.space.xl,
  },
});
