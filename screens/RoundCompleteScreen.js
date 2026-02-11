// screens/RoundCompleteScreen.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

export default function RoundCompleteScreen({ navigation, route }) {
  const { round = 1, intervalSeconds = 300 } = route.params || {};
  const [timeLeft, setTimeLeft] = useState(intervalSeconds);
  const timeLeftRef = useRef(intervalSeconds);

  const intervalLabel = intervalSeconds >= 60
    ? `${Math.round(intervalSeconds / 60)} minute${Math.round(intervalSeconds / 60) !== 1 ? "s" : ""}`
    : `${intervalSeconds} seconds`;

  useEffect(() => {
    const timer = setInterval(() => {
      timeLeftRef.current -= 1;
      const newVal = timeLeftRef.current;

      if (newVal <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        navigation.navigate("AlarmRinging", { ...route.params, round: round + 1 });
        return;
      }

      setTimeLeft(newVal);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <ScreenShell variant="calm">
      <View style={styles.center}>
        <Text style={styles.check}>✓</Text>

        <Text style={styles.h1}>Round {round} done</Text>
        <Text style={styles.sub}>Alarm will check again in {intervalLabel}</Text>

        <GlassCard style={{ width: "100%", marginTop: 18, alignItems: "center" }}>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>until next check</Text>
        </GlassCard>

        <GlassCard style={{ width: "100%", marginTop: 14 }}>
          <Text style={styles.tipTitle}>💤 Stay awake</Text>
          <Text style={styles.tipText}>
            The alarm will ring again to confirm you didn't fall back asleep.
          </Text>
        </GlassCard>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  check: {
    fontSize: 56,
    color: theme.colors.success,
    fontWeight: "900",
    marginBottom: 12,
  },

  h1: { color: theme.colors.text, fontSize: 40, fontWeight: "900", letterSpacing: -1 },
  sub: { color: theme.colors.textMuted, fontWeight: "800", marginTop: 10, textAlign: "center" },

  timer: { color: theme.colors.text, fontSize: 64, fontWeight: "900", letterSpacing: -2 },
  timerLabel: { color: theme.colors.textFaint, fontWeight: "900", letterSpacing: 1, textTransform: "uppercase", marginTop: 10 },

  tipTitle: { color: theme.colors.text, fontWeight: "900", fontSize: 16 },
  tipText: { color: theme.colors.textMuted, fontWeight: "700", marginTop: 8, lineHeight: 20 },
});