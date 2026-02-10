// screens/ProofMethodScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

export default function ProofMethodScreen({ navigation, route }) {
  const [selectedMethod, setSelectedMethod] = useState("steps");

  const methods = [
    { id: "mental", icon: "🧠", name: "Mental Challenge", desc: "Solve a puzzle to prove you're alert" },
    { id: "steps", icon: "👟", name: "Physical — Steps", desc: "Walk steps with your phone" },
    { id: "camera", icon: "📸", name: "Physical — Camera", desc: "Show your face to the camera" },
  ];

  return (
    <ScreenShell variant="base">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.step}>Step 3 of 4</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.h1}>How do you want{`\n`}to prove you're awake?</Text>

        <View style={{ gap: 12, marginTop: 14 }}>
          {methods.map((m) => {
            const active = selectedMethod === m.id;
            return (
              <TouchableOpacity key={m.id} activeOpacity={0.9} onPress={() => setSelectedMethod(m.id)}>
                <GlassCard style={[styles.method, active && styles.methodActive]}>
                  <Text style={styles.icon}>{m.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{m.name}</Text>
                    <Text style={styles.desc}>{m.desc}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioOn]} />
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.cta}
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate("AlarmSet", {
            ...route.params,
            proofMethod: selectedMethod,
            round: route.params?.round ?? 1,
          });
        }}
      >
        <Text style={styles.ctaText}>Continue</Text>
        <Text style={styles.ctaArrow}>→</Text>
      </TouchableOpacity>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  back: { color: theme.colors.text, fontSize: 30, fontWeight: "700" },
  step: { color: theme.colors.textFaint, fontWeight: "800" },

  content: { paddingBottom: 20 },
  h1: { color: theme.colors.text, fontSize: 38, fontWeight: "900", letterSpacing: -1, lineHeight: 44 },

  method: { flexDirection: "row", alignItems: "center", gap: 14 },
  methodActive: { borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(255,255,255,0.14)" },
  icon: { fontSize: 38 },
  name: { color: theme.colors.text, fontWeight: "900", fontSize: 18 },
  desc: { color: theme.colors.textFaint, fontWeight: "700", marginTop: 4 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
  radioOn: { backgroundColor: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.85)" },

  cta: {
    position: "absolute",
    left: theme.space.xl,
    right: theme.space.xl,
    bottom: theme.space.xl,
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