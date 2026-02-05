import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SuccessScreen({ navigation, route }) {
  const { userName } = route.params;
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Victory animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <LinearGradient
      colors={['#0a0e27', '#1a2f3a', '#0a4a3a']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.successIconContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>🎉</Text>
          </View>
          <View style={styles.glowRing} />
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.title}>You're Confirmed</Text>
          <Text style={styles.titleHighlight}>Awake</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          style={[
            styles.statsContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.statBox}>
            <Text style={styles.statValue}>3/3</Text>
            <Text style={styles.statLabel}>Rounds Complete</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentTime}</Text>
            <Text style={styles.statLabel}>Fully Awake</Text>
          </View>
        </Animated.View>

        {/* Message */}
        <Animated.View
          style={[
            styles.messageContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.message}>
            Great job, {userName}! {'\n'}
            You've proven you're awake three times.
          </Text>
          <Text style={styles.submessage}>
            Your alarm is fully disarmed.
          </Text>
        </Animated.View>

        {/* Achievement Badge */}
        <Animated.View
          style={[
            styles.badgeContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>⚡</Text>
            <Text style={styles.badgeText}>State Change Confirmed</Text>
          </View>
        </Animated.View>
      </View>

      {/* Start Day Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Welcome')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00D4AA', '#00FFB3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startGradient}
          >
            <Text style={styles.startText}>Start Your Day</Text>
            <Text style={styles.startArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Alarm will be ready for your next wake-up
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  successIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00FF88',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    zIndex: 2,
  },
  successIcon: {
    fontSize: 64,
  },
  glowRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#00FF88',
    opacity: 0.3,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -1,
  },
  titleHighlight: {
    fontSize: 56,
    fontWeight: '900',
    color: '#00FF88',
    letterSpacing: -2,
    textShadowColor: '#00FF88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  message: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
    marginBottom: 12,
  },
  submessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeContainer: {
    marginTop: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  badgeIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00FF88',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  startText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0a0e27',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  startArrow: {
    fontSize: 24,
    color: '#0a0e27',
    fontWeight: '300',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    textAlign: 'center',
  },
});