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
          <Text style={styles.sub}>Eddy’s lightbulb is ON 💡</Text>
        </Animated.View>

        <GlassCard style={{ width: "100%", marginTop: 18 }}>
          <Text style={styles.msg}>
            You powered through. 🎉{`\n`}Time to conquer the day.
          </Text>
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
  eddy: { width: 220, height: 220, marginBottom: 10 },

  h1: { color: theme.colors.text, fontSize: 44, fontWeight: "900", letterSpacing: -1 },
  sub: { color: "rgba(255,255,255,0.86)", fontWeight: "800", marginTop: 10 },

  msg: { color: theme.colors.text, fontWeight: "900", textAlign: "center", lineHeight: 24, fontSize: 16 },

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
