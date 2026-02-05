import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export default function AlarmRingingScreen({ navigation, route }) {
  const { userName, reason, round, proofMethod, musicGenre, aiPersonality } = route.params;
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));
  const [currentMessage, setCurrentMessage] = useState('');
  const soundRef = useRef(null);
  const speechIntervalRef = useRef(null);

  // AI Message Generator
  const generateAIMessage = () => {
    const messages = {
      'sassy': [
        `Wake up ${userName}! Your bed called - it says you've overstayed your welcome!`,
        `Rise and shine ${userName}! Time to stop dreaming about ${reason} and actually DO IT!`,
        `${userName}, sleeping beauty called - she wants her title back. Get moving!`,
        `Hey ${userName}! The snooze button is NOT your friend. ${reason} is waiting!`,
      ],
      'motivational': [
        `GOOD MORNING ${userName}! Today is YOUR day to crush ${reason}!`,
        `Rise up ${userName}! Champions don't sleep in - they show up for ${reason}!`,
        `${userName}, you're ONE decision away from greatness. Starting with ${reason}. LET'S GO!`,
        `Wake up warrior ${userName}! ${reason} isn't going to conquer itself!`,
      ],
      'drill-sergeant': [
        `UP NOW ${userName}! Drop and give me ${reason}! MOVE MOVE MOVE!`,
        `${userName}! This is NOT a drill! You signed up for ${reason}. NO EXCUSES!`,
        `ON YOUR FEET ${userName}! ${reason} waits for NO ONE! HUSTLE!`,
        `${userName}! I don't want to hear excuses! ${reason} - NOW!`,
      ],
      'zen': [
        `Good morning ${userName}. Today brings the gift of ${reason}. Breathe and begin.`,
        `${userName}, the sunrise awaits your presence. ${reason} is your meditation today.`,
        `Rise peacefully ${userName}. ${reason} is not a task, but an opportunity for growth.`,
        `${userName}, your journey continues with ${reason}. Welcome the day with open arms.`,
      ],
    };

    const personalityMessages = messages[aiPersonality] || messages['motivational'];
    const randomMessage = personalityMessages[Math.floor(Math.random() * personalityMessages.length)];
    return randomMessage;
  };

  const getPersonalitySettings = () => {
    const settings = {
      'zen': {
        soundVolume: 0.08, // Very quiet background
        speechPitch: 0.9,
        speechRate: 0.75,
        vibrationPattern: [1500, 2000],
        speechInterval: 15000,
      },
      'sassy': {
        soundVolume: 0.12,
        speechPitch: 1.2,
        speechRate: 1.1,
        vibrationPattern: [700, 800],
        speechInterval: 10000,
      },
      'motivational': {
        soundVolume: 0.15,
        speechPitch: 1.1,
        speechRate: 1.0,
        vibrationPattern: [800, 700],
        speechInterval: 12000,
      },
      'drill-sergeant': {
        soundVolume: 0.20, // Louder for drill sergeant
        speechPitch: 1.4,
        speechRate: 1.3,
        vibrationPattern: [500, 500],
        speechInterval: 8000,
      },
    };

    return settings[aiPersonality] || settings['motivational'];
  };

  const getMusicGenreUrl = () => {
    const genreUrls = {
      'energetic': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
      'calm': 'https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3',
      'rock': 'https://www.soundjay.com/misc/sounds/bell-ringing-04.mp3',
      'electronic': 'https://www.soundjay.com/misc/sounds/bell-ringing-03.mp3',
    };

    return genreUrls[musicGenre] || genreUrls['energetic'];
  };

  const playAlarmSound = async () => {
    const personality = getPersonalitySettings();
    
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true, // Lower music volume when speech plays
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false,
      });

      // Background alarm sound - VERY QUIET (8-20% volume)
      const { sound } = await Audio.Sound.createAsync(
        { uri: getMusicGenreUrl() },
        { 
          shouldPlay: true,
          isLooping: true,
          volume: personality.soundVolume, // 8-20% volume - just background ambiance
        }
      );
      
      soundRef.current = sound;
    } catch (error) {
      console.log('Error loading sound:', error);
    }
  };

  const speakMessage = (message, personality) => {
    // Stop any current speech
    Speech.stop();
    
    // Speak the message at MAXIMUM VOLUME
    Speech.speak(message, {
      language: 'en-US',
      pitch: personality.speechPitch,
      rate: personality.speechRate,
      volume: 1.0, // MAXIMUM VOLUME - this is the main alarm
      onDone: () => {
        console.log('Speech completed');
      },
      onError: (error) => {
        console.log('Speech error:', error);
      }
    });
  };

  useEffect(() => {
    const message = generateAIMessage();
    setCurrentMessage(message);
    const personality = getPersonalitySettings();

    // Start QUIET background music based on genre
    playAlarmSound();

    // Start vibration (personality-based)
    Vibration.vibrate(personality.vibrationPattern, true);

    // SPEAK MESSAGE IMMEDIATELY AT FULL VOLUME
    setTimeout(() => {
      speakMessage(message, personality);
    }, 500);
    
    // LOOP THE AI VOICE MESSAGE (this is the main alarm, not the music)
    speechIntervalRef.current = setInterval(() => {
      speakMessage(message, personality);
    }, personality.speechInterval);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: aiPersonality === 'zen' ? 1.05 : 1.15,
          duration: aiPersonality === 'zen' ? 1200 : 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: aiPersonality === 'zen' ? 1200 : 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: aiPersonality === 'zen' ? 2000 : 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: aiPersonality === 'zen' ? 2000 : 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      // Cleanup handled by navigation
    };
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const getBackgroundColors = () => {
    const colors = {
      'zen': ['#0a1a2e', '#1a2f4a', '#2a4a6a'],
      'sassy': ['#2e0a2e', '#4a1a4a', '#6a2a6a'],
      'motivational': ['#1a0a2e', '#3d0a4e', '#6b1a6b'],
      'drill-sergeant': ['#2e0a0a', '#4e1a1a', '#6b2a2a'],
    };
    return colors[aiPersonality] || colors['motivational'];
  };

  return (
    <LinearGradient
      colors={getBackgroundColors()}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.glowBackground,
          { opacity: glowOpacity }
        ]}
      />

      <View style={styles.content}>
        <View style={styles.roundIndicator}>
          <View style={styles.roundDots}>
            {[1, 2, 3].map((dot) => (
              <View
                key={dot}
                style={[
                  styles.roundDot,
                  dot <= round && styles.roundDotActive
                ]}
              />
            ))}
          </View>
          <Text style={styles.roundText}>Round {round} of 3</Text>
        </View>

        <Animated.View
          style={[
            styles.titleContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Text style={styles.mainTitle}>
            {aiPersonality === 'zen' ? 'AWAKEN' : 'WAKE UP'}
          </Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        <View style={styles.alarmStatus}>
          <Text style={styles.alarmIcon}>🎙</Text>
          <Text style={styles.alarmText}>VOICE ALARM LOOPING</Text>
        </View>

        <View style={styles.personalityBadge}>
          <Text style={styles.personalityText}>
            {aiPersonality.toUpperCase()} • {musicGenre.toUpperCase()}
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <View style={styles.speakerIcon}>
            <Text style={styles.speakerEmoji}>💬</Text>
          </View>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>"{currentMessage}"</Text>
            <View style={styles.loopingIndicator}>
              <Animated.View style={[styles.pulsingDot, { opacity: glowAnim }]} />
              <Text style={styles.loopingText}>
                Voice repeating every {aiPersonality === 'zen' ? '15' : aiPersonality === 'drill-sergeant' ? '8' : '10-12'}s
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            AI voice at max volume (with quiet {musicGenre} background).{'\n'}
            Complete task to stop.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.proveButton}
        onPress={() => {
          navigation.navigate('ProofTask', {
            ...route.params,
            alarmSound: soundRef.current,
            speechInterval: speechIntervalRef.current,
            currentMessage: currentMessage,
            personalitySettings: getPersonalitySettings(),
          });
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={aiPersonality === 'zen' ? ['#4158D0', '#7B68EE'] : ['#FF0080', '#FF8C00', '#FF0080']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.proveGradient}
        >
          <Text style={styles.proveText}>START PROOF TASK</Text>
          <Text style={styles.proveArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.bottomInfo}>
        <Text style={styles.bottomInfoText}>
          🔊 LOUD AI VOICE • quiet {musicGenre} music • vibration
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowBackground: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    height: 300,
    backgroundColor: '#FF0080',
    borderRadius: 150,
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 100,
    zIndex: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    zIndex: 1,
  },
  roundIndicator: {
    alignItems: 'center',
    marginBottom: 30,
  },
  roundDots: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  roundDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  roundDotActive: {
    backgroundColor: '#FF0080',
    borderColor: '#FF0080',
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  roundText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 72,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -3,
    textShadowColor: '#FF0080',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  titleUnderline: {
    width: 120,
    height: 5,
    backgroundColor: '#FF0080',
    marginTop: 12,
    borderRadius: 3,
  },
  alarmStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 128, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FF0080',
  },
  alarmIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  alarmText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  personalityBadge: {
    backgroundColor: 'rgba(65, 88, 208, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  personalityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  speakerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  speakerEmoji: {
    fontSize: 24,
  },
  messageBubble: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 20,
  },
  messageText: {
    fontSize: 17,
    color: '#ffffff',
    lineHeight: 25,
    fontWeight: '600',
    marginBottom: 14,
  },
  loopingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF88',
    marginRight: 8,
  },
  loopingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 140, 0, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 140, 0, 0.6)',
    borderRadius: 12,
    padding: 16,
    maxWidth: 340,
  },
  warningIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 19,
    fontWeight: '700',
  },
  proveButton: {
    marginHorizontal: 30,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
    zIndex: 2,
  },
  proveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    paddingHorizontal: 30,
  },
  proveText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginRight: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  proveArrow: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '300',
  },
  bottomInfo: {
    alignItems: 'center',
    paddingBottom: 20,
    zIndex: 2,
  },
  bottomInfoText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});