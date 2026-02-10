// screens/WelcomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import ScreenShell from "../ui/ScreenShell";
import { theme } from "../ui/theme";

export default function WelcomeScreen({ navigation }) {
  return (
    <ScreenShell>
      <View style={styles.wrap}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require("../assets/eddy/eddy-happy.png")}
            style={styles.eddy}
            contentFit="contain"
          />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>🔒  No snooze</Text>
          </View>

          <Text style={styles.brand}>Edison</Text>
          <Text style={styles.tagline}>Wake up. Prove it. Stay awake.</Text>

          <Text style={styles.subtext}>
            You snooze, you lose.
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("SetTime")}
        >
          <LinearGradient
            colors={[theme.colors.accent2, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGrad}
          >
            <Text style={styles.ctaText}>Set up alarm</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "space-between", paddingBottom: 14 },

  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },

  eddy: { width: 200, height: 200, marginBottom: 20 },

  badge: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    color: theme.colors.text,
    fontWeight: "900",
    letterSpacing: 0.3,
    fontSize: 13,
  },

  brand: {
    fontSize: 52,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: -1.5,
  },

  tagline: {
    marginTop: 8,
    fontSize: 17,
    color: theme.colors.textMuted,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  subtext: {
    marginTop: 20,
    fontSize: 14,
    color: theme.colors.textFaint,
    fontWeight: "800",
    fontStyle: "italic",
  },

  cta: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    marginTop: 14,
  },

  ctaGrad: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  ctaText: {
    color: theme.colors.buttonTextDark,
    fontSize: 18,
    fontWeight: "900",
  },

  ctaArrow: {
    color: theme.colors.buttonTextDark,
    fontSize: 20,
    fontWeight: "900",
  },
});