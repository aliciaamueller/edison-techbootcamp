// screens/AlarmRingingScreen.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import * as Speech from "expo-speech";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

import { startRinging } from "../services/alarmEngine";
import { setAlarmVolume } from "../services/soundManager";

const MESSAGE_TEMPLATES = {
  motivational: [
    (name, why) => `Good morning ${name}! Let's crush ${why} today.`,
    (name, why) => `Rise and shine ${name}! ${why} isn't going to handle itself. You've got this.`,
    (name, why) => `Hey ${name}, today is YOUR day. Get up and own ${why}.`,
    (name, why) => `${name}, champions don't snooze. Time to show up for ${why}.`,
  ],
  sassy: [
    (name, why) => `Alright ${name}. Enough. Get up for ${why}.`,
    (name, why) => `${name}, your bed doesn't pay your bills. ${why} does.`,
    (name, why) => `Still horizontal ${name}? Cute. ${why} isn't going to do itself.`,
  ],
  "drill-sergeant": [
    (name, why) => `UP NOW ${name}! Mission: ${why}. MOVE.`,
    (name, why) => `${name}! On your feet immediately. ${why} doesn't wait.`,
  ],
  zen: [
    (name, why) => `Good morning ${name}. Breathe once. Stand up. Begin: ${why}.`,
    (name, why) => `${name}, a new day unfolds gently. ${why} awaits your calm presence.`,
  ],
};

function pickRandomMessage(personality, name, why) {
  const templates = MESSAGE_TEMPLATES[personality] || MESSAGE_TEMPLATES.motivational;
  const index = Math.floor(Math.random() * templates.length);
  return templates[index](name, why);
}

export default function AlarmRingingScreen({ navigation, route }) {
  const params = route?.params || {};
  const {
    round = 1,
    userName = "you",
    reason = "your goals",
    time = "",
    aiPersonality = "motivational",
    musicGenre = "energetic",
  } = params;

  const [volumeLabel, setVolumeLabel] = useState(100);
  const loopTimerRef = useRef(null);
  const isArmedRef = useRef(true);

  const headline = round === 1 ? "Wake up!" : round === 2 ? "Stay up." : "Final check.";
  const roundLabel = `ROUND ${round}/3`;

  const name = userName?.trim() ? userName.trim() : "you";
  const why = reason?.trim() ? reason.trim() : "your goals";

  const spokenMessage = useMemo(() => {
    return pickRandomMessage(aiPersonality, name, why);
  }, [aiPersonality, name, why, round]);

  const displayReason = useMemo(() => {
    const r = (reason || "").trim();
    if (!r) return "Wake up";
    return r;
  }, [reason]);

  const eddyImage =
    round === 1
      ? require("../assets/eddy/eddy-sleepy.png")
      : round === 2
      ? require("../assets/eddy/eddy-running.png")
      : require("../assets/eddy/eddy-happy.png");

  const displayTime = useMemo(() => {
    if (time) return time;
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }, [time]);

  const speakOnce = async () => {
    try {
      if (!isArmedRef.current) return;
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) return;
      Speech.speak(spokenMessage, { rate: 0.95, pitch: 1.0 });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    isArmedRef.current = true;

    startRinging({ musicGenre });

    Speech.stop();
    speakOnce();

    loopTimerRef.current = setInterval(() => {
      speakOnce();
    }, 9000);

    return () => {
      isArmedRef.current = false;
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicGenre, spokenMessage]);

  const goToChallenge = () => {
    isArmedRef.current = false;
    if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    Speech.stop();
    navigation.navigate("ProofTask", { ...params, round, keepRinging: true });
  };

  const setLow = async () => {
    await setAlarmVolume(0.3);
    setVolumeLabel(30);
  };
  const setFull = async () => {
    await setAlarmVolume(1.0);
    setVolumeLabel(100);
  };

  return (
    <ScreenShell variant="alarm">
      <View style={styles.wrap}>
        <View style={styles.center}>
          <Image source={eddyImage} style={styles.eddy} contentFit="contain" />

          <View style={styles.roundPill}>
            <Text style={styles.roundText}>{roundLabel}</Text>
          </View>

          <Text style={styles.headline}>{headline}</Text>

          <GlassCard style={styles.reasonCard}>
            <Text style={styles.timeLabel}>{displayTime}</Text>
            <Text style={styles.reasonText}>{displayReason}</Text>
          </GlassCard>

          <View style={styles.volRow}>
            <TouchableOpacity
              style={[styles.volBtn, volumeLabel === 30 && styles.volBtnActive]}
              onPress={setLow}
              activeOpacity={0.8}
            >
              <Text style={styles.volBtnText}>30%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.volBtn, volumeLabel === 100 && styles.volBtnActive]}
              onPress={setFull}
              activeOpacity={0.8}
            >
              <Text style={styles.volBtnText}>100%</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.voiceInfo}>Voice: English • Volume: {volumeLabel}%</Text>
        </View>

        <TouchableOpacity activeOpacity={0.92} style={styles.cta} onPress={goToChallenge}>
          <Text style={styles.ctaText}>START CHALLENGE</Text>
          <Text style={styles.ctaArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingBottom: 14 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.space.xl,
    gap: 10,
  },
  eddy: { width: 170, height: 170, marginBottom: 4 },

  roundPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  roundText: { color: theme.colors.text, fontWeight: "900", letterSpacing: 2, fontSize: 12 },

  headline: {
    color: theme.colors.text,
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
  },

  reasonCard: { width: "100%", paddingVertical: 18, paddingHorizontal: 20 },
  timeLabel: {
    color: theme.colors.textFaint,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  reasonText: { color: theme.colors.text, fontWeight: "900", fontSize: 22, lineHeight: 30 },

  volRow: { flexDirection: "row", gap: 12, width: "100%", marginTop: 6 },
  volBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
  },
  volBtnActive: { backgroundColor: "rgba(255,255,255,0.16)", borderColor: "rgba(255,255,255,0.30)" },
  volBtnText: { color: theme.colors.text, fontWeight: "900", fontSize: 15 },

  voiceInfo: { color: theme.colors.textFaint, fontWeight: "700", fontSize: 13, marginTop: 2 },

  cta: {
    marginHorizontal: 4,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  ctaText: { color: "#111", fontWeight: "900", fontSize: 18, letterSpacing: 1.2 },
  ctaArrow: { color: "#111", fontSize: 24, fontWeight: "900" },
});
