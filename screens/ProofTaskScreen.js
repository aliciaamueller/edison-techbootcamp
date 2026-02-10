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
import * as Speech from "expo-speech";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";
import { startRinging, stopRinging } from "../services/alarmEngine";

// ─────────────────────────────────────────────────────────────
// CHALLENGE DATA POOLS
// ─────────────────────────────────────────────────────────────

const SCRAMBLE_WORDS = {
  easy: [
    { word: "APPLE", scrambled: "PLPAE" },
    { word: "WATER", scrambled: "TAWER" },
    { word: "PHONE", scrambled: "HPONE" },
    { word: "LIGHT", scrambled: "GILHT" },
    { word: "MUSIC", scrambled: "SUMCI" },
    { word: "BRAIN", scrambled: "RBAIN" },
    { word: "CLOCK", scrambled: "LOCKC" },
    { word: "DREAM", scrambled: "REDMA" },
    { word: "SMILE", scrambled: "IMSEL" },
    { word: "TOAST", scrambled: "SATOT" },
    { word: "SUNNY", scrambled: "NUSNY" },
    { word: "SPARK", scrambled: "PRASK" },
  ],
  hard: [
    { word: "MORNING", scrambled: "GNIMRON" },
    { word: "SUNRISE", scrambled: "NRUSISE" },
    { word: "KITCHEN", scrambled: "TCKIHNE" },
    { word: "BLANKET", scrambled: "LNABTEK" },
    { word: "STRETCH", scrambled: "TRSETCH" },
    { word: "ESPRESSO", scrambled: "SSEPORES" },
    { word: "PANCAKES", scrambled: "CNPAAKES" },
    { word: "DAYLIGHT", scrambled: "YDALGHIT" },
    { word: "CHAMPION", scrambled: "HCMAPION" },
    { word: "ATTITUDE", scrambled: "TTAITDEU" },
  ],
};

const REVERSE_WORDS = {
  easy: ["HELLO", "AWAKE", "FRESH", "ALERT", "ALIVE", "READY", "FOCUS", "POWER", "HAPPY", "SHINE"],
  hard: ["MORNING", "SUNRISE", "WARRIOR", "THUNDER", "VICTORY", "RESOLVE", "BREATHE", "CONQUER"],
};

const EMOJI_CHALLENGES = [
  { emojis: "☀️ + ☕", answer: "MORNING", hint: "How your day starts" },
  { emojis: "🛏️ → 🚶", answer: "WAKE UP", hint: "What you need to do right now" },
  { emojis: "🌅 + 🐦", answer: "SUNRISE", hint: "Early birds see this" },
  { emojis: "💪 + 🧠", answer: "STRONG", hint: "Mind and body" },
  { emojis: "⏰ + 🏃", answer: "RUSH", hint: "When you're late" },
  { emojis: "🌙 → ☀️", answer: "DAWN", hint: "Night becomes day" },
  { emojis: "☕ + 🥐", answer: "BREAKFAST", hint: "First meal" },
  { emojis: "🔔 + 📱", answer: "ALARM", hint: "What woke you up" },
  { emojis: "😴 → 😊", answer: "AWAKE", hint: "You're becoming this" },
  { emojis: "🎯 + 📅", answer: "GOAL", hint: "Something to aim for" },
  { emojis: "🧘 + 🌿", answer: "ZEN", hint: "Inner peace" },
  { emojis: "⚡ + 🔋", answer: "ENERGY", hint: "What coffee gives you" },
  { emojis: "🏆 + 👑", answer: "CHAMPION", hint: "A winner" },
  { emojis: "🌊 + 🏄", answer: "WAVE", hint: "Ride it at the beach" },
];

