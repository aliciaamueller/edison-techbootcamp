// ui/ScreenShell.js
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Background from "./Background";
import { theme } from "./theme";

export default function ScreenShell({ children, variant = "base" }) {
  return (
    <View style={styles.bg}>
      <Background variant={variant} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.inner}>{children}</View>
      </SafeAreaView>
    </View>
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
