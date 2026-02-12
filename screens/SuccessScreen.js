// screens/SuccessScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Image } from "expo-image";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

export default function SuccessScreen({ navigation }) {
  const [scaleAnim] = useState(new Animated.Value(0.92));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    Animated.spring(scaleAnim, { toValue: 1, tension: 45, friction: 7, useNativeDriver: true }).start();
  }, []);

  return (
    <ScreenShell variant="success">
      <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: "center" }}>
          <Image source={require("../assets/eddy/eddy-celebrating.png")} style={styles.eddy} contentFit="contain" />
          <Text style={styles.h1}>Mission complete</Text>
          <Text style={styles.sub}>Eddy's lightbulb is ON 💡</Text>
        </Animated.View>

        <GlassCard style={{ width: "100%", marginTop: 18 }}>
          <Text style={styles.msg}>
            You powered through all 3 rounds. 🎉{`\n`}Time to conquer the day.
          </Text>
        </GlassCard>

        {/* Accountability streak card */}
        <GlassCard style={styles.streakCard}>
          <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakTitle}>Accountability streak +1</Text>
              <Text style={styles.streakText}>
                Keep waking up on time to unlock your discount — €1.99 → €0.99/mo
              </Text>
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity style={styles.cta} activeOpacity={0.9} onPress={() => navigation.navigate("Welcome")}>
          <Text style={styles.ctaText}>Back to home</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  eddy: { width: 200, height: 200, marginBottom: 10 },

  h1: { color: theme.colors.text, fontSize: 44, fontWeight: "900", letterSpacing: -1 },
  sub: { color: "rgba(255,255,255,0.86)", fontWeight: "800", marginTop: 10 },

  msg: { color: theme.colors.text, fontWeight: "900", textAlign: "center", lineHeight: 24, fontSize: 16 },

  streakCard: {
    width: "100%",
    marginTop: 14,
    backgroundColor: "rgba(255,216,77,0.10)",
    borderColor: "rgba(255,216,77,0.25)",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  streakEmoji: { fontSize: 28 },
  streakTitle: {
    color: "#FFD84D",
    fontWeight: "900",
    fontSize: 15,
    marginBottom: 4,
  },
  streakText: {
    color: theme.colors.textMuted,
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 19,
  },

  cta: {
    marginTop: 18,
    width: "100%",
    height: 62,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(255,255,255,0.90)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  ctaText: { color: theme.colors.buttonTextDark, fontWeight: "900", fontSize: 18 },
  ctaArrow: { color: theme.colors.buttonTextDark, fontWeight: "900", fontSize: 20 },
});