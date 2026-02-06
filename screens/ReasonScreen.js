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
import { LinearGradient } from "expo-linear-gradient";

export default function ReasonScreen({ navigation, route }) {
  const [reason, setReason] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("energetic");
  const [selectedPersonality, setSelectedPersonality] = useState("motivational");

  const examples = [
    { icon: "📚", text: "8 a.m. class and attendance matters" },
    { icon: "💪", text: "spinning class at the gym" },
    { icon: "📞", text: "Important client call at 9" },
    { icon: "✈️", text: "Catch my 6 a.m. flight" },
  ];

  const genres = [
    { id: "energetic", name: "Energetic", icon: "⚡", desc: "High-energy beats" },
    { id: "calm", name: "Calm", icon: "🌊", desc: "Peaceful sounds" },
    { id: "rock", name: "Rock", icon: "🎸", desc: "Wake up loud" },
    { id: "electronic", name: "Electronic", icon: "🎵", desc: "Synth vibes" },
  ];

  const personalities = [
    { id: "motivational", name: "Motivational Coach", icon: "💪", desc: "Get you fired up!" },
    { id: "sassy", name: "Sassy Friend", icon: "😏", desc: "Witty and bold" },
    { id: "drill-sergeant", name: "Drill Sergeant", icon: "🎖", desc: "No excuses!" },
    { id: "zen", name: "Zen Master", icon: "🧘", desc: "Calm wisdom" },
  ];

  const selectExample = (text) => setReason(text);

  // route.params now includes:
  // - timeDate (Date object)
  // - timeLabel (string like "7:00 AM")
  // - days (array)
  const paramsFromPrevious = route?.params || {};
  const { timeLabel } = paramsFromPrevious;

  return (
    <LinearGradient colors={["#0a0e27", "#1a1f3a", "#2a2f4a"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>

          <Text style={styles.stepIndicator}>Step 2 of 4</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Personalize your{"\n"}wake-up</Text>

          <Text style={styles.subtitle}>AI will generate unique messages every morning</Text>

          {/* Optional: show chosen time */}
          {timeLabel ? (
            <View style={styles.timePill}>
              <Text style={styles.timePillText}>⏰ {timeLabel}</Text>
            </View>
          ) : null}

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Alex"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="words"
            />
          </View>

          {/* Reason Input */}
          <View style={[styles.inputContainer, styles.reasonContainer]}>
            <Text style={styles.inputLabel}>Why you're waking up</Text>
            <TextInput
              style={[styles.input, styles.reasonInput]}
              placeholder="e.g. spinning class at the gym"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>

          {/* Examples */}
          <View style={styles.examplesSection}>
            <Text style={styles.examplesLabel}>Quick examples:</Text>
            {examples.map((example, index) => (
              <TouchableOpacity
                key={index}
                style={styles.examplePill}
                onPress={() => selectExample(example.text)}
              >
                <Text style={styles.exampleIcon}>{example.icon}</Text>
                <Text style={styles.exampleText}>{example.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* AI Personality Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>AI Personality</Text>
            <Text style={styles.sectionSubtitle}>How should AI wake you?</Text>
            <View style={styles.optionsGrid}>
              {personalities.map((personality) => (
                <TouchableOpacity
                  key={personality.id}
                  style={[
                    styles.optionCard,
                    selectedPersonality === personality.id && styles.optionCardActive,
                  ]}
                  onPress={() => setSelectedPersonality(personality.id)}
                >
                  <Text style={styles.optionIcon}>{personality.icon}</Text>
                  <Text style={styles.optionName}>{personality.name}</Text>
                  <Text style={styles.optionDesc}>{personality.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Music Genre Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Alarm Sound</Text>
            <Text style={styles.sectionSubtitle}>Pick your wake-up vibe</Text>
            <View style={styles.optionsGrid}>
              {genres.map((genre) => (
                <TouchableOpacity
                  key={genre.id}
                  style={[styles.optionCard, selectedGenre === genre.id && styles.optionCardActive]}
                  onPress={() => setSelectedGenre(genre.id)}
                >
                  <Text style={styles.optionIcon}>{genre.icon}</Text>
                  <Text style={styles.optionName}>{genre.name}</Text>
                  <Text style={styles.optionDesc}>{genre.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview Box */}
          {(userName || reason) ? (
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewLabel}>🎙 Sample AI message:</Text>
              </View>
              <Text style={styles.previewText}>
                {selectedPersonality === "sassy" &&
                  `"Wake up ${userName}! Time to stop dreaming about ${reason || "success"} and actually do it!"`}
                {selectedPersonality === "motivational" &&
                  `"Rise and shine ${userName}! Today you're crushing ${reason || "your goals"}. Let's GO!"`}
                {selectedPersonality === "drill-sergeant" &&
                  `"UP NOW ${userName}! You signed up for ${reason || "this"}. No excuses, MOVE!"`}
                {selectedPersonality === "zen" &&
                  `"Good morning ${userName}. Today brings ${reason || "new opportunities"}. Breathe and begin."`}
              </Text>
              <Text style={styles.previewNote}>✨ AI generates new variations every morning</Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, (!userName || !reason) && styles.nextButtonDisabled]}
          onPress={() => {
            if (userName && reason) {
              navigation.navigate("ProofMethod", {
                ...route.params, // ✅ forwards timeDate + timeLabel + days
                userName,
                reason,
                musicGenre: selectedGenre,
                aiPersonality: selectedPersonality,
              });
            }
          }}
          activeOpacity={0.9}
          disabled={!userName || !reason}
        >
          <LinearGradient
            colors={userName && reason ? ["#4158D0", "#C850C0"] : ["#555", "#666"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>Next</Text>
            <Text style={styles.nextArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "300",
  },
  stepIndicator: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
  content: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 30,
    paddingBottom: 120,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
    lineHeight: 50,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 20,
    lineHeight: 24,
  },

  timePill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  timePillText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
    fontSize: 13,
  },

  inputContainer: { marginBottom: 20 },
  reasonContainer: { marginBottom: 24 },
  inputLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "500",
  },
  reasonInput: { height: 80, paddingTop: 16 },

  examplesSection: { marginBottom: 32 },
  examplesLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  examplePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  exampleIcon: { fontSize: 18, marginRight: 12 },
  exampleText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    flex: 1,
  },

  sectionContainer: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  optionCardActive: {
    borderColor: "#4158D0",
    backgroundColor: "rgba(65, 88, 208, 0.15)",
  },
  optionIcon: { fontSize: 32, marginBottom: 8 },
  optionName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },

  previewContainer: {
    backgroundColor: "rgba(65, 88, 208, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(65, 88, 208, 0.3)",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  previewHeader: { marginBottom: 12 },
  previewLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  previewText: {
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 24,
    fontStyle: "italic",
    fontWeight: "500",
    marginBottom: 12,
  },
  previewNote: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
  },

  nextButton: {
    position: "absolute",
    bottom: 50,
    left: 30,
    right: 30,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#4158D0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonDisabled: { shadowOpacity: 0 },
  nextGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  nextText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginRight: 10,
  },
  nextArrow: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "300",
  },
});
