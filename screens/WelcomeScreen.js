// screens/WelcomeScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import ScreenShell from "../ui/ScreenShell";
import { theme } from "../ui/theme";

export default function WelcomeScreen({ navigation }) {
  const [volume, setVolume] = useState(1.0);

  return (
    <ScreenShell>
      <View style={styles.wrap}>
        {/* Volume slider on left edge */}
        <View style={styles.volumeWrap}>
          <View style={styles.volumeTrack}>
            <View style={[styles.volumeFill, { height: `${volume * 100}%` }]} />
          </View>
          <TouchableOpacity
            onPress={() => setVolume(volume > 0.5 ? 0.3 : 1.0)}
            style={styles.volumeBtn}
            activeOpacity={0.85}
          >
            <Ionicons name="volume-high" size={18} color="rgba(255,255,255,0.92)" />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require("../assets/eddy/eddy-happy.png")}
            style={styles.eddy}
            contentFit="contain"
          />

          <View style={styles.badge}>
            <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.95)" />
            <Text style={styles.badgeText}>No snooze</Text>
          </View>

          <Text style={styles.brand}>Edison</Text>
          <Text style={styles.tagline}>Wake up. Prove it. Stay awake.</Text>
          <Text style={styles.subtext}>You snooze, you lose.</Text>
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
            <Ionicons name="arrow-forward" size={20} color={theme.colors.buttonTextDark} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "space-between", paddingBottom: 14 },

  volumeWrap: {
    position: "absolute",
    left: -8,
    top: "33%",
    zIndex: 10,
    alignItems: "center",
    width: 44,
    gap: 8,
  },
  volumeTrack: {
    width: 6,
    height: 80,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  volumeFill: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  volumeBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },

  eddy: { width: 200, height: 200, marginBottom: 20 },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
});
