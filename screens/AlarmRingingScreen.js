import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

export default function AlarmRingingScreen({ navigation, route }) {
  const { userName, reason, round, proofMethod, aiPersonality } = route.params;
  const [pulseAnim] = useState(new Animated.Value(1));
  const [message, setMessage] = useState('');

  // Generate wake-up message
  const generateMessage = () => {
    const messages = {
      'zen': `Good morning ${userName}. Today brings ${reason}. Time to begin.`,
      'sassy': `Wake up ${userName}! Time to stop dreaming and do ${reason}!`,
      'motivational': `GOOD MORNING ${userName}! Let's crush ${reason} today!`,
      'drill-sergeant': `UP NOW ${userName}! ${reason} - MOVE MOVE MOVE!`,
    };
    return messages[aiPersonality] || messages['motivational'];
  };

  useEffect(() => {
    const msg = generateMessage();
    setMessage(msg);

    // Start vibration
    Vibration.vibrate([1000, 500], true);

    // Speak message
    Speech.speak(msg, {
      language: 'en-US',
      pitch: 1.0,
      rate: 1.0,
      volume: 1.0,
    });

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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

    return () => {
      Vibration.cancel();
      Speech.stop();
    };
  }, []);

  return (
    <LinearGradient colors={['#FF0080', '#FF8C00', '#FF0080']} style={styles.container}>
      <View style={styles.content}>
        {/* Eddy Character Placeholder */}
        <Animated.View style={[styles.eddyContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.eddyIcon}>😴</Text>
          <Text style={styles.eddyName}>Eddy</Text>
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
          <Text style={styles.warningText}>Complete challenge to stop alarm</Text>
        </View>
      </View>

      {/* Button - THIS MUST WORK */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('✅ Button pressed - Navigating to ProofTask');
          Vibration.cancel();
          Speech.stop();
          navigation.navigate('ProofTask', route.params);
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  eddyContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  eddyIcon: {
    fontSize: 120,
    marginBottom: 10,
  },
  eddyName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 2,
  },
  roundText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 64,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  messageText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 12,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  button: {
    marginHorizontal: 30,
    marginBottom: 50,
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF0080',
    textAlign: 'center',
    letterSpacing: 1,
  },
});