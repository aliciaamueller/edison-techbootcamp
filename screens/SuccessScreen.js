import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

export default function SuccessScreen({ navigation }) {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Eddy pops in
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={['#00FF88', '#00D9FF', '#7B68EE']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Eddy Celebrating */}
        <Animated.View style={[styles.eddyContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Image
            source={require('../assets/eddy/eddy-celebrating.png')}
            style={styles.eddyImage}
            contentFit="contain"
          />
          <Text style={styles.eddyName}>Eddy's lightbulb is ON!</Text>
          <Text style={styles.eddySubtext}>💡 Thomas Edison would be proud!</Text>
        </Animated.View>

        <Text style={styles.title}>Mission{'\n'}Complete!</Text>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            You powered through! 🎉{'\n'}
            Time to conquer the day!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
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
  eddyImage: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  eddyName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  eddySubtext: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 64,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 28,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  messageText: {
    fontSize: 19,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 45,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#00FF88',
    letterSpacing: 0.5,
  },
});