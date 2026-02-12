// screens/AlarmSetScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

export default function AlarmSetScreen({ navigation, route }) {
  const params = route.params || {};
  const { reason, proofMethod, time } = params;
  const [countdownStarted, setCountdownStarted] = useState(false);

  const timeString = typeof time === "string" ? time : "7:00 AM";

  const challengeLabel =
    proofMethod === "steps"
      ? "Walk steps"
      : proofMethod === "mental"
      ? "Mental challenge"
      : "Camera face check";

  const startAlarmCountdown = () => {
    setCountdownStarted(true);
  };

  useEffect(() => {
    if (!countdownStarted) return;

    const timer = setTimeout(() => {
      navigation.navigate("AlarmRinging", {
        ...params,
        time: timeString,
        demoMode: true,
        intervalSeconds: 20,
        totalRounds: 3,
        demoRequiredSteps: [10, 6, 4],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [countdownStarted]);

  // Auto-start after a brief moment to let user see the summary
  useEffect(() => {
    const autoStart = setTimeout(() => {
      setCountdownStarted(true);
    }, 3000);
    return () => clearTimeout(autoStart);
  }, []);

  return (
    <ScreenShell variant="base">
      {/* Back button to go change settings */}
      {!countdownStarted && (
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.editHint}>Tap back to edit</Text>
        </View>
      )}

      <View style={styles.center}>
        <Text style={styles.big}>✅</Text>
        <Text style={styles.h1}>Alarm set</Text>

        <GlassCard style={{ width: "100%", marginTop: 16 }}>
          <Row label="Time" value={timeString} />
          <Row label="Reason" value={reason || "Wake up"} />
          <Row label="Challenge" value={challengeLabel} />
        </GlassCard>

        {/* Accountability reminder */}
        <GlassCard style={styles.accountabilityCard}>
          <View style={styles.accountabilityRow}>
            <Ionicons name="trophy-outline" size={18} color="#FFD84D" />
            <Text style={styles.accountabilityText}>
              Complete all 3 rounds to earn your accountability streak
            </Text>
          </View>
        </GlassCard>

        <Text style={styles.note}>
          {countdownStarted
            ? "Your alarm will ring in a moment (test mode)..."
            : "Preparing alarm... tap back to make changes."}
        </Text>

        {!countdownStarted && (
          <TouchableOpacity
            style={styles.startBtn}
            activeOpacity={0.9}
            onPress={startAlarmCountdown}
          >
            <Text style={styles.startBtnText}>Start now</Text>
            <Ionicons name="play" size={18} color={theme.colors.buttonTextDark} />
          </TouchableOpacity>
        )}
      </View>
    </ScreenShell>
  );
}

function Row({ label, value }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
      <Text style={{ color: theme.colors.textFaint, fontWeight: "900" }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontWeight: "900", flexShrink: 1, textAlign: "right" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  editHint: {
    color: theme.colors.textFaint,
    fontWeight: "700",
    fontSize: 14,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  big: { fontSize: 64 },
  h1: { color: theme.colors.text, fontSize: 40, fontWeight: "900", letterSpacing: -1, marginTop: 10 },
  note: { color: theme.colors.textMuted, fontWeight: "700", marginTop: 18, textAlign: "center" },

  accountabilityCard: {
    width: "100%",
    marginTop: 14,
    backgroundColor: "rgba(255,216,77,0.08)",
    borderColor: "rgba(255,216,77,0.20)",
  },
  accountabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  accountabilityText: {
    color: theme.colors.textMuted,
    fontWeight: "700",
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },

  startBtn: {
    marginTop: 20,
    height: 52,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(255,255,255,0.90)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  startBtnText: { color: theme.colors.buttonTextDark, fontWeight: "900", fontSize: 16 },
});