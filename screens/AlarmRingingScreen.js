// screens/AlarmRingingScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Speech from "expo-speech";

import { startRinging, stopRinging } from "../services/alarmEngine";
import { setAlarmVolume } from "../services/soundManager";

export default function AlarmRingingScreen({ navigation, route }) {
  const { userName, reason, round, proofMethod, aiPersonality } = route.params;

  const [pulseAnim] = useState(new Animated.Value(1));
  const [bounceAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [message, setMessage] = useState("");
  const [volume, setVolume] = useState(1.0);

  // Generate wake-up message
  const generateMessage = () => {
    const messages = {
      zen: `Good morning ${userName}. Today brings ${reason}. Time to begin.`,
      sassy: `Wake up ${userName}! Time to stop dreaming and do ${reason}!`,
      motivational: `GOOD MORNING ${userName}! Let's crush ${reason} today!`,
      "drill-sergeant": `UP NOW ${userName}! ${reason} - MOVE MOVE MOVE!`,
    };
    return messages[aiPersonality] || messages["motivational"];
  };

  useEffect(() => {
    const msg = generateMessage();
    setMessage(msg);

    // Speak message (voice line)
    Speech.speak(msg, {
      language: "en-US",
      pitch: 1.0,
      rate: 1.0,
      volume: 1.0,
    });

    // ✅ Start real ringing (looping sound + vibration) using chosen genre
    startRinging({ musicGenre: route.params?.musicGenre });

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Eddy pulse animation (breathing effect)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Eddy bounce animation (trying to wake you up)
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      // ✅ Stop ringing (sound + vibration) and stop speech
      stopRinging();
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient colors={["#FF0080", "#FF8C00", "#FF0080"]} style={styles.container}>
      <View style={styles.content}>
        {/* Eddy Character - Sleepy */}
        <Animated.View
          style={[
            styles.eddyContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }, { translateY: bounceAnim }],
            },
          ]}
        >
          <Image
            source={require("../assets/eddy/eddy-sleepy.png")}
            style={styles.eddyImage}
            contentFit="contain"
          />
          <Text style={styles.eddyName}>Eddy is sleepy too!</Text>
          <Text style={styles.eddySubtext}>Help him light up! 💡</Text>
        </Animated.View>

        {/* Round */}
        <Text style={styles.roundText}>Round {round} of 3</Text>

        {/* Title */}
        <Text style={styles.title}>WAKE UP!</Text>

        {/* Message */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>"{message}"</Text>
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>Complete challenge to power Eddy's lightbulb!</Text>
        </View>

        {/* OPTIONAL quick volume control (no slider UI yet) */}
        <View style={styles.volumeRow}>
          <TouchableOpacity
            style={styles.volumeButton}
            onPress={async () => {
              const newVol = 0.3;
              setVolume(newVol);
              await setAlarmVolume(newVol);
            }}
          >
            <Text style={styles.volumeButtonText}>Lower Volume</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.volumeButton}
            onPress={async () => {
              const newVol = 1.0;
              setVolume(newVol);
              await setAlarmVolume(newVol);
            }}
          >
            <Text style={styles.volumeButtonText}>Full Volume</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.volumeHint}>Volume: {Math.round(volume * 100)}%</Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("✅ Button pressed - Navigating to ProofTask");
          stopRinging();
          Speech.stop();
          navigation.navigate("ProofTask", route.params);
        }}
      >
        <Text style={styles.buttonText}>START CHALLENGE →</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  eddyContainer: {
    alignItems: "center",
    marginBottom: 22,
  },
  eddyImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  eddyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  eddySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    fontStyle: "italic",
  },
  roundText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 64,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 22,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  messageBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 25,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  messageText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 26,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  volumeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  volumeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  volumeButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  volumeHint: {
    marginTop: 10,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
    fontSize: 12,
  },
  button: {
    marginHorizontal: 30,
    marginBottom: 50,
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FF0080",
    textAlign: "center",
    letterSpacing: 1,
  },
});
