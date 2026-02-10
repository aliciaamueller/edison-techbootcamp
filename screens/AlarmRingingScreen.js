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

// ─────────────────────────────────────────────────────────────
// AI MESSAGE TEMPLATES
// ─────────────────────────────────────────────────────────────

const MESSAGE_TEMPLATES = {
  motivational: [
    (name, why) => `Good morning ${name}! Let's crush ${why} today.`,
    (name, why) => `Rise and shine ${name}! ${why} isn't going to handle itself. You've got this.`,
    (name, why) => `Hey ${name}, today is YOUR day. Get up and own ${why}.`,
    (name, why) => `${name}, champions don't snooze. Time to show up for ${why}.`,
    (name, why) => `New day, new wins ${name}. ${why} starts the moment you stand up.`,
    (name, why) => `${name}, you didn't set this alarm for nothing. ${why} is waiting. Let's go.`,
    (name, why) => `Good morning ${name}! Every great day starts with one brave move. Get up for ${why}.`,
    (name, why) => `${name}, your future self will thank you. Time to tackle ${why}.`,
    (name, why) => `The world needs you awake ${name}. Get up, show up, and crush ${why}.`,
    (name, why) => `${name}, comfort zone or ${why}? You already know the answer. UP.`,
  ],
  sassy: [
    (name, why) => `Alright ${name}. Enough. Time to stop negotiating with your pillow and get up for ${why}.`,
    (name, why) => `${name}, your bed doesn't pay your bills. Get up. ${why} does.`,
    (name, why) => `Oh, still horizontal ${name}? Cute. ${why} isn't going to do itself.`,
    (name, why) => `${name}, the snooze button is not your friend. Neither is missing ${why}.`,
    (name, why) => `Listen ${name}, your pillow doesn't love you. But ${why}? That actually matters.`,
    (name, why) => `${name}, I will literally not stop until you get up. So let's skip to ${why}.`,
    (name, why) => `Sleeping beauty called, ${name}. Even they got up eventually. ${why} awaits.`,
    (name, why) => `${name}, you set me for a reason. Remember? ${why}. Now MOVE.`,
    (name, why) => `Plot twist ${name}: the alarm wins. Get up for ${why} or I get louder.`,
    (name, why) => `${name}, every minute in bed is a minute stolen from ${why}. Your call.`,
  ],
  "drill-sergeant": [
    (name, why) => `UP NOW ${name}! You said ${why}. MOVE. PROVE YOU'RE AWAKE.`,
    (name, why) => `${name}! On your feet IMMEDIATELY. ${why} doesn't wait for sleepers.`,
    (name, why) => `ZERO EXCUSES ${name}. You committed to ${why}. NOW EXECUTE.`,
    (name, why) => `${name}, this is not a drill. Actually it IS a drill. GET UP. ${why}. NOW.`,
    (name, why) => `I don't care how tired you are ${name}. ${why} is the mission. MOVE IT.`,
    (name, why) => `${name}! Feet on the floor in 3, 2, 1. ${why} is not optional today.`,
    (name, why) => `ATTENTION ${name}! You signed up for ${why}. No one forced you. NOW GO.`,
    (name, why) => `${name}, discipline beats motivation every single morning. UP for ${why}.`,
    (name, why) => `Your bed is the enemy ${name}. ${why} is the objective. ENGAGE.`,
    (name, why) => `${name}! Sleep is over. ${why} starts NOW. Do NOT make me repeat myself.`,
  ],
  zen: [
    (name, why) => `Good morning ${name}. Today brings ${why}. Breathe once. Stand up. Begin.`,
    (name, why) => `${name}, a new day unfolds gently. ${why} awaits your calm presence.`,
    (name, why) => `Breathe in ${name}. Breathe out. Now rise softly and greet ${why}.`,
    (name, why) => `${name}, the morning light is here. Let ${why} guide your first steps today.`,
    (name, why) => `Stillness was beautiful ${name}. Now, with intention, move toward ${why}.`,
    (name, why) => `${name}, your body rested. Your mind is ready. ${why} begins with one breath.`,
    (name, why) => `Gently now ${name}. The world is quiet and ${why} is yours to embrace.`,
    (name, why) => `${name}, each morning is a small rebirth. Today's purpose: ${why}. Rise.`,
    (name, why) => `The silence holds space for you ${name}. Carry it with you into ${why}.`,
    (name, why) => `${name}, you are awake. You are here. ${why} flows naturally from this moment.`,
  ],
};

function pickRandomMessage(personality, name, why) {
  const templates = MESSAGE_TEMPLATES[personality] || MESSAGE_TEMPLATES.motivational;
  const index = Math.floor(Math.random() * templates.length);
  return templates[index](name, why);
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

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

  const headline = round === 1 ? "WAKE\nUP" : round === 2 ? "STAY\nUP" : "FINAL\nCHECK";
  const roundLabel = `ROUND ${round} OF 3`;

  const name = userName?.trim() ? userName.trim() : "you";
  const why = reason?.trim() ? reason.trim() : "your goals";

  // Pick a random message once per round
  const spokenMessage = useMemo(() => {
    return pickRandomMessage(aiPersonality, name, why);
  }, [aiPersonality, name, why, round]);

  // ✅ FIXED: Show reason properly — don't split on "." (broke "8 a.m.")
  // Just trim to max ~8 words for display
  const shortReason = useMemo(() => {
    const r = (reason || "").trim();
    if (!r) return "Wake up";
    const words = r.split(/\s+/).filter(Boolean);
    const sliced = words.slice(0, 8).join(" ");
    return words.length > 8 ? `${sliced}…` : sliced;
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
    Vibration.vibrate([0, 900, 500, 900, 500], true);

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

          <Text style={styles.oneLine}>
            Eddy is sleepy too — <Text style={styles.oneLineMuted}>help him light up 💡</Text>
          </Text>

          <View style={styles.roundPill}>
            <Text style={styles.roundText}>{roundLabel}</Text>
          </View>

          <Text style={styles.big}>{headline}</Text>

          <GlassCard style={styles.reasonCard}>
            {/* ✅ FIXED: Show the wake-up time if available */}
            {time ? (
              <Text style={styles.reasonLabel}>⏰ {time}</Text>
            ) : (
              <Text style={styles.reasonLabel}>TODAY</Text>
            )}
            <Text style={styles.reasonText}>{shortReason}</Text>
          </GlassCard>

          <Text style={styles.volTiny}>Volume: {volumeLabel}%</Text>
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
    paddingBottom: 120,
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
    fontSize: 13,
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