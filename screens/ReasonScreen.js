// screens/ReasonScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

function IconChip({ name }) {
  return (
    <View style={styles.iconChip}>
      <Ionicons name={name} size={18} color="rgba(255,255,255,0.92)" />
    </View>
  );
}

export default function ReasonScreen({ navigation, route }) {
  const [reason, setReason] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("energetic");
  const [selectedPersonality, setSelectedPersonality] = useState("motivational");
  const [selectedIntervalMinutes, setSelectedIntervalMinutes] = useState(5);
  const [isCustomInterval, setIsCustomInterval] = useState(false);
  const [customIntervalInput, setCustomIntervalInput] = useState("5");

  const examples = [
    { icon: "school-outline", text: "8:00 lecture — prof takes attendance" },
    { icon: "briefcase-outline", text: "Morning internship shift — first standup in 15 min" },
    { icon: "train-outline", text: "Catch the 6:40 train — doors close fast" },
    { icon: "tennisball-outline", text: "Padel match at 7:15 — don't bail on your partner" },
  ];

  const genres = [
    { id: "energetic", name: "Energetic", icon: "flash-outline", desc: "High-energy beats" },
    { id: "calm", name: "Calm", icon: "water-outline", desc: "Peaceful sounds" },
    { id: "rock", name: "Rock", icon: "musical-notes-outline", desc: "Wake up loud" },
    { id: "electronic", name: "Electronic", icon: "headset-outline", desc: "Synth vibes" },
  ];

  const personalities = [
    { id: "motivational", name: "Motivational", icon: "flash-outline", desc: "Get fired up" },
    { id: "sassy", name: "Sassy", icon: "sparkles-outline", desc: "Witty + bold" },
    { id: "drill-sergeant", name: "Drill", icon: "shield-checkmark-outline", desc: "No excuses" },
    { id: "zen", name: "Zen", icon: "leaf-outline", desc: "Calm focus" },
  ];

  const intervalOptions = [
    { value: 3, label: "3 min" },
    { value: 5, label: "5 min" },
    { value: 10, label: "10 min" },
    { value: 15, label: "15 min" },
  ];

  const clampIntervalMinutes = (value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 3) return 3;
    if (num > 3600) return 3600;
    return num;
  };

  const getEffectiveIntervalMinutes = () => {
    if (isCustomInterval) return clampIntervalMinutes(customIntervalInput);
    return selectedIntervalMinutes;
  };

  const customHelper = useMemo(() => {
    if (!isCustomInterval) return null;
    const num = parseInt(customIntervalInput, 10);
    if (isNaN(num) || customIntervalInput.trim() === "") return "Please enter a valid number";
    if (num < 3) return "Minimum is 3 minutes (will be set to 3)";
    if (num > 3600) return "Maximum is 3600 minutes (will be set to 3600)";
    return null;
  }, [customIntervalInput, isCustomInterval]);

  const preview = useMemo(() => {
    const name = userName?.trim() ? userName.trim() : "you";
    const why = reason?.trim() ? reason.trim() : "today";
    if (selectedPersonality === "sassy") return `"Wake up ${name}! Your pillow is lying to you. ${why}. Now."`;
    if (selectedPersonality === "drill-sergeant") return `"UP NOW ${name}! Mission: ${why}. MOVE."`;
    if (selectedPersonality === "zen") return `"Good morning ${name}. Breathe once. Then begin: ${why}."`;
    return `"Rise and shine ${name}! ${why} starts the moment you stand up."`;
  }, [reason, selectedPersonality, userName]);

  const canContinue = !!userName.trim() && !!reason.trim() && (!isCustomInterval || !customHelper);

  return (
    <ScreenShell variant="base">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.step}>Step 2 of 4</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>QUICK EXAMPLES</Text>

          <View style={{ gap: 12 }}>
            {examples.map((e, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => setReason(e.text)}>
                <GlassCard style={styles.exampleCard}>
                  <IconChip name={e.icon} />
                  <Text style={styles.exampleText}>{e.text}</Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 22 }]}>AI personality</Text>
          <View style={styles.grid}>
            {personalities.map((p) => {
              const active = selectedPersonality === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedPersonality(p.id)}
                  style={[styles.pickCard, active && styles.pickCardActive]}
                >
                  <Ionicons name={p.icon} size={22} color="rgba(255,255,255,0.92)" />
                  <Text style={styles.pickTitle}>{p.name}</Text>
                  <Text style={styles.pickDesc}>{p.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Alarm sound</Text>
          <View style={styles.grid}>
            {genres.map((g) => {
              const active = selectedGenre === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedGenre(g.id)}
                  style={[styles.pickCard, active && styles.pickCardActive]}
                >
                  <Ionicons name={g.icon} size={22} color="rgba(255,255,255,0.92)" />
                  <Text style={styles.pickTitle}>{g.name}</Text>
                  <Text style={styles.pickDesc}>{g.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Check-in interval</Text>
          <View style={styles.grid}>
            {intervalOptions.map((opt) => {
              const active = !isCustomInterval && selectedIntervalMinutes === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  activeOpacity={0.9}
                  onPress={() => {
                    setIsCustomInterval(false);
                    setSelectedIntervalMinutes(opt.value);
                  }}
                  style={[styles.pickCard, active && styles.pickCardActive]}
                >
                  <Ionicons name="timer-outline" size={22} color="rgba(255,255,255,0.92)" />
                  <Text style={styles.pickTitle}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setIsCustomInterval(true)}
              style={[styles.pickCard, isCustomInterval && styles.pickCardActive]}
            >
              <Ionicons name="create-outline" size={22} color="rgba(255,255,255,0.92)" />
              <Text style={styles.pickTitle}>Custom</Text>
            </TouchableOpacity>
          </View>

          {isCustomInterval && (
            <GlassCard style={{ marginTop: 12 }}>
              <Text style={styles.label}>Custom interval (minutes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 7"
                placeholderTextColor="rgba(255,255,255,0.40)"
                value={customIntervalInput}
                onChangeText={setCustomIntervalInput}
                keyboardType="numeric"
              />
              {!!customHelper && <Text style={styles.helperText}>{customHelper}</Text>}
            </GlassCard>
          )}

          <Text style={styles.intervalNote}>
            Minimum 3 minutes. For demo the app uses a shorter internal timer.
          </Text>

          <GlassCard style={{ marginTop: 18 }}>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ali"
              placeholderTextColor="rgba(255,255,255,0.40)"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="words"
            />

            <View style={{ height: 14 }} />

            <Text style={styles.label}>Why you're waking up</Text>
            <TextInput
              style={[styles.input, { height: 90 }]}
              placeholder="e.g. Important client call at 9"
              placeholderTextColor="rgba(255,255,255,0.40)"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </GlassCard>

          {(userName.trim() || reason.trim()) && (
            <GlassCard style={{ marginTop: 18 }}>
              <Text style={styles.label}>Sample AI message</Text>
              <Text style={styles.preview}>{preview}</Text>
              <Text style={styles.previewNote}>New variations every morning</Text>
            </GlassCard>
          )}

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom glass CTA (like the screenshots) */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!canContinue}
            style={[styles.cta, !canContinue && { opacity: 0.55 }]}
            onPress={() => {
              if (!canContinue) return;
              const intervalSeconds = getEffectiveIntervalMinutes() * 60;
              navigation.navigate("ProofMethod", {
                ...route.params,
                userName: userName.trim(),
                reason: reason.trim(),
                musicGenre: selectedGenre,
                aiPersonality: selectedPersonality,
                intervalSeconds,
                round: 1,
              });
            }}
          >
            <Text style={styles.ctaText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.buttonTextDark} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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

  sectionLabel: {
    color: theme.colors.textFaint,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 12,
    marginBottom: 12,
    marginTop: 8,
  },

  sectionTitle: { color: theme.colors.text, fontWeight: "900", fontSize: 22 },

  exampleCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  iconChip: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  exampleText: {
    color: theme.colors.text,
    fontWeight: "800",
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12 },

  pickCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: theme.radius.xl,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 106,
  },
  pickCardActive: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.28)",
  },
  pickTitle: { color: theme.colors.text, fontWeight: "900", fontSize: 16, marginTop: 4 },
  pickDesc: { color: theme.colors.textFaint, fontWeight: "700", fontSize: 12 },

  label: {
    color: theme.colors.textFaint,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
    fontSize: 12,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: theme.radius.lg,
    padding: 14,
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 16,
  },

  preview: {
    color: theme.colors.text,
    fontWeight: "800",
    fontStyle: "italic",
    lineHeight: 22,
    marginTop: 6,
  },
  previewNote: { color: theme.colors.textFaint, fontWeight: "700", marginTop: 10 },

  helperText: {
    color: theme.colors.textMuted,
    fontWeight: "700",
    fontSize: 13,
    marginTop: 8,
  },

  intervalNote: {
    color: theme.colors.textFaint,
    fontWeight: "700",
    fontSize: 12,
    marginTop: 10,
    fontStyle: "italic",
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
