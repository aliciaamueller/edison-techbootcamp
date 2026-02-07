// screens/WelcomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

export default function WelcomeScreen({ navigation }) {
  return (
    <ScreenShell>
      <View style={styles.wrap}>
        {/* Eddy hero */}
        <View style={styles.hero}>
          <Image
            source={require("../assets/eddy/eddy-happy.png")}
            style={styles.eddy}
            contentFit="contain"
          />

          {/* Punch phrase */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>You snooze, you lose.</Text>
          </View>

          <Text style={styles.brand}>Edison</Text>
          <Text style={styles.tagline}>Wake up. Prove it. Stay awake.</Text>
        </View>

        <GlassCard>
          <Text style={styles.cardTitle}>Triple verification</Text>
          <Text style={styles.cardBody}>
            This alarm doesn’t just wake you up — it checks again (3 rounds) to
            make sure you stayed awake.
          </Text>

          <View style={styles.pills}>
            <View style={styles.pill}>
              <Text style={styles.pillIcon}>🔒</Text>
              <Text style={styles.pillText}>No snooze</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillIcon}>🎯</Text>
              <Text style={styles.pillText}>3 rounds</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillIcon}>💡</Text>
              <Text style={styles.pillText}>Eddy powered</Text>
            </View>
          </View>
        </GlassCard>

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
    alignItems: "center",
    paddingTop: 26,
    paddingBottom: 10,
  },

  eddy: { width: 170, height: 170, marginBottom: 10 },

  badge: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 10,
  },
  badgeText: {
    color: theme.colors.text,
    fontWeight: "900",
    letterSpacing: 0.2,
    fontSize: 13,
  },

  brand: {
    fontSize: 48,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: -1.5,
  },

  tagline: {
    marginTop: 8,
    fontSize: 16,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 8,
  },

  cardBody: {
    fontSize: 15,
    color: theme.colors.textMuted,
    lineHeight: 22,
    fontWeight: "600",
  },

  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  pillIcon: { marginRight: 8, fontSize: 14 },
  pillText: { color: theme.colors.text, fontWeight: "800", fontSize: 13 },

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