const TRIVIA_QUESTIONS = {
  easy: [
    { q: "How many days in a week?", a: "7", options: ["5", "6", "7", "8"] },
    { q: "What planet are we on?", a: "EARTH", options: ["MARS", "EARTH", "VENUS", "JUPITER"] },
    { q: "How many continents are there?", a: "7", options: ["5", "6", "7", "8"] },
    { q: "What color do you get mixing red + yellow?", a: "ORANGE", options: ["GREEN", "ORANGE", "PURPLE", "PINK"] },
    { q: "How many hours in a day?", a: "24", options: ["12", "24", "36", "48"] },
    { q: "What is H₂O?", a: "WATER", options: ["FIRE", "WATER", "AIR", "SALT"] },
    { q: "How many legs does a spider have?", a: "8", options: ["6", "8", "10", "12"] },
    { q: "Which month comes after March?", a: "APRIL", options: ["MAY", "FEBRUARY", "APRIL", "JUNE"] },
    { q: "What is the capital of France?", a: "PARIS", options: ["LONDON", "BERLIN", "PARIS", "ROME"] },
    { q: "How many colors in a rainbow?", a: "7", options: ["5", "6", "7", "8"] },
  ],
  hard: [
    { q: "What year did the Titanic sink?", a: "1912", options: ["1905", "1912", "1920", "1898"] },
    { q: "Which planet has the most moons?", a: "SATURN", options: ["JUPITER", "SATURN", "NEPTUNE", "URANUS"] },
    { q: "What is the smallest country?", a: "VATICAN", options: ["MONACO", "VATICAN", "MALTA", "NAURU"] },
    { q: "How many bones in the human body?", a: "206", options: ["186", "196", "206", "216"] },
    { q: "What element does 'Au' represent?", a: "GOLD", options: ["SILVER", "GOLD", "COPPER", "IRON"] },
    { q: "Which ocean is the largest?", a: "PACIFIC", options: ["ATLANTIC", "INDIAN", "PACIFIC", "ARCTIC"] },
    { q: "What is the hardest natural substance?", a: "DIAMOND", options: ["STEEL", "DIAMOND", "QUARTZ", "TITANIUM"] },
    { q: "How many strings on a standard guitar?", a: "6", options: ["4", "5", "6", "8"] },
  ],
};

// ─────────────────────────────────────────────────────────────
// CHALLENGE GENERATOR
// ─────────────────────────────────────────────────────────────

function generateMentalChallenge(round) {
  let types;
  if (round <= 1) {
    types = ["math", "scramble", "emoji", "trivia"];
  } else if (round === 2) {
    types = ["math", "scramble", "reverse", "emoji", "trivia"];
  } else {
    types = ["math", "scramble", "reverse", "emoji", "trivia"];
  }

  const type = types[Math.floor(Math.random() * types.length)];
  const difficulty = round <= 1 ? "easy" : "hard";

  switch (type) {
    case "math":
      return generateMathChallenge(round);
    case "scramble":
      return generateScrambleChallenge(difficulty);
    case "reverse":
      return generateReverseChallenge(difficulty);
    case "emoji":
      return generateEmojiChallenge();
    case "trivia":
      return generateTriviaChallenge(difficulty);
    default:
      return generateMathChallenge(round);
  }
}

