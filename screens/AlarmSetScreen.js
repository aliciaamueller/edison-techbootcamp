import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { initNotifications, scheduleAlarmNotification } from "../services/alarmEngine";

export default function AlarmSetScreen({ navigation, route }) {
  const params = route.params || {};
  const { reason, proofMethod, timeDate, timeLabel } = params;

  const [status, setStatus] = useState("Scheduling...");
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    (async () => {
      await initNotifications();

      // For demo/testing: schedule for 10 seconds from now if no timeDate
      const base = timeDate instanceof Date ? timeDate : new Date(Date.now() + 10 * 1000);

      const { id, scheduledFor } = await scheduleAlarmNotification({
        time: base,
        title: "Edison Alarm",
        body: "Tap to begin wake verification.",
      });

      setNotificationId(id);
      setStatus(`Scheduled (${timeLabel || "soon"})`);

      // Store id in navigation params so you can cancel later if needed
      // (optional)
    })();
  }, []);

  return (
    <LinearGradient colors={["#0a0e27", "#1a1f3a", "#2a2f4a"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✅</Text>
        </View>

        <Text style={styles.title}>Alarm Scheduled</Text>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{timeLabel || "In ~10s (demo)"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reason:</Text>
            <Text style={styles.detailValue}>{reason || "Wake up"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Challenge:</Text>
            <Text style={styles.detailValue}>{proofMethod === "steps" ? "Walk Steps" : "Hand Wave"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{status}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🔔</Text>
          <Text style={styles.infoText}>
            When the notification appears, tap it to start the wake verification flow.
          </Text>
        </View>

        {/* Optional: manual test */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() =>
            navigation.navigate("AlarmRinging", {
              ...params,
              round: 1,
            })
          }
        >
          <Text style={styles.skipText}>Test Ring Now →</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  icon: { fontSize: 64 },
  title: { fontSize: 38, fontWeight: "900", color: "#ffffff", marginBottom: 30, letterSpacing: -1 },
  detailsBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  detailLabel: { fontSize: 16, color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" },
  detailValue: { fontSize: 16, color: "#ffffff", fontWeight: "700", maxWidth: "60%", textAlign: "right" },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(65, 88, 208, 0.15)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoIcon: { fontSize: 24, marginRight: 12 },
  infoText: { flex: 1, fontSize: 14, color: "rgba(255, 255, 255, 0.8)", fontWeight: "500", lineHeight: 20 },
  skipButton: { paddingVertical: 12, paddingHorizontal: 24 },
  skipText: { fontSize: 16, color: "#4158D0", fontWeight: "600" },
});
