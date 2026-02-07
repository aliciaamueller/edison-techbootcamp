// screens/AlarmRingingScreen.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from "react-native";
import { Image } from "expo-image";
import * as Speech from "expo-speech";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";

import { startRinging, stopRinging } from "../services/alarmEngine";
import { setAlarmVolume } from "../services/soundManager";

export default function AlarmRingingScreen({ navigation, route }) {
  const params = route?.params || {};
  const {
    round = 1,
    userName = "you",
    reason = "your goals",
    aiPersonality = "motivational",
    musicGenre = "energetic",
  } = params;

  const [volumeLabel, setVolumeLabel] = useState(100);

  const loopTimerRef = useRef(null);
  const isArmedRef = useRef(true);

  const headline = round === 1 ? "WAKE\nUP" : round === 2 ? "STAY\nUP" : "FINAL\nCHECK";
  const roundLabel = `ROUND ${round} OF 3`;

  // Full “AI” sentence (spoken)
  const spokenMessage = useMemo(() => {
    const name = userName?.trim() ? userName.trim() : "you";
    const why = reason?.trim() ? reason.trim() : "your goals";

    if (aiPersonality === "sassy") {
      return `Alright ${name}. Enough. Time to stop negotiating with your pillow and get up for ${why}.`;
    }
    if (aiPersonality === "drill-sergeant") {
      return `UP NOW ${name}! You said ${why}. MOVE. PROVE YOU'RE AWAKE.`;
    }
    if (aiPersonality === "zen") {
      return `Good morning ${name}. Today brings ${why}. Breathe once. Stand up. Begin.`;
    }
    return `Good morning ${name}! Let's crush ${why} today.`;
  }, [aiPersonality, userName, reason]);

  // Short UI message only (what you asked for)
  const shortReason = useMemo(() => {
    const r = (reason || "").trim();
    if (!r) return "Wake up";

    // Keep it short: first clause + max 6 words
    const first = r.split(/[.!?\n]/)[0].trim();
    const words = first.split(/\s+/).filter(Boolean);
    const sliced = words.slice(0, 6).join(" ");
    return words.length > 6 ? `${sliced}…` : sliced;
  }, [reason]);

  const eddyImage =
    round === 1
      ? require("../assets/eddy/eddy-sleepy.png")
      : round === 2
      ? require("../assets/eddy/eddy-running.png")
      : require("../assets/eddy/eddy-happy.png");

  const speakOnce = async () => {
    try {
      if (!isArmedRef.current) return;

      // Don’t stack speech over itself
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) return;

      Speech.speak(spokenMessage, { rate: 0.95, pitch: 1.0 });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    isArmedRef.current = true;

    // Start looping alarm sound bed (your alarmEngine should loop)
    startRinging({ musicGenre });

    // Start vibration loop
    Vibration.vibrate([0, 900, 500, 900, 500], true);

    // Speak immediately, then loop every ~9s
    Speech.stop();
    speakOnce();

    loopTimerRef.current = setInterval(() => {
      speakOnce();
    }, 9000);

    return () => {
      isArmedRef.current = false;
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);

      stopRinging();
      Speech.stop();
      Vibration.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicGenre, spokenMessage]);

  const goToChallenge = () => {
    // IMPORTANT: stop everything the moment they press the button
    isArmedRef.current = false;
    if (loopTimerRef.current) clearInterval(loopTimerRef.current);

    stopRinging();
    Speech.stop();
    Vibration.cancel();

    navigation.navigate("ProofTask", { ...params, round });
  };

  // optional helpers if you still want volume controls later
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

          <Text style={styles.oneLine}>
            Eddy is sleepy too — <Text style={styles.oneLineMuted}>help him light up 💡</Text>
          </Text>

          <View style={styles.roundPill}>
            <Text style={styles.roundText}>{roundLabel}</Text>
          </View>

          <Text style={styles.big}>{headline}</Text>

          <GlassCard style={styles.reasonCard}>
            <Text style={styles.reasonLabel}>Today</Text>
            <Text style={styles.reasonText}>{shortReason}</Text>
          </GlassCard>

          <Text style={styles.volTiny}>Volume: {volumeLabel}%</Text>

          {/* If you want the buttons back later, uncomment:
          <View style={styles.volRow}>
            <TouchableOpacity activeOpacity={0.9} style={styles.volBtn} onPress={setLow}>
              <Text style={styles.volBtnText}>Lower volume</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.volBtn} onPress={setFull}>
              <Text style={styles.volBtnText}>Full volume</Text>
            </TouchableOpacity>
          </View>
          */}
        </View>

        <TouchableOpacity activeOpacity={0.92} style={styles.cta} onPress={goToChallenge}>
          <Text style={styles.ctaText}>START CHALLENGE</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingBottom: 120, // reserve so nothing can ever sit behind CTA
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.space.xl,
    gap: 12,
  },
  eddy: {
    width: 160,
    height: 160,
    marginBottom: 6,
  },
  oneLine: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  oneLineMuted: {
    color: theme.colors.textMuted,
    fontWeight: "900",
  },
  roundPill: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  roundText: {
    color: theme.colors.text,
    fontWeight: "900",
    letterSpacing: 1.2,
    fontSize: 12,
  },
  big: {
    color: theme.colors.text,
    fontSize: 64,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 2,
    lineHeight: 66,
    marginTop: 6,
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 14,
  },
  reasonCard: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },
  reasonLabel: {
    color: theme.colors.textFaint,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  reasonText: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 22,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  volTiny: {
    color: theme.colors.textFaint,
    fontWeight: "800",
    fontSize: 13,
    marginTop: 4,
  },
  cta: {
    position: "absolute",
    left: theme.space.xl,
    right: theme.space.xl,
    bottom: 28,
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
  ctaText: {
    color: "#111",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1.2,
  },
  ctaArrow: {
    color: "#111",
    fontSize: 22,
    fontWeight: "900",
  },

  // (kept for later if you re-enable buttons)
  volRow: { flexDirection: "row", gap: 12, width: "100%", marginTop: 4 },
  volBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
  },
  volBtnText: { color: theme.colors.text, fontWeight: "900" },
});
