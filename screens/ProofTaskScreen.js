// screens/ProofTaskScreen.js
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Vibration,
  Alert,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Pedometer } from "expo-sensors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as Speech from "expo-speech";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";
import { startRinging, stopRinging } from "../services/alarmEngine";
import { setAlarmVolume } from "../services/soundManager";

// ─────────────────────────────────────────────────────────────
// EDDY REACTIONS
// ─────────────────────────────────────────────────────────────

const EDDY_REACTIONS = {
  start: [
    "Eddy is watching… 👀",
    "Let's go! Eddy believes in you 💡",
    "Prove to Eddy you're awake!",
    "Eddy's lightbulb needs YOUR brainpower 🧠",
  ],
  correct: [
    "Nice one! 🔥",
    "Eddy's impressed! 💡",
    "Big brain energy! 🧠",
    "Boom! Keep going! ⚡",
    "That's the one! 🎯",
    "You're waking up! 🌅",
  ],
  wrong: [
    "Nope! Try again 😴",
    "Still sleepy? Focus! 👀",
    "Eddy says no… try again!",
    "Almost! One more shot 💪",
  ],
  complete: [
    "Eddy's lightbulb is glowing! 💡✨",
    "Brain = ON. Nice work! 🧠⚡",
    "You crushed it! Eddy approves 🎉",
  ],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────────────────
// LOCAL CHALLENGE POOLS (fallback if AI fails)
// ─────────────────────────────────────────────────────────────

const REVERSE_WORDS_POOL = [
  "MORNING", "SUNRISE", "BLANKET", "PILLOW", "COFFEE", "ENERGY",
  "KITCHEN", "SHOWER", "AWAKE", "THUNDER", "WARRIOR", "ROCKET",
  "FROZEN", "PLANET", "WINDOW", "SUNSET", "BRIDGE", "FOREST",
  "GUITAR", "DRAGON", "SILVER", "MARKET", "CASTLE", "LAPTOP",
  "TROPHY", "BUTTER", "PEPPER", "VIOLET", "GARDEN", "WINTER",
  "SUMMER", "SPRING", "AUTUMN", "BREEZE", "CANDLE", "TEMPLE",
  "ORANGE", "MEADOW", "ANCHOR", "BARREL", "VELVET", "OXYGEN",
  "MARBLE", "FALCON", "BISCUIT", "PENGUIN", "COMPASS", "VOLCANO",
  "JOURNEY", "MYSTERY", "RAINBOW", "DIAMOND", "FEATHER", "CRYSTAL",
  "ORIGAMI", "HARVEST", "LANTERN", "WHISTLE", "THUNDER", "LIBERTY",
];

const MATH_PROBLEMS_POOL = [
  { q: "13 × 7", a: 91 }, { q: "8 × 14", a: 112 }, { q: "17 × 6", a: 102 },
  { q: "9 × 16", a: 144 }, { q: "23 × 4", a: 92 }, { q: "15 × 8", a: 120 },
  { q: "12 × 9", a: 108 }, { q: "19 × 5", a: 95 }, { q: "7 × 18", a: 126 },
  { q: "11 × 13", a: 143 }, { q: "24 × 3", a: 72 }, { q: "6 × 22", a: 132 },
  { q: "14 × 7", a: 98 }, { q: "16 × 6", a: 96 }, { q: "25 × 4", a: 100 },
  { q: "48 + 37 − 15", a: 70 }, { q: "63 − 28 + 14", a: 49 },
  { q: "27 + 45 − 33", a: 39 }, { q: "56 − 19 + 28", a: 65 },
  { q: "34 + 29 − 17", a: 46 }, { q: "72 − 35 + 18", a: 55 },
  { q: "41 + 38 − 24", a: 55 }, { q: "89 − 47 + 13", a: 55 },
  { q: "53 + 26 − 38", a: 41 }, { q: "67 − 29 + 15", a: 53 },
];

const SPEED_TYPE_POOL = [
  "the early bird catches the worm",
  "rise and shine champion",
  "no more excuses get up now",
  "today is going to be great",
  "wake up and chase your dreams",
  "coffee is calling your name",
  "the alarm wins every time",
  "prove to eddy you are awake",
  "five more minutes is a lie",
  "your bed is not your friend",
  "champions never hit snooze",
  "make today count starting now",
  "good morning beautiful human",
  "step one get out of bed",
  "energy flows where focus goes",
  "the world is waiting for you",
  "time to shine bright like eddy",
  "no snooze means you win",
  "your future self says thank you",
  "brains on blankets off lets go",
];

// Track used challenges to avoid repeats within a session
const usedChallenges = { reverse: new Set(), math: new Set(), typing: new Set() };

// ─────────────────────────────────────────────────────────────
// AI CHALLENGE GENERATOR (with local fallback)
// ─────────────────────────────────────────────────────────────

async function fetchAIChallenge(type) {
  try {
    const prompts = {
      reverse: "Generate ONE random English word (6-8 letters, common noun or adjective, NOT a proper noun). Reply with ONLY the word in uppercase, nothing else.",
      math: 'Generate ONE math problem using multiplication or multi-step addition/subtraction with 2-digit numbers. Reply with ONLY a JSON object like {"q":"13 × 7","a":91} and nothing else.',
      typing: "Generate ONE short motivational sentence (5-7 words, lowercase, no punctuation except spaces). Make it fun and related to waking up. Reply with ONLY the sentence, nothing else.",
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 100,
        messages: [{ role: "user", content: prompts[type] }],
      }),
    });

    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    const text = data.content?.[0]?.text?.trim();
    if (!text) throw new Error("Empty response");

    if (type === "reverse") {
      const word = text.toUpperCase().replace(/[^A-Z]/g, "");
      if (word.length >= 4 && word.length <= 10) return { word };
    }
    if (type === "math") {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.q && parsed.a !== undefined) return parsed;
    }
    if (type === "typing") {
      const sentence = text.toLowerCase().replace(/[^a-z ]/g, "").trim();
      if (sentence.split(" ").length >= 3) return { sentence };
    }

    throw new Error("Invalid format");
  } catch {
    return null;
  }
}

