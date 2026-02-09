// screens/ProofTaskScreen.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Vibration, Alert, Animated } from "react-native";
import { Pedometer } from "expo-sensors";
import * as Speech from "expo-speech";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";
import { stopRinging } from "../services/alarmEngine";

export default function ProofTaskScreen({ navigation, route }) {
  const params = route?.params || {};
  const { round = 1, proofMethod = "steps", demoMode = false, demoRequiredSteps = [] } = params;

  // ---- TASK CONFIG
  // In demo mode, use demoRequiredSteps[round-1], otherwise use round-based progression
  const TARGET_STEPS = useMemo(() => {
    if (demoMode && demoRequiredSteps.length > 0) {
      const index = round - 1;
      return demoRequiredSteps[index] ?? 30; // Fallback to 30 if index out of bounds
    }
    // Original behavior: round 1 → 30, round 2 → 15, round 3 → 5
    if (round === 1) return 30;
    if (round === 2) return 15;
    if (round === 3) return 5;
    return 30; // Fallback for unexpected rounds
  }, [demoMode, demoRequiredSteps, round]);

  // ---- STATE
  const [isAvailable, setIsAvailable] = useState(null); // null | true | false
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState("Counting steps…");
  const [fallbackReady, setFallbackReady] = useState(false);

  // ---- ANIMATION VALUES
  const runAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const pedometerSubRef = useRef(null);
  const baseRef = useRef(0);
  const finishedRef = useRef(false);

  // Short title depending on proof method (future-proof)
  const taskTitle = useMemo(() => {
    if (proofMethod === "steps") return `Walk ${TARGET_STEPS} steps`;
    return "Complete the challenge";
  }, [proofMethod, TARGET_STEPS]);

  // ---- ALWAYS SILENCE ALARM AUDIO/SPEECH/VIBRATION ON THIS SCREEN
  useEffect(() => {
    stopRinging();
    Speech.stop();
    Vibration.cancel();
  }, []);

  // ---- CONTINUOUS LOOP ANIMATION (runs once on mount)
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(runAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(runAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [runAnim]);

  // ---- PEDOMETER
  useEffect(() => {
    let fallbackTimer;

    const start = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(available);

        if (!available) {
          setStatus("Step counting not available on this device.");
          // fallback: allow completion after a short “up time”
          fallbackTimer = setTimeout(() => setFallbackReady(true), 3500);
          return;
        }

        setStatus("Start walking now.");
        baseRef.current = 0;
        setSteps(0);

        // Prime base using a short historical query (prevents jumping)
        // Note: Pedometer.getStepCountAsync uses date range; not supported on all Android devices.
        if (Platform.OS !== "android") {
          try {
            const end = new Date();
            const startDate = new Date(end.getTime() - 60 * 1000); // last 60s
            const res = await Pedometer.getStepCountAsync(startDate, end);
            baseRef.current = res?.steps ?? 0;
          } catch {
            baseRef.current = 0;
          }
        }

        pedometerSubRef.current = Pedometer.watchStepCount((result) => {
          // On iOS this is session-based; on Android it may be since boot depending on device.
          // Using baseRef makes it behave like a “session challenge” when possible.
          const raw = result?.steps ?? 0;
          const normalized = Math.max(0, raw - baseRef.current);

          setSteps(normalized);
        });
      } catch (e) {
        setIsAvailable(false);
        setStatus("Couldn’t start step tracking.");
        fallbackTimer = setTimeout(() => setFallbackReady(true), 3500);
      }
    };

    start();

    return () => {
      if (pedometerSubRef.current) {
        pedometerSubRef.current.remove();
        pedometerSubRef.current = null;
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- PROGRESS ANIMATION & NAVIGATION (responds to steps changes)
  useEffect(() => {
    const progress = Math.min(1, steps / TARGET_STEPS);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false, // width animation requires false
    }).start();

    // Navigate when target reached
    if (steps >= TARGET_STEPS && !finishedRef.current) {
      finishedRef.current = true;
      onComplete();
    }
  }, [steps, progressAnim, TARGET_STEPS]);

  const onComplete = () => {
    // ensure silence (again)
    stopRinging();
    Speech.stop();
    Vibration.cancel();

    // Navigate based on round
    if (round >= 3) {
      navigation.navigate("Success");
    } else {
      navigation.navigate("RoundComplete", { ...params, round });
    }
  };

  const onFallbackConfirm = () => {
    Alert.alert(
      "Confirm",
      "Are you up and moving?",
      [
        { text: "Not yet", style: "cancel" },
        { text: "Yes", onPress: onComplete },
      ],
      { cancelable: true }
    );
  };

  const progress = Math.min(1, steps / TARGET_STEPS);
  const progressPct = Math.round(progress * 100);

  return (
    <ScreenShell variant="alarm">
      <View style={styles.wrap}>
        <View style={styles.center}>
          <Text style={styles.kicker}>PROOF TASK</Text>
          <Text style={styles.title}>{taskTitle}</Text>

          <GlassCard style={styles.card}>
            <Text style={styles.bigNumber}>
              {isAvailable ? `${steps}/${TARGET_STEPS}` : "—"}
            </Text>
            <Text style={styles.sub}>
              {isAvailable ? `${progressPct}% complete` : status}
            </Text>

            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>

            <Text style={styles.helper}>{status}</Text>
          </GlassCard>

          {/* Fallback if pedometer not available */}
          {isAvailable === false && (
            <GlassCard style={styles.fallbackCard}>
              <Text style={styles.fallbackTitle}>No step counter detected</Text>
              <Text style={styles.fallbackText}>
                Some devices can’t count steps in Expo Go. You can still continue after a short check.
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.fallbackBtn, !fallbackReady && { opacity: 0.5 }]}
                disabled={!fallbackReady}
                onPress={onFallbackConfirm}
              >
                <Text style={styles.fallbackBtnText}>
                  {fallbackReady ? "I’m up" : "Preparing…"}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          )}
        </View>

        {/* Manual “I did it” button if you want (hidden by default when pedometer works) */}
        {isAvailable === true && (
          <TouchableOpacity
            activeOpacity={0.92}
            style={[styles.cta, steps < TARGET_STEPS && { opacity: 0.35 }]}
            disabled={steps < TARGET_STEPS}
            onPress={onComplete}
          >
            <Text style={styles.ctaText}>COMPLETE</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingBottom: 110,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.space.xl,
    gap: 12,
  },
  kicker: {
    color: theme.colors.textFaint,
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  card: {
    width: "100%",
    paddingVertical: 18,
    alignItems: "center",
  },
  bigNumber: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 46,
    letterSpacing: -1.2,
  },
  sub: {
    color: theme.colors.textMuted,
    fontWeight: "800",
    fontSize: 14,
    marginTop: 2,
    marginBottom: 14,
  },
  progressTrack: {
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  helper: {
    marginTop: 12,
    color: theme.colors.textFaint,
    fontWeight: "800",
    fontSize: 13,
    textAlign: "center",
  },
  fallbackCard: {
    width: "100%",
    marginTop: 10,
    paddingVertical: 16,
  },
  fallbackTitle: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 6,
    textAlign: "center",
  },
  fallbackText: {
    color: theme.colors.textMuted,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 12,
  },
  fallbackBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  fallbackBtnText: {
    color: "#111",
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  cta: {
    position: "absolute",
    left: theme.space.xl,
    right: theme.space.xl,
    bottom: 26,
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
});
