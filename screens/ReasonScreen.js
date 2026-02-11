// screens/ReasonScreen.js
import React, { useState } from "react";
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

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

export default function ReasonScreen({ navigation, route }) {
  const [reason, setReason] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("energetic");
  const [selectedPersonality, setSelectedPersonality] = useState("motivational");
  const [selectedIntervalMinutes, setSelectedIntervalMinutes] = useState(5);
  const [isCustomInterval, setIsCustomInterval] = useState(false);
  const [customIntervalInput, setCustomIntervalInput] = useState("5");

  const examples = [
    { icon: "🎓", text: "8:00 lecture — prof takes attendance" },
    { icon: "💼", text: "Morning internship shift — first standup in 15 min" },
    { icon: "🚂", text: "Catch the 6:40 train — doors close fast" },
    { icon: "🏓", text: "Padel match at 7:15 — don't bail on your partner" },
  ];

  const genres = [
    { id: "energetic", name: "Energetic", icon: "⚡", desc: "High-energy beats" },
    { id: "calm", name: "Calm", icon: "🌊", desc: "Peaceful sounds" },
    { id: "rock", name: "Rock", icon: "🎸", desc: "Wake up loud" },
    { id: "electronic", name: "Electronic", icon: "🎵", desc: "Synth vibes" },
  ];

  const personalities = [
    { id: "motivational", name: "Motivational", icon: "⚡", desc: "Get fired up" },
    { id: "sassy", name: "Sassy", icon: "✨", desc: "Witty + bold" },
    { id: "drill-sergeant", name: "Drill", icon: "🛡", desc: "No excuses" },
    { id: "zen", name: "Zen", icon: "🍃", desc: "Calm focus" },
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
    if (isCustomInterval) {
      return clampIntervalMinutes(customIntervalInput);
    }
    return selectedIntervalMinutes;
  };

  const isCustomInputValid = () => {
    if (!isCustomInterval) return true;
    const num = parseInt(customIntervalInput, 10);
    return !isNaN(num) && customIntervalInput.trim() !== "";
  };

  const getCustomHelperText = () => {
    if (!isCustomInterval) return null;
    const num = parseInt(customIntervalInput, 10);
    if (isNaN(num) || customIntervalInput.trim() === "") {
      return "Please enter a valid number";
    }
    if (num < 3) {
      return "Minimum is 3 minutes (will be set to 3)";
    }
    if (num > 3600) {
      return "Maximum is 3600 minutes (will be set to 3600)";
    }
    return null;
  };

  const preview =
    selectedPersonality === "sassy"
      ? `"Wake up ${userName || "you"}! Time to stop dreaming about ${reason || "success"} and do it!"`
      : selectedPersonality === "drill-sergeant"
        ? `"UP NOW ${userName || "you"}! You signed up for ${reason || "this"}. MOVE!"`
        : selectedPersonality === "zen"
          ? `"Good morning ${userName || "you"}. Today brings ${reason || "new opportunities"}. Breathe and begin."`
          : `"Rise and shine ${userName || "you"}! Today you're crushing ${reason || "your goals"}. Let's go!"`;

  const canContinue = !!userName && !!reason && isCustomInputValid();

  return (
    <ScreenShell variant="base">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.step}>Step 2 of 4</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Personalize your{`\n`}wake-up</Text>
          <Text style={styles.sub}>AI generates a new message every morning.</Text>

          <GlassCard style={{ marginTop: 10 }}>
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

          <Text style={[styles.sectionLabel, { marginTop: 18 }]}>QUICK EXAMPLES</Text>
          <View style={{ gap: 10 }}>
            {examples.map((e, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => setReason(e.text)}>
                <GlassCard style={styles.exampleCard}>
                  <View style={styles.exampleIconWrap}>
                    <Text style={styles.exampleIcon}>{e.icon}</Text>
                  </View>
                  <Text style={styles.exampleText}>{e.text}</Text>
                  <Text style={styles.exampleChevron}>›</Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>AI personality</Text>
          <View style={styles.grid}>
            {personalities.map((p) => {
              const active = selectedPersonality === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedPersonality(p.id)}
                  style={[styles.cardPick, active && styles.cardPickActive]}
                >
                  <Text style={styles.pickIcon}>{p.icon}</Text>
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
                  style={[styles.cardPick, active && styles.cardPickActive]}
                >
                  <Text style={styles.pickIcon}>{g.icon}</Text>
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
                  style={[styles.cardPick, active && styles.cardPickActive]}
                >
                  <Text style={styles.pickIcon}>⏱</Text>
                  <Text style={styles.pickTitle}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setIsCustomInterval(true)}
              style={[styles.cardPick, isCustomInterval && styles.cardPickActive]}
            >
              <Text style={styles.pickIcon}>✏️</Text>
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
              {getCustomHelperText() && (
                <Text style={styles.helperText}>{getCustomHelperText()}</Text>
              )}
            </GlassCard>
          )}

          <Text style={styles.intervalNote}>
            Minimum 3 minutes. For demo the app uses a shorter internal timer.
          </Text>

          {(userName || reason) && (
            <GlassCard style={{ marginTop: 18 }}>
              <Text style={styles.label}>Sample AI message</Text>
              <Text style={styles.preview}>{preview}</Text>
              <Text style={styles.previewNote}>✨ New variations every morning</Text>
            </GlassCard>
          )}

          <View style={{ height: 90 }} />
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!canContinue}
          style={[styles.cta, !canContinue && { opacity: 0.55 }]}
          onPress={() => {
            if (!canContinue) return;
            const intervalSeconds = getEffectiveIntervalMinutes() * 60;
            console.log("intervalSeconds ->", intervalSeconds);
            navigation.navigate("ProofMethod", {
              ...route.params,
              userName,
              reason,
              musicGenre: selectedGenre,
              aiPersonality: selectedPersonality,
              intervalSeconds,
              round: 1,
            });
          }}
        >
          <Text style={styles.ctaText}>Next</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  back: { color: theme.colors.text, fontSize: 30, fontWeight: "700" },
  step: { color: theme.colors.textFaint, fontWeight: "800" },

  content: { paddingBottom: 20 },
  h1: { color: theme.colors.text, fontSize: 40, fontWeight: "900", letterSpacing: -1, lineHeight: 46 },
  sub: { color: theme.colors.textMuted, fontWeight: "700", marginTop: 10 },

  label: { color: theme.colors.textFaint, fontWeight: "900", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 },

  sectionLabel: {
    color: theme.colors.textFaint,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 12,
    marginBottom: 12,
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

  exampleCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  exampleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  exampleIcon: { fontSize: 18 },
  exampleText: {
    color: theme.colors.text,
    fontWeight: "800",
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  exampleChevron: {
    color: theme.colors.textFaint,
    fontSize: 24,
    fontWeight: "300",
    marginLeft: 8,
  },

  sectionTitle: { color: theme.colors.text, fontWeight: "900", fontSize: 18 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },

  cardPick: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: theme.radius.xl,
    padding: 14,
    alignItems: "center",
  },
  cardPickActive: { backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.30)" },
  pickIcon: { fontSize: 28, marginBottom: 8 },
  pickTitle: { color: theme.colors.text, fontWeight: "900" },
  pickDesc: { color: theme.colors.textFaint, fontWeight: "700", fontSize: 12, marginTop: 4 },

  preview: { color: theme.colors.text, fontWeight: "800", fontStyle: "italic", lineHeight: 22, marginTop: 6 },
  previewNote: { color: theme.colors.textFaint, fontWeight: "700", marginTop: 10 },

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
});