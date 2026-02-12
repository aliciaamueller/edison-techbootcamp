// screens/SetTimeScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

export default function SetTimeScreen({ navigation, route }) {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const userRole = route.params?.userRole || "other";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) setSelectedDays(selectedDays.filter((d) => d !== day));
    else setSelectedDays([...selectedDays, day]);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <ScreenShell variant="base">
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.step}>Step 1 of 4</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>What time do you{`\n`}need to wake up?</Text>

        <TouchableOpacity activeOpacity={0.9} onPress={() => setShowPicker(true)}>
          <GlassCard style={styles.timeCard}>
            <Text style={styles.timeText}>{formatTime(time)}</Text>
            <Text style={styles.sub}>Tap to change</Text>
          </GlassCard>
        </TouchableOpacity>

        {showPicker && (
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              onChange={(event, selectedTime) => {
                setShowPicker(Platform.OS === "ios");
                if (selectedTime) setTime(selectedTime);
              }}
            />
          </View>
        )}

        <Text style={styles.label}>Repeat on</Text>
        <View style={styles.daysRow}>
          {days.map((day) => {
            const active = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                activeOpacity={0.85}
                style={[styles.dayPill, active && styles.dayPillActive]}
              >
                <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("Reason", {
              time: formatTime(time),
              days: selectedDays,
              userRole,
            })
          }
        >
          <Text style={styles.ctaText}>Next</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    marginBottom: 12,
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
  step: { color: theme.colors.textFaint, fontWeight: "800" },

  content: { paddingBottom: 30 },
  h1: {
    color: theme.colors.text,
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 18,
    lineHeight: 46,
  },

  timeCard: { alignItems: "center", paddingVertical: 26, marginBottom: 14 },
  timeText: { color: theme.colors.text, fontSize: 52, fontWeight: "900", letterSpacing: -1.5 },
  sub: { color: theme.colors.textFaint, marginTop: 8, fontWeight: "700" },

  pickerWrap: { marginBottom: 14 },

  label: {
    color: theme.colors.textFaint,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 10,
    marginBottom: 12,
  },

  daysRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  dayPill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  dayPillActive: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.28)",
  },
  dayText: { color: theme.colors.textFaint, fontWeight: "900", fontSize: 14 },
  dayTextActive: { color: theme.colors.text },

  cta: {
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