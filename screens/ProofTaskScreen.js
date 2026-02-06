import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';
import * as Speech from 'expo-speech';

export default function ProofTaskScreen({ navigation, route }) {
  const { proofMethod, round, userName } = route.params;
  
  const requiredSteps = {
    1: 30,
    2: 15,
    3: 5,
  };
  
  const [steps, setSteps] = useState(0);
  const [progressAnim] = useState(new Animated.Value(0));
  const required = requiredSteps[round];

  useEffect(() => {
    let lastY = 0;
    let stepCount = 0;

    const subscription = Accelerometer.addListener(({ y }) => {
      if (Math.abs(y - lastY) > 0.3) {
        stepCount++;
        setSteps((prev) => {
          const newSteps = Math.min(prev + 1, required);
          Vibration.vibrate(50);
          return newSteps;
        });
      }
      lastY = y;
    });

    Accelerometer.setUpdateInterval(200);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: steps / required,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (steps >= required) {
      Vibration.vibrate([100, 100, 100]);
      Speech.speak(`Great job ${userName}! Challenge complete!`);
      
      setTimeout(() => {
        if (round < 3) {
          navigation.navigate('RoundComplete', route.params);
        } else {
          navigation.navigate('Success', route.params);
        }
      }, 1500);
    }
  }, [steps]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient colors={['#4158D0', '#C850C0']} style={styles.container}>
      <View style={styles.content}>
        {/* Eddy Running */}
        <View style={styles.eddyContainer}>
          <Text style={styles.eddyIcon}>🏃</Text>
          <Text style={styles.eddyName}>Eddy is Moving!</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Walk {required} Steps</Text>
        <Text style={styles.subtitle}>Round {round} of 3</Text>

        {/* Counter */}
        <View style={styles.counterBox}>
          <Text style={styles.counter}>{steps}</Text>
          <Text style={styles.counterSlash}>/</Text>
          <Text style={styles.counterGoal}>{required}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((steps / required) * 100)}%
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionIcon}>👟</Text>
          <Text style={styles.instructionText}>
            {steps < required
              ? 'Keep walking around!'
              : 'Perfect! Completing...'}
          </Text>
        </View>
      </View>
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
  eddyIcon: { fontSize: 100 },
  eddyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 40,
    fontWeight: '600',
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 40,
  },
  counter: {
    fontSize: 80,
    fontWeight: '900',
    color: '#ffffff',
  },
  counterSlash: {
    fontSize: 40,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 10,
  },
  counterGoal: {
    fontSize: 50,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FF88',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 16,
  },
  instructionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  instructionText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
  },
});