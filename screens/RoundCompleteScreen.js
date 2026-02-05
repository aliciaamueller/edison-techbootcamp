import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoundCompleteScreen({ navigation, route }) {
  const { round } = route.params;
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Move to next round
          navigation.navigate('AlarmRinging', {
            ...route.params,
            round: round + 1,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Animate progress ring
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 300000, // 5 minutes
      useNativeDriver: false,
    }).start();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressDegree = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#0a0e27', '#1a1f3a', '#2a2f4a']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Success Checkmark */}
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Round Progress */}
        <View style={styles.progressDots}>
          {[1, 2, 3].map((dot) => (
            <View key={dot} style={styles.dotContainer}>
              <View
                style={[
                  styles.dot,
                  dot <= round && styles.dotComplete,
                  dot === round && styles.dotCurrent,
                ]}
              >
                {dot <= round && <Text style={styles.dotCheck}>✓</Text>}
              </View>
              {dot < 3 && <View style={styles.dotLine} />}
            </View>
          ))}
        </View>

        <Text style={styles.title}>Round {round} Done</Text>
        
        <Text style={styles.message}>
          {round === 2 
            ? 'Final check in 5 minutes' 
            : 'Alarm will check again in 5 minutes'}
        </Text>

        {/* Countdown Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>until next check</Text>
          </View>
          <View style={styles.timerRing} />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💤</Text>
          <Text style={styles.infoText}>
            Stay awake. The alarm will ring again to confirm you didn't fall back asleep.
          </Text>
        </View>
      </View>

      {/* Bottom Status */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Completed</Text>
          <Text style={styles.statusValue}>{round}/3</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Next Round</Text>
          <Text style={styles.statusValue}>{formatTime(timeLeft)}</Text>
        </View>
      </View>
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
  checkmarkContainer: {
    marginBottom: 40,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00FF88',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  checkmark: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0a0e27',
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotComplete: {
    backgroundColor: '#00FF88',
    borderColor: '#00FF88',
  },
  dotCurrent: {
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  dotCheck: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0a0e27',
  },
  dotLine: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -1,
  },
  message: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: '500',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    position: 'relative',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(65, 88, 208, 0.15)',
    borderWidth: 3,
    borderColor: 'rgba(65, 88, 208, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#4158D0',
    borderStyle: 'dashed',
  },
  timerText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -2,
  },
  timerLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    marginTop: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 80, 192, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200, 80, 192, 0.3)',
    borderRadius: 16,
    padding: 20,
    maxWidth: 320,
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  statusBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 30,
    marginBottom: 50,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
  },
  statusDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});