function generateMathChallenge(round) {
  if (round <= 1) {
    const a = Math.floor(Math.random() * 40) + 12;
    const b = Math.floor(Math.random() * 40) + 12;
    return {
      type: "math",
      label: "🔢 Quick Math",
      question: `${a} + ${b}`,
      displayQuestion: `${a} + ${b} = ?`,
      answer: String(a + b),
      inputType: "numeric",
    };
  }
  if (round === 2) {
    const a = Math.floor(Math.random() * 10) + 6;
    const b = Math.floor(Math.random() * 8) + 3;
    return {
      type: "math",
      label: "🔢 Quick Math",
      question: `${a} × ${b}`,
      displayQuestion: `${a} × ${b} = ?`,
      answer: String(a * b),
      inputType: "numeric",
    };
  }
  const a = Math.floor(Math.random() * 30) + 10;
  const b = Math.floor(Math.random() * 20) + 10;
  const c = Math.floor(Math.random() * 15) + 2;
  const ops = ["+", "−"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const result = op === "+" ? a + b + c : a + b - c;
  return {
    type: "math",
    label: "🔢 Quick Math",
    question: `${a} + ${b} ${op} ${c}`,
    displayQuestion: `${a} + ${b} ${op} ${c} = ?`,
    answer: String(result),
    inputType: "numeric",
  };
}

function generateScrambleChallenge(difficulty) {
  const pool = SCRAMBLE_WORDS[difficulty] || SCRAMBLE_WORDS.easy;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return {
    type: "scramble",
    label: "🔤 Word Scramble",
    question: pick.scrambled,
    displayQuestion: pick.scrambled,
    hint: `${pick.word.length} letters`,
    answer: pick.word,
    inputType: "text",
  };
}

function generateReverseChallenge(difficulty) {
  const pool = REVERSE_WORDS[difficulty] || REVERSE_WORDS.easy;
  const word = pool[Math.floor(Math.random() * pool.length)];
  const reversed = word.split("").reverse().join("");
  return {
    type: "reverse",
    label: "🔄 Reverse Word",
    question: word,
    displayQuestion: word,
    hint: "Type this word backwards",
    answer: reversed,
    inputType: "text",
  };
}

function generateEmojiChallenge() {
  const pick = EMOJI_CHALLENGES[Math.floor(Math.random() * EMOJI_CHALLENGES.length)];
  return {
    type: "emoji",
    label: "😎 Emoji Decode",
    question: pick.emojis,
    displayQuestion: pick.emojis,
    hint: pick.hint,
    answer: pick.answer,
    inputType: "text",
  };
}

function generateTriviaChallenge(difficulty) {
  const pool = TRIVIA_QUESTIONS[difficulty] || TRIVIA_QUESTIONS.easy;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return {
    type: "trivia",
    label: "🧠 Quick Trivia",
    question: pick.q,
    displayQuestion: pick.q,
    answer: pick.a,
    options: pick.options,
    inputType: "choice",
  };
}

function checkAnswer(userInput, correctAnswer) {
  const clean = (s) => s.trim().toUpperCase().replace(/\s+/g, " ");
  return clean(userInput) === clean(correctAnswer);
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

  // Keep alarm ringing on this screen
  useEffect(() => {
    startRinging({ musicGenre });
    Vibration.vibrate([0, 900, 500, 900, 500], true);

    return () => {
      stopRinging();
      Speech.stop();
      Vibration.cancel();
    };
  }, [musicGenre]);

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
    if (demoMode && demoRequiredSteps.length > 0) {
      return demoRequiredSteps[round - 1] ?? 30;
    }
    if (round === 1) return 30;
    if (round === 2) return 15;
    if (round === 3) return 5;
    return 30;
  }, [demoMode, demoRequiredSteps, round]);

  const [isAvailable, setIsAvailable] = useState(null);
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState("Counting steps…");
  const [fallbackReady, setFallbackReady] = useState(false);

  const runAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pedometerSubRef = useRef(null);
  const baseRef = useRef(0);
  const finishedRef = useRef(false);

  const taskTitle = `Walk ${TARGET_STEPS} steps`;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(runAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(runAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [runAnim]);

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
            const startDate = new Date(end.getTime() - 60 * 1000);
            const res = await Pedometer.getStepCountAsync(startDate, end);
            baseRef.current = res?.steps ?? 0;
          } catch {
            baseRef.current = 0;
          }
        }
        pedometerSubRef.current = Pedometer.watchStepCount((result) => {
          const raw = result?.steps ?? 0;
          setSteps(Math.max(0, raw - baseRef.current));
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
    if (steps >= TARGET_STEPS && !finishedRef.current) {
      finishedRef.current = true;
      onComplete();
    }
  }, [steps, progressAnim, TARGET_STEPS, onComplete]);

  const onFallbackConfirm = () => {
    Alert.alert("Confirm", "Are you up and moving?", [
      { text: "Not yet", style: "cancel" },
      { text: "Yes", onPress: onComplete },
    ], { cancelable: true });
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
            <Text style={styles.bigNumber}>{isAvailable ? `${steps}/${TARGET_STEPS}` : "—"}</Text>
            <Text style={styles.sub}>{isAvailable ? `${progressPct}% complete` : status}</Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, {
                width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
              }]} />
            </View>
            <Text style={styles.helper}>{status}</Text>
          </GlassCard>
          {isAvailable === false && (
            <GlassCard style={styles.fallbackCard}>
              <Text style={styles.fallbackTitle}>No step counter detected</Text>
              <Text style={styles.fallbackText}>Some devices can't count steps in Expo Go. You can still continue after a short check.</Text>
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
// MENTAL CHALLENGE (multi-type: math, scramble, reverse, emoji, trivia)
// ═══════════════════════════════════════════════════════════════

function MentalChallenge({ round, onComplete }) {
  const [challenge, setChallenge] = useState(() => generateMentalChallenge(round));
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const newChallenge = () => {
    setChallenge(generateMentalChallenge(round));
    setUserInput("");
    setFeedback(null);
    setAttempts(0);
    setShowHint(false);
  };

  const handleSubmit = (selectedOption) => {
    const answer = selectedOption || userInput;
    if (!answer || !answer.trim()) return;

    if (checkAnswer(answer, challenge.answer)) {
      setFeedback("correct");
      setTimeout(() => onComplete(), 600);
    } else {
      setFeedback("wrong");
      setAttempts((a) => a + 1);
      triggerShake();

      if (attempts >= 2) {
        setTimeout(() => newChallenge(), 1000);
      } else {
        if (attempts >= 1) setShowHint(true);
        setTimeout(() => {
          if (challenge.inputType !== "choice") setUserInput("");
          setFeedback(null);
        }, 600);
      }
    }
  };

  const instruction = useMemo(() => {
    switch (challenge.type) {
      case "math": return "Solve the equation";
      case "scramble": return "Unscramble the letters";
      case "reverse": return "Type this word backwards";
      case "emoji": return "What do these emojis mean?";
      case "trivia": return "Pick the right answer";
      default: return "Solve to silence the alarm";
    }
  }, [challenge.type]);

  const questionFontSize = challenge.type === "emoji" ? 52 : 38;

  return (
    <ScreenShell variant="alarm">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.wrap}>
            <View style={styles.center}>
              <Text style={styles.kicker}>{challenge.label}</Text>
              <Text style={styles.title}>{instruction}</Text>

              <GlassCard style={[styles.card, { gap: 10 }]}>
                <Text style={styles.mentalDifficulty}>
                  Round {round}
                </Text>

                <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                  <Text style={[styles.mentalQuestion, { fontSize: questionFontSize }]}>
                    {challenge.displayQuestion}
                  </Text>
                </Animated.View>

                {showHint && challenge.hint && challenge.inputType !== "choice" && (
                  <Text style={styles.mentalHintText}>💡 Hint: {challenge.hint}</Text>
                )}

                {(challenge.inputType === "text" || challenge.inputType === "numeric") && (
                  <TextInput
                    style={styles.mentalInput}
                    placeholder={challenge.type === "math" ? "Your answer" : "Type here…"}
                    placeholderTextColor="rgba(255,255,255,0.40)"
                    value={userInput}
                    onChangeText={(t) => {
                      setUserInput(t);
                      setFeedback(null);
                    }}
                    keyboardType={challenge.inputType === "numeric" ? "numeric" : "default"}
                    autoCapitalize="characters"
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmit()}
                    autoFocus
                  />
                )}

                {challenge.inputType === "choice" && challenge.options && (
                  <View style={styles.triviaGrid}>
                    {challenge.options.map((opt, idx) => {
                      const isSelected = userInput === opt;
                      const isCorrectAnswer = feedback === "correct" && opt === challenge.answer;
                      const isWrongSelection = feedback === "wrong" && isSelected;

                      return (
                        <TouchableOpacity
                          key={idx}
                          activeOpacity={0.85}
                          style={[
                            styles.triviaOption,
                            isSelected && styles.triviaOptionSelected,
                            isCorrectAnswer && styles.triviaOptionCorrect,
                            isWrongSelection && styles.triviaOptionWrong,
                          ]}
                          onPress={() => {
                            if (feedback) return;
                            setUserInput(opt);
                            handleSubmit(opt);
                          }}
                        >
                          <Text style={[
                            styles.triviaOptionText,
                            (isCorrectAnswer || isWrongSelection) && { color: "#fff" },
                          ]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {feedback === "wrong" && (
                  <Text style={styles.mentalWrong}>
                    {attempts >= 2 ? "❌ Wrong — new challenge coming…" : "❌ Wrong — try again!"}
                  </Text>
                )}
                {feedback === "correct" && (
                  <Text style={styles.mentalCorrect}>✅ Correct!</Text>
                )}
              </GlassCard>

              <TouchableOpacity activeOpacity={0.8} onPress={newChallenge} style={{ marginTop: 4 }}>
                <Text style={styles.skipLink}>🔄 Different challenge</Text>
              </TouchableOpacity>
            </View>

            {challenge.inputType !== "choice" && (
              <TouchableOpacity
                activeOpacity={0.92}
                style={[styles.cta, !userInput.trim() && { opacity: 0.35 }]}
                disabled={!userInput.trim()}
                onPress={() => handleSubmit()}
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

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFallbackReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const progress = Math.min(1, faceDetectedCount / TARGET_DETECTIONS);
    Animated.timing(progressAnim, { toValue: progress, duration: 200, useNativeDriver: false }).start();
    if (faceDetectedCount >= TARGET_DETECTIONS && !finishedRef.current) {
      finishedRef.current = true;
      setStatus("Face confirmed! ✅");
      setTimeout(() => onComplete(), 500);
    }
  }, [faceDetectedCount, TARGET_DETECTIONS, onComplete, progressAnim]);

  const handleFacesDetected = useCallback(({ faces }) => {
    if (finishedRef.current) return;
    if (faces && faces.length > 0) {
      setFaceDetectedCount((prev) => {
        const next = prev + 1;
        if (next < TARGET_DETECTIONS) setStatus(`Hold steady… ${next}/${TARGET_DETECTIONS}`);
        return next;
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

  const progress = Math.min(1, faceDetectedCount / TARGET_DETECTIONS);
  const progressPct = Math.round(progress * 100);

  if (!permission) {
    return (
      <ScreenShell variant="alarm">
        <View style={styles.center}><Text style={styles.title}>Requesting camera access…</Text></View>
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
              <Text style={styles.fallbackTitle}>{useFallback ? "Camera couldn't detect your face" : "Camera permission denied"}</Text>
              <Text style={styles.fallbackText}>You can still verify you're awake with a manual confirmation.</Text>
              <TouchableOpacity activeOpacity={0.9} style={[styles.fallbackBtn, !fallbackReady && { opacity: 0.5 }]} disabled={!fallbackReady} onPress={onFallbackConfirm}>
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
              faceDetectorSettings={{ mode: 1, detectLandmarks: 0, runClassifications: 0, minDetectionInterval: 300, tracking: true }}
            />
            <View style={styles.cameraOverlay}><View style={styles.cameraFrame} /></View>
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
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: theme.space.xl, gap: 12 },
  kicker: { color: theme.colors.textFaint, fontWeight: "900", letterSpacing: 2, fontSize: 12 },
  title: { color: theme.colors.text, fontSize: 34, fontWeight: "900", textAlign: "center", letterSpacing: -0.6, marginBottom: 6 },
  card: { width: "100%", paddingVertical: 18, alignItems: "center" },
  bigNumber: { color: theme.colors.text, fontWeight: "900", fontSize: 46, letterSpacing: -1.2 },
  sub: { color: theme.colors.textMuted, fontWeight: "800", fontSize: 14, marginTop: 2, marginBottom: 14, textAlign: "center" },
  progressTrack: { width: "100%", height: 12, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.75)" },
  helper: { marginTop: 12, color: theme.colors.textFaint, fontWeight: "800", fontSize: 13, textAlign: "center" },
  fallbackCard: { width: "100%", marginTop: 10, paddingVertical: 16 },
  fallbackTitle: { color: theme.colors.text, fontWeight: "900", fontSize: 18, marginBottom: 6, textAlign: "center" },
  fallbackText: { color: theme.colors.textMuted, fontWeight: "700", fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 12 },
  fallbackBtn: { height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  fallbackBtnText: { color: "#111", fontWeight: "900", letterSpacing: 1.1 },
  cta: { position: "absolute", left: theme.space.xl, right: theme.space.xl, bottom: 26, height: 64, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.95)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14, borderWidth: 1, borderColor: "rgba(0,0,0,0.06)", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 12 },
  ctaText: { color: "#111", fontWeight: "900", fontSize: 18, letterSpacing: 1.2 },
  ctaArrow: { color: "#111", fontSize: 22, fontWeight: "900" },

  // Mental challenge
  mentalDifficulty: { color: theme.colors.textFaint, fontWeight: "800", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  mentalQuestion: { color: theme.colors.text, fontWeight: "900", fontSize: 38, letterSpacing: -1, textAlign: "center", marginVertical: 10 },
  mentalInput: { width: "100%", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)", borderRadius: theme.radius.lg, padding: 16, color: theme.colors.text, fontWeight: "900", fontSize: 24, textAlign: "center", letterSpacing: 1 },
  mentalWrong: { color: "#FF6B6B", fontWeight: "900", fontSize: 16, marginTop: 6 },
  mentalCorrect: { color: theme.colors.success, fontWeight: "900", fontSize: 16, marginTop: 6 },
  mentalHintText: { color: theme.colors.warn, fontWeight: "800", fontSize: 14, textAlign: "center", marginBottom: 4 },
  skipLink: { color: theme.colors.textMuted, fontWeight: "700", fontSize: 14, textDecorationLine: "underline" },

  // Trivia
  triviaGrid: { width: "100%", gap: 10, marginTop: 4 },
  triviaOption: { width: "100%", paddingVertical: 16, paddingHorizontal: 20, borderRadius: theme.radius.lg, backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.20)", alignItems: "center" },
  triviaOptionSelected: { borderColor: "rgba(255,255,255,0.50)", backgroundColor: "rgba(255,255,255,0.18)" },
  triviaOptionCorrect: { borderColor: theme.colors.success, backgroundColor: "rgba(70,242,162,0.25)" },
  triviaOptionWrong: { borderColor: "#FF6B6B", backgroundColor: "rgba(255,107,107,0.25)" },
  triviaOptionText: { color: theme.colors.text, fontWeight: "900", fontSize: 18, letterSpacing: 0.5 },

  // Camera
  cameraContainer: { width: "100%", height: 280, borderRadius: theme.radius.xl, overflow: "hidden", borderWidth: 2, borderColor: "rgba(255,255,255,0.22)", position: "relative" },
  camera: { flex: 1 },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  cameraFrame: { width: 160, height: 200, borderRadius: 80, borderWidth: 3, borderColor: "rgba(255,255,255,0.5)", borderStyle: "dashed" },
  cameraFallbackLink: { color: theme.colors.textMuted, fontWeight: "700", fontSize: 14, textDecorationLine: "underline" },
});