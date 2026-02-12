// screens/RoleSelectScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

const ROLES = [
  {
    id: "student",
    icon: "school-outline",
    emoji: "🎓",
    title: "Student",
    desc: "Classes, exams & study sessions",
  },
  {
    id: "professional",
    icon: "briefcase-outline",
    emoji: "💼",
    title: "Professional",
    desc: "Meetings, standups & deadlines",
  },
  {
    id: "flight-crew",
    icon: "airplane-outline",
    emoji: "✈️",
    title: "Flight crew / Traveler",
    desc: "Flights, layovers & time zones",
  },
  {
    id: "health",
    icon: "medkit-outline",
    emoji: "💊",
    title: "Health & Medication",
    desc: "Medication reminders & appointments",
  },
  {
    id: "shift-worker",
    icon: "moon-outline",
    emoji: "🏭",
    title: "Shift worker",
    desc: "Rotating shifts & early starts",
  },
  {
    id: "parent",
    icon: "people-outline",
    emoji: "👨‍👧",
    title: "Parent / Caregiver",
    desc: "School runs, routines & care schedules",
  },
  {
    id: "athlete",
    icon: "fitness-outline",
    emoji: "🏃",
    title: "Athlete / Fitness",
    desc: "Training, matches & gym sessions",
  },
  {
    id: "other",
    icon: "ellipsis-horizontal-outline",
    emoji: "🌍",
    title: "Other",
    desc: "I just need to wake up on time",
  },
];

export default function RoleSelectScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);

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
        <Text style={styles.step}>Who are you?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>What best{"\n"}describes you?</Text>
        <Text style={styles.subtitle}>
          We'll tailor your accountability experience and AI examples to fit your life.
        </Text>

        <View style={styles.grid}>
          {ROLES.map((role) => {
            const active = selectedRole === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                activeOpacity={0.9}
                onPress={() => setSelectedRole(role.id)}
                style={[styles.roleCard, active && styles.roleCardActive]}
              >
                <Text style={styles.roleEmoji}>{role.emoji}</Text>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDesc}>{role.desc}</Text>
                {active && (
                  <View style={styles.checkMark}>
                    <Ionicons name="checkmark" size={14} color="#0A0F1F" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!selectedRole}
          style={[styles.cta, !selectedRole && { opacity: 0.45 }]}
          onPress={() => {
            if (!selectedRole) return;
            navigation.navigate("SetTime", { userRole: selectedRole });
          }}
        >
          <Text style={styles.ctaText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.buttonTextDark} />
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  content: { paddingBottom: 20 },

  h1: {
    color: theme.colors.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 8,
    lineHeight: 44,
    marginTop: 8,
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontWeight: "700",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  roleCard: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: theme.radius.xl,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 130,
    position: "relative",
  },
  roleCardActive: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderColor: "rgba(255,255,255,0.35)",
  },

  roleEmoji: { fontSize: 32, marginBottom: 4 },
  roleTitle: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
  },
  roleDesc: {
    color: theme.colors.textFaint,
    fontWeight: "700",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },

  checkMark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.90)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomBar: {
    position: "absolute",
    left: theme.space.xl,
    right: theme.space.xl,
    bottom: theme.space.xl,
  },

  cta: {
    height: 62,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(255,255,255,0.90)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  ctaText: { color: theme.colors.buttonTextDark, fontWeight: "900", fontSize: 18 },
});