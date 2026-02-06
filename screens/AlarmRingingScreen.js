import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Speech from 'expo-speech';
import { SafeAreaView } from 'react-native-safe-area-context';

import { startRinging, stopRinging } from "../services/alarmEngine";
import { setAlarmVolume } from "../services/soundManager";

export default function AlarmRingingScreen({ navigation, route }) {
  const { userName, reason, round = 1, aiPersonality } = route.params || {};

  const [pulseAnim] = useState(new Animated.Value(1));
  const [bounceAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [message, setMessage] = useState('');
  const [volume, setVolume] = useState(1.0);

  const generateMessage = () => {
    const messages = {
      zen: `Good morning ${userName}. Today brings ${reason}. Time to begin.`,
      sassy: `Wake up ${userName}! Time to stop dreaming and do ${reason}!`,
      motivational: `GOOD MORNING ${userName}! Let's crush ${reason} today!`,
      'drill-sergeant': `UP NOW ${userName}! ${reason} - MOVE MOVE MOVE!`,
    };
    return messages[aiPersonality] || messages.motivational;
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

    // Start alarm sound loop
    startRinging({ musicGenre: route.params?.musicGenre });

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Eddy pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
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

    // Eddy bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
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
      stopRinging();
      Vibration.cancel();
      Speech.stop();
    };
  }, []);

  const handleStart = () => {
    stopRinging();
    Vibration.cancel();
    Speech.stop();
    navigation.navigate('ProofTask', route.params);
  };

  const setLowVolume = async () => {
    setVolume(0.3);
    await setAlarmVolume(0.3);
  };

  const setFullVolume = async () => {
    setVolume(1.0);
    await setAlarmVolume(1.0);
  };

  return (
    <LinearGradient colors={['#FF0080', '#FF8C00', '#FF0080']} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Scrollable content so nothing clips off-screen */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Eddy */}
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
              source={require('../assets/eddy/eddy-sleepy.png')}
              style={styles.eddyImage}
              contentFit="contain"
            />
            <Text style={styles.eddyName}>Eddy is sleepy too!</Text>
            <Text style={styles.eddySubtext}>Help him light up! 💡</Text>
          </Animated.View>

          {/* Round */}
          <Text style={styles.roundText}>ROUND {round} OF 3</Text>

          {/* Title */}
          <Text style={styles.title}>WAKE{'\n'}UP!</Text>

          {/* Message */}
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>"{message}"</Text>
          </View>

          {/* Warning */}
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>Complete challenge to power Eddy's lightbulb!</Text>
          </View>

          {/* Spacer so CTA never covers content */}
          <View style={{ height: 130 }} />
        </ScrollView>

        {/* Bottom fixed controls (no overlap) */}
        <View style={styles.bottomArea}>
          <View style={styles.volumeRow}>
            <TouchableOpacity style={styles.volumeBtn} onPress={setLowVolume}>
              <Text style={styles.volumeBtnText}>Lower Volume</Text>
              <Text style={styles.volumeSubText}>{volume === 0.3 ? 'Selected' : ''}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.volumeBtn} onPress={setFullVolume}>
              <Text style={styles.volumeBtnText}>Full Volume</Text>
              <Text style={styles.volumeSubText}>{volume === 1.0 ? 'Selected' : ''}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.9}>
            <Text style={styles.buttonText}>START CHALLENGE →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },

  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,     // pulls Eddy down from the top
    paddingBottom: 0,
  },

  eddyContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  eddyImage: {
    width: 170,         // slightly smaller so it never feels "outside the phone"
    height: 170,
    marginBottom: 12,
  },
  eddyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  eddySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
  },

  roundText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.82)',
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  title: {
    fontSize: 56,       // smaller to reduce overflow
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.28)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    lineHeight: 62,
  },

  messageBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  messageText: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 25,
  },

  warningBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 14,
    borderRadius: 12,
  },
  warningIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },

  bottomArea: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  volumeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  volumeBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  volumeBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  volumeSubText: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '600',
    height: 14,
  },

  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
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

