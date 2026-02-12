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

          {/* Badge */}
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={14} color="rgba(255,255,255,0.95)" />
            <Text style={styles.badgeText}>Accountability platform</Text>
          </View>

          <Text style={styles.brand}>Edison</Text>
          <Text style={styles.tagline}>Wake up. Prove it. Stay accountable.</Text>
          <Text style={styles.subtext}>You snooze, you lose.</Text>

          {/* Discount info card */}
          <View style={styles.discountCard}>
            <Ionicons name="cash-outline" size={18} color="#46F2A2" />
            <Text style={styles.discountText}>
              Stay awake consistently → pay only{" "}
              <Text style={styles.discountHighlight}>€0.99/mo</Text>{" "}
              instead of €1.99
            </Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("RoleSelect")}
        >
          <LinearGradient
            colors={[theme.colors.accent2, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGrad}
          >
            <Text style={styles.ctaText}>Get started</Text>
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
  volumeFill: { width: "100%", backgroundColor: "#FFFFFF", borderRadius: 3 },
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

  hero: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 10 },
  eddy: { width: 180, height: 180, marginBottom: 16 },

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

  brand: { fontSize: 52, fontWeight: "900", color: theme.colors.text, letterSpacing: -1.5 },

  tagline: {
    marginTop: 8,
    fontSize: 17,
    color: theme.colors.textMuted,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },

  subtext: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textFaint,
    fontWeight: "800",
    fontStyle: "italic",
  },

  discountCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(70,242,162,0.10)",
    borderWidth: 1,
    borderColor: "rgba(70,242,162,0.25)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 20,
    marginHorizontal: 10,
  },
  discountText: {
    color: "rgba(255,255,255,0.80)",
    fontWeight: "700",
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
  discountHighlight: {
    color: "#46F2A2",
    fontWeight: "900",
  },

  cta: { borderRadius: theme.radius.xl, overflow: "hidden", marginTop: 14 },
  ctaGrad: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  ctaText: { color: theme.colors.buttonTextDark, fontSize: 18, fontWeight: "900" },
});