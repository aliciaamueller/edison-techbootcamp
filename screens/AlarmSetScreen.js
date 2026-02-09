// screens/AlarmSetScreen.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

export default function AlarmSetScreen({ navigation, route }) {
  const params = route.params || {};
  const { reason, proofMethod, time } = params;

  const timeString = typeof time === "string" ? time : "7:00 AM";

  useEffect(() => {
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
  }, []);

  return (
    <ScreenShell variant="base">
      <View style={styles.center}>
        <Text style={styles.big}>✅</Text>
        <Text style={styles.h1}>Alarm set</Text>

        <GlassCard style={{ width: "100%", marginTop: 16 }}>
          <Row label="Time" value={timeString} />
          <Row label="Reason" value={reason || "Wake up"} />
          <Row label="Challenge" value={proofMethod === "steps" ? "Walk steps" : "Hand wave"} />
        </GlassCard>

        <Text style={styles.note}>Your alarm will ring in 2.5 seconds (test mode).</Text>
      </View>
    </ScreenShell>
  );
}

function Row({ label, value }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
      <Text style={{ color: theme.colors.textFaint, fontWeight: "900" }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontWeight: "900" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  big: { fontSize: 64 },
  h1: { color: theme.colors.text, fontSize: 40, fontWeight: "900", letterSpacing: -1, marginTop: 10 },
  note: { color: theme.colors.textMuted, fontWeight: "700", marginTop: 18, textAlign: "center" },
});