function getLocalChallenge(type) {
  if (type === "reverse") {
    const unused = REVERSE_WORDS_POOL.filter((w) => !usedChallenges.reverse.has(w));
    const pool = unused.length > 0 ? unused : REVERSE_WORDS_POOL;
    const word = pickRandom(pool);
    usedChallenges.reverse.add(word);
    return { word };
  }
  if (type === "math") {
    const unused = MATH_PROBLEMS_POOL.filter((p) => !usedChallenges.math.has(p.q));
    const pool = unused.length > 0 ? unused : MATH_PROBLEMS_POOL;
    const pick = pickRandom(pool);
    usedChallenges.math.add(pick.q);
    return pick;
  }
  if (type === "typing") {
    const unused = SPEED_TYPE_POOL.filter((s) => !usedChallenges.typing.has(s));
    const pool = unused.length > 0 ? unused : SPEED_TYPE_POOL;
    const sentence = pickRandom(pool);
    usedChallenges.typing.add(sentence);
    return { sentence };
  }
}

async function generateChallenge(type) {
  const aiResult = await fetchAIChallenge(type);
  if (aiResult) return aiResult;
  return getLocalChallenge(type);
}

function generateTaskSequence() {
  const types = ["reverse", "math", "typing"];
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  return types;
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function ProofTaskScreen({ navigation, route }) {
  const params = route?.params || {};
  const {
    round = 1,
    proofMethod = "steps",
    demoMode = false,
    demoRequiredSteps = [],
    musicGenre = "energetic",
    keepRinging = false,
  } = params;

  const finishedRef = useRef(false);

  const onComplete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    stopRinging();
    Speech.stop();
    Vibration.cancel();

    if (round >= 3) {
      navigation.navigate("Success");
    } else {
      navigation.navigate("RoundComplete", { ...params, round });
    }
  }, [round, params, navigation]);

  useEffect(() => {
    // If we came from AlarmRinging (keepRinging=true), just duck the volume.
    // Otherwise (debug/direct load), start ringing.
    if (keepRinging) {
      setAlarmVolume(0.5);
    } else {
      startRinging({ musicGenre });
    }

    Vibration.vibrate([0, 900, 500, 900, 500], true);

    return () => {
      // Don't stop ringing on unmount!
      // Only stop if onComplete triggers it.
      // If we go back, volume should probably go back up, but AlarmRinging screen handles its own start.
      Speech.stop();
      Vibration.cancel();
    };
  }, [musicGenre, keepRinging]);

  if (proofMethod === "mental") {
    return <MentalChallenge round={round} onComplete={onComplete} />;
  }

  if (proofMethod === "camera") {
    return <CameraChallenge round={round} onComplete={onComplete} />;
  }

  return (
    <StepsChallenge
      round={round}
      demoMode={demoMode}
      demoRequiredSteps={demoRequiredSteps}
      onComplete={onComplete}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// STEPS CHALLENGE
// ═══════════════════════════════════════════════════════════════

function StepsChallenge({ round, demoMode, demoRequiredSteps, onComplete }) {
  const TARGET_STEPS = useMemo(() => {
    if (demoMode && demoRequiredSteps.length > 0) return demoRequiredSteps[round - 1] ?? 30;
    if (round === 1) return 30;
    if (round === 2) return 15;
    if (round === 3) return 5;
    return 30;
  }, [demoMode, demoRequiredSteps, round]);

  const [isAvailable, setIsAvailable] = useState(null);
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState("Counting steps…");
  const [fallbackReady, setFallbackReady] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pedometerSubRef = useRef(null);
  const baseRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    let fallbackTimer;
    const start = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(available);
        if (!available) {
          setStatus("Step counting not available on this device.");
          fallbackTimer = setTimeout(() => setFallbackReady(true), 3500);
          return;
        }
        setStatus("Start walking now.");
        baseRef.current = 0;
        setSteps(0);
        if (Platform.OS !== "android") {
          try {
            const end = new Date();
            const res = await Pedometer.getStepCountAsync(new Date(end.getTime() - 60000), end);
            baseRef.current = res?.steps ?? 0;
          } catch { baseRef.current = 0; }
        }
        pedometerSubRef.current = Pedometer.watchStepCount((result) => {
          setSteps(Math.max(0, (result?.steps ?? 0) - baseRef.current));
        });
      } catch {
        setIsAvailable(false);
        setStatus("Couldn't start step tracking.");
        fallbackTimer = setTimeout(() => setFallbackReady(true), 3500);
      }
    };
    start();
    return () => {
      if (pedometerSubRef.current) { pedometerSubRef.current.remove(); pedometerSubRef.current = null; }
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    const progress = Math.min(1, steps / TARGET_STEPS);
    Animated.timing(progressAnim, { toValue: progress, duration: 300, useNativeDriver: false }).start();
    if (steps >= TARGET_STEPS && !finishedRef.current) { finishedRef.current = true; onComplete(); }
  }, [steps, progressAnim, TARGET_STEPS, onComplete]);

  const onFallbackConfirm = () => {
    Alert.alert("Confirm", "Are you up and moving?", [
      { text: "Not yet", style: "cancel" },
      { text: "Yes", onPress: onComplete },
    ], { cancelable: true });
  };

  const progressPct = Math.round(Math.min(1, steps / TARGET_STEPS) * 100);

  return (
    <ScreenShell variant="alarm">
      <View style={styles.wrap}>
        <View style={styles.center}>
          <Text style={styles.kicker}>PROOF TASK</Text>
          <Text style={styles.title}>Walk {TARGET_STEPS} steps</Text>
          <GlassCard style={styles.card}>
            <Text style={styles.bigNumber}>{isAvailable ? `${steps}/${TARGET_STEPS}` : "—"}</Text>
            <Text style={styles.sub}>{isAvailable ? `${progressPct}% complete` : status}</Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} />
            </View>
            <Text style={styles.helper}>{status}</Text>
          </GlassCard>
          {isAvailable === false && (
            <GlassCard style={styles.fallbackCard}>
              <Text style={styles.fallbackTitle}>No step counter detected</Text>
              <Text style={styles.fallbackText}>Some devices can't count steps in Expo Go.</Text>
              <TouchableOpacity activeOpacity={0.9} style={[styles.fallbackBtn, !fallbackReady && { opacity: 0.5 }]} disabled={!fallbackReady} onPress={onFallbackConfirm}>
                <Text style={styles.fallbackBtnText}>{fallbackReady ? "I'm up" : "Preparing…"}</Text>
              </TouchableOpacity>
            </GlassCard>
          )}
        </View>
        {isAvailable === true && (
          <TouchableOpacity activeOpacity={0.92} style={[styles.cta, steps < TARGET_STEPS && { opacity: 0.35 }]} disabled={steps < TARGET_STEPS} onPress={onComplete}>
            <Text style={styles.ctaText}>COMPLETE</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENTAL CHALLENGE — 3 mini-games, randomized, Eddy-hosted
// ═══════════════════════════════════════════════════════════════

function MentalChallenge({ round, onComplete }) {
  const TOTAL_TASKS = 3;

  const [taskSequence] = useState(() => generateTaskSequence());
  const [taskIndex, setTaskIndex] = useState(0);
  const [challengeData, setChallengeData] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [eddyMessage, setEddyMessage] = useState(pickRandom(EDDY_REACTIONS.start));
  const [loading, setLoading] = useState(true);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  const currentType = taskSequence[taskIndex] || "math";

  // Load challenge data (AI or local)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setUserInput("");
    setFeedback(null);

    generateChallenge(currentType).then((data) => {
      if (!cancelled) {
        setChallengeData(data);
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    });

    return () => { cancelled = true; };
  }, [taskIndex, currentType]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const getCorrectAnswer = () => {
    if (!challengeData) return "";
    if (currentType === "reverse") return challengeData.word.split("").reverse().join("");
    if (currentType === "math") return String(challengeData.a);
    if (currentType === "typing") return challengeData.sentence;
    return "";
  };

  const checkUserAnswer = (input) => {
    const correct = getCorrectAnswer();
    const clean = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
    return clean(input) === clean(correct);
  };

  const handleSubmit = () => {
    if (!userInput.trim() || !challengeData) return;

    if (checkUserAnswer(userInput)) {
      setFeedback("correct");

      const nextIndex = taskIndex + 1;
      if (nextIndex >= TOTAL_TASKS) {
        setEddyMessage(pickRandom(EDDY_REACTIONS.complete));
        setTimeout(() => onComplete(), 800);
      } else {
        setEddyMessage(pickRandom(EDDY_REACTIONS.correct));
        setTimeout(() => {
          setTaskIndex(nextIndex);
        }, 700);
      }
    } else {
      setFeedback("wrong");
      setEddyMessage(pickRandom(EDDY_REACTIONS.wrong));
      triggerShake();
      setTimeout(() => {
        setUserInput("");
        setFeedback(null);
      }, 600);
    }
  };

  const typeConfig = {
    reverse: {
      icon: "🔄",
      label: "REVERSE IT",
      description: "Type this word backwards",
      getDisplay: (data) => data?.word || "...",
      placeholder: "Type backwards…",
      keyboardType: "default",
    },
    math: {
      icon: "🔢",
      label: "SOLVE IT",
      description: "What's the answer?",
      getDisplay: (data) => data ? `${data.q} = ?` : "...",
      placeholder: "Your answer…",
      keyboardType: "numeric",
    },
    typing: {
      icon: "⌨️",
      label: "TYPE IT",
      description: "Type this sentence exactly",
      getDisplay: (data) => data?.sentence ? `"${data.sentence}"` : "...",
      placeholder: "Type exactly…",
      keyboardType: "default",
    },
  };

  const config = typeConfig[currentType] || typeConfig.math;
  const progress = (taskIndex + (feedback === "correct" ? 1 : 0)) / TOTAL_TASKS;
  const progressPct = Math.round(progress * 100);

  return (
    <ScreenShell variant="alarm">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.wrap}>
            <View style={styles.center}>

              {/* Eddy + reaction */}
              <Image
                source={
                  feedback === "correct"
                    ? require("../assets/eddy/eddy-happy.png")
                    : feedback === "wrong"
                      ? require("../assets/eddy/eddy-sleepy.png")
                      : require("../assets/eddy/eddy-running.png")
                }
                style={styles.eddySmall}
                contentFit="contain"
              />
              <Text style={styles.eddyBubble}>{eddyMessage}</Text>

              {/* Progress dots */}
              <View style={styles.taskProgress}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.taskDot,
                      i < taskIndex && styles.taskDotDone,
                      i === taskIndex && styles.taskDotActive,
                    ]}
                  >
                    <Text style={styles.taskDotText}>
                      {i < taskIndex ? "✓" : i + 1}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Challenge type label */}
              <Text style={styles.kicker}>{config.icon} {config.label}</Text>
              <Text style={styles.miniDesc}>{config.description}</Text>

              {/* The challenge */}
              <GlassCard style={[styles.card, { gap: 12 }]}>
                {loading ? (
                  <Text style={styles.loadingText}>Eddy is thinking… 🧠</Text>
                ) : (
                  <>
                    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                      <Text style={[
                        styles.challengeDisplay,
                        currentType === "typing" && { fontSize: 22, letterSpacing: 0 },
                      ]}>
                        {config.getDisplay(challengeData)}
                      </Text>
                    </Animated.View>

                    <TextInput
                      ref={inputRef}
                      style={[
                        styles.mentalInput,
                        feedback === "wrong" && { borderColor: "#FF6B6B" },
                        feedback === "correct" && { borderColor: theme.colors.success },
                      ]}
                      placeholder={config.placeholder}
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      value={userInput}
                      onChangeText={(t) => {
                        setUserInput(t);
                        if (feedback) setFeedback(null);
                      }}
                      keyboardType={config.keyboardType}
                      autoCapitalize={currentType === "typing" ? "none" : "characters"}
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />

                    {feedback === "wrong" && (
                      <Text style={styles.mentalWrong}>❌ Try again!</Text>
                    )}
                    {feedback === "correct" && (
                      <Text style={styles.mentalCorrect}>
                        {taskIndex + 1 >= TOTAL_TASKS ? "✅ All done!" : `✅ ${TOTAL_TASKS - taskIndex - 1} more to go!`}
                      </Text>
                    )}
                  </>
                )}
              </GlassCard>

              {/* Overall progress */}
              <View style={{ width: "100%", marginTop: 4 }}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
                </View>
                <Text style={styles.helper}>Task {Math.min(taskIndex + 1, TOTAL_TASKS)} of {TOTAL_TASKS}</Text>
              </View>
            </View>

            {/* Submit button */}
            {!loading && (
              <TouchableOpacity
                activeOpacity={0.92}
                style={[styles.cta, (!userInput.trim() || feedback === "correct") && { opacity: 0.35 }]}
                disabled={!userInput.trim() || feedback === "correct"}
                onPress={handleSubmit}
              >
                <Text style={styles.ctaText}>SUBMIT</Text>
                <Text style={styles.ctaArrow}>→</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// CAMERA CHALLENGE
// ═══════════════════════════════════════════════════════════════

function CameraChallenge({ round, onComplete }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [faceDetectedCount, setFaceDetectedCount] = useState(0);
  const [status, setStatus] = useState("Position your face in the camera");
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackReady, setFallbackReady] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const finishedRef = useRef(false);
  const TARGET_DETECTIONS = round === 1 ? 8 : round === 2 ? 5 : 3;

  useEffect(() => { if (!permission?.granted) requestPermission(); }, []);
  useEffect(() => { const t = setTimeout(() => setFallbackReady(true), 5000); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const p = Math.min(1, faceDetectedCount / TARGET_DETECTIONS);
    Animated.timing(progressAnim, { toValue: p, duration: 200, useNativeDriver: false }).start();
    if (faceDetectedCount >= TARGET_DETECTIONS && !finishedRef.current) {
      finishedRef.current = true;
      setStatus("Face confirmed! ✅");
      setTimeout(() => onComplete(), 500);
    }
  }, [faceDetectedCount, TARGET_DETECTIONS, onComplete, progressAnim]);

  const handleFacesDetected = useCallback(({ faces }) => {
    if (finishedRef.current) return;
    if (faces?.length > 0) {
      setFaceDetectedCount((prev) => {
        const n = prev + 1;
        if (n < TARGET_DETECTIONS) setStatus(`Hold steady… ${n}/${TARGET_DETECTIONS}`);
        return n;
      });
    } else {
      setFaceDetectedCount(0);
      setStatus("Position your face in the camera");
    }
  }, [TARGET_DETECTIONS]);

  const onFallbackConfirm = () => {
    Alert.alert("Confirm", "Are you up and awake?", [
      { text: "Not yet", style: "cancel" },
      { text: "Yes", onPress: onComplete },
    ], { cancelable: true });
  };

  const progressPct = Math.round(Math.min(1, faceDetectedCount / TARGET_DETECTIONS) * 100);

  if (!permission) {
    return (
      <ScreenShell variant="alarm">
        <View style={styles.center}>
          <Text style={styles.title}>Requesting camera access…</Text>
        </View>
      </ScreenShell>
    );
  }

  if (!permission.granted || useFallback) {
    return (
      <ScreenShell variant="alarm">
        <View style={styles.wrap}>
          <View style={styles.center}>
            <Text style={styles.kicker}>CAMERA CHALLENGE</Text>
            <Text style={styles.title}>Camera not available</Text>
            <GlassCard style={styles.fallbackCard}>
              <Text style={styles.fallbackTitle}>
                {useFallback ? "Camera couldn't detect your face" : "Camera permission denied"}
              </Text>
              <Text style={styles.fallbackText}>You can still verify you're awake manually.</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.fallbackBtn, !fallbackReady && { opacity: 0.5 }]}
                disabled={!fallbackReady}
                onPress={onFallbackConfirm}
              >
                <Text style={styles.fallbackBtnText}>{fallbackReady ? "I'm awake" : "Preparing…"}</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell variant="alarm">
      <View style={styles.wrap}>
        <View style={styles.center}>
          <Text style={styles.kicker}>CAMERA CHALLENGE</Text>
          <Text style={styles.title}>Show your face to silence the alarm</Text>
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="front"
              onFacesDetected={handleFacesDetected}
              faceDetectorSettings={{
                mode: 1,
                detectLandmarks: 0,
                runClassifications: 0,
                minDetectionInterval: 300,
                tracking: true,
              }}
            />
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraFrame} />
            </View>
          </View>
          <GlassCard style={[styles.card, { marginTop: 14 }]}>
            <Text style={styles.sub}>{status}</Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, {
                width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
              }]} />
            </View>
            <Text style={styles.helper}>{progressPct}% — Keep looking at the camera</Text>
          </GlassCard>
          <TouchableOpacity activeOpacity={0.9} style={{ marginTop: 12 }} onPress={() => setUseFallback(true)}>
            <Text style={styles.cameraFallbackLink}>Camera not working? Tap here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingBottom: 110 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: theme.space.xl, gap: 8 },
  kicker: { color: theme.colors.textFaint, fontWeight: "900", letterSpacing: 2, fontSize: 13 },
  miniDesc: { color: theme.colors.textMuted, fontWeight: "700", fontSize: 15, marginBottom: 4, textAlign: "center" },
  title: { color: theme.colors.text, fontSize: 34, fontWeight: "900", textAlign: "center", letterSpacing: -0.6, marginBottom: 6 },
  card: { width: "100%", paddingVertical: 18, alignItems: "center" },
  bigNumber: { color: theme.colors.text, fontWeight: "900", fontSize: 46, letterSpacing: -1.2 },
  sub: { color: theme.colors.textMuted, fontWeight: "800", fontSize: 14, marginTop: 2, marginBottom: 14, textAlign: "center" },
  progressTrack: { width: "100%", height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.75)" },
  helper: { marginTop: 8, color: theme.colors.textFaint, fontWeight: "800", fontSize: 13, textAlign: "center" },

  // Eddy
  eddySmall: { width: 80, height: 80, marginBottom: 2 },
  eddyBubble: { color: theme.colors.text, fontWeight: "800", fontSize: 15, textAlign: "center", marginBottom: 6 },

  // Task progress dots
  taskProgress: { flexDirection: "row", gap: 14, marginBottom: 10 },
  taskDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.20)", alignItems: "center", justifyContent: "center" },
  taskDotActive: { backgroundColor: "rgba(255,255,255,0.22)", borderColor: "rgba(255,255,255,0.45)" },
  taskDotDone: { backgroundColor: "rgba(70,242,162,0.3)", borderColor: theme.colors.success },
  taskDotText: { color: theme.colors.text, fontWeight: "900", fontSize: 14 },

  // Challenge display
  challengeDisplay: { color: theme.colors.text, fontWeight: "900", fontSize: 34, letterSpacing: -0.5, textAlign: "center", marginVertical: 6 },
  loadingText: { color: theme.colors.textMuted, fontWeight: "800", fontSize: 16, textAlign: "center", paddingVertical: 20 },

  // Input
  mentalInput: { width: "100%", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 2, borderColor: "rgba(255,255,255,0.22)", borderRadius: theme.radius.lg, padding: 16, color: theme.colors.text, fontWeight: "900", fontSize: 22, textAlign: "center", letterSpacing: 0.5 },
  mentalWrong: { color: "#FF6B6B", fontWeight: "900", fontSize: 15, marginTop: 4 },
  mentalCorrect: { color: theme.colors.success, fontWeight: "900", fontSize: 15, marginTop: 4 },

  // Fallback
  fallbackCard: { width: "100%", marginTop: 10, paddingVertical: 16 },
  fallbackTitle: { color: theme.colors.text, fontWeight: "900", fontSize: 18, marginBottom: 6, textAlign: "center" },
  fallbackText: { color: theme.colors.textMuted, fontWeight: "700", fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 12 },
  fallbackBtn: { height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  fallbackBtnText: { color: "#111", fontWeight: "900", letterSpacing: 1.1 },

  // CTA
  cta: { position: "absolute", left: theme.space.xl, right: theme.space.xl, bottom: 26, height: 64, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.95)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14, borderWidth: 1, borderColor: "rgba(0,0,0,0.06)", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 12 },
  ctaText: { color: "#111", fontWeight: "900", fontSize: 18, letterSpacing: 1.2 },
  ctaArrow: { color: "#111", fontSize: 22, fontWeight: "900" },

  // Camera
  cameraContainer: { width: "100%", height: 280, borderRadius: theme.radius.xl, overflow: "hidden", borderWidth: 2, borderColor: "rgba(255,255,255,0.22)", position: "relative" },
  camera: { flex: 1 },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  cameraFrame: { width: 160, height: 200, borderRadius: 80, borderWidth: 3, borderColor: "rgba(255,255,255,0.5)", borderStyle: "dashed" },
  cameraFallbackLink: { color: theme.colors.textMuted, fontWeight: "700", fontSize: 14, textDecorationLine: "underline" },
});