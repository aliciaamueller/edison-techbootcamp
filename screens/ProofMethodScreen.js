// screens/ProofMethodScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";
import { loadProfiles, loadUserProfile, updateProfile, updateUserProfile } from "../services/userProfileStorage";
import { scheduleAlarmNotification, cancelAlarmNotification } from "../services/alarmEngine";

export default function ProofMethodScreen({ navigation, route }) {
  const { profileId, mode } = route.params || {};
  const [selectedMethod, setSelectedMethod] = useState("steps");

  // Load existing data
  useEffect(() => {
    (async () => {
      const profiles = await loadProfiles();
      const profile = profiles.find(p => p.id === profileId) || await loadUserProfile();
      if (profile?.proofMethod) {
        setSelectedMethod(profile.proofMethod);
      }
    })();
  }, [profileId]);

  const methods = [
    { id: "mental", icon: "🧠", name: "Mental Challenge", desc: "Solve a puzzle to prove you're alert" },
    { id: "steps", icon: "👟", name: "Physical — Steps", desc: "Walk steps with your phone" },
    { id: "camera", icon: "👋", name: "Physical — Hand Wave", desc: "Wave your hand to prove you're awake" },
  ];

  const formatWakeTime = (ms) => {
    if (!ms) return "N/A";
    const date = new Date(ms);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        <Text style={styles.step}>Step 4 of 5</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
        onPress={async () => {
          try {
            console.log("[ProofMethod] Finish pressed", { selectedMethod, profileId });
            // 1. Save proof method
            if (profileId) {
              await updateProfile(profileId, { proofMethod: selectedMethod });
            } else {
              await updateUserProfile({ proofMethod: selectedMethod });
            }

            // 2. Fetch the profile details
            const profiles = await loadProfiles();
            const profile = profiles.find((p) => p.id === profileId) || (await loadUserProfile());

            if (!profile) {
              console.warn("[ProofMethod] Profile not found, navigating with defaults");
              navigation.navigate("AlarmSet", { profileId, mode, proofMethod: selectedMethod });
              return;
            }

            // 3. Prepare parameters for scheduling & fallback
            const wakeTime = profile.wakeTimeMs || Date.now() + 60000;
            const t = new Date(wakeTime);
            const nextTime = new Date();
            nextTime.setHours(t.getHours(), t.getMinutes(), 0, 0);
            if (nextTime.getTime() <= Date.now()) {
              nextTime.setDate(nextTime.getDate() + 1);
            }

            let id = null;
            let scheduledFor = nextTime.toISOString();

            // 4. Try to schedule notification
            try {
              if (profile.wakeTimeMs) {
                const res = await scheduleAlarmNotification({
                  time: nextTime,
                  title: "Wake up!",
                  body: `It's time to ${profile.reason || "wake up"}!`,
                });
                id = res.id;
                scheduledFor = res.scheduledFor;
              } else {
                console.warn("[ProofMethod] No wake time set, skipping notification scheduling.");
              }
            } catch (err) {
              console.warn("[ProofMethod] ALARM SCHEDULING FAILED", err);
            }

            // 5. Navigate to AlarmSet
            console.log("[ProofMethod] Navigating to AlarmSet");
            navigation.navigate("AlarmSet", {
              ...route.params,
              profileId,
              mode,
              proofMethod: selectedMethod,
              alarmNotificationId: id,
              alarmScheduledFor: scheduledFor,
              timeString: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            });
          } catch (err) {
            console.warn("[ProofMethod] Finish failed", err);
            navigation.navigate("AlarmSet", { profileId, mode, proofMethod: selectedMethod });
          }
        }}
      >
        <Text style={styles.ctaText}>Finish Setup</Text>
        <Ionicons name="checkmark-circle" size={22} color={theme.colors.buttonTextDark} />
      </TouchableOpacity>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
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