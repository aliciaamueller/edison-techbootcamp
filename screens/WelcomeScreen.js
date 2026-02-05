import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#0a0e27', '#1a1f3a', '#2a2f4a']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Icon Area */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>⚡</Text>
          </View>
        </View>

        {/* Main Headline */}
        <Text style={styles.mainTitle}>Edison</Text>
        <Text style={styles.tagline}>Turn waking up into a confirmed state</Text>

        {/* Core Promise */}
        <View style={styles.promiseContainer}>
          <View style={styles.promiseLine} />
          <Text style={styles.promiseText}>
            This alarm checks if you're actually awake.{'\n'}
            Not just once. Three times.
          </Text>
          <View style={styles.promiseLine} />
        </View>

        {/* Feature Pills */}
        <View style={styles.featuresContainer}>
          <View style={styles.featurePill}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Can't snooze</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Triple verification</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featureIcon}>🧠</Text>
            <Text style={styles.featureText}>Smart confirmation</Text>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <TouchableOpacity 
        style={styles.ctaButton}
        onPress={() => navigation.navigate('SetTime')}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#4158D0', '#C850C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>Set Up Alarm</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(65, 88, 208, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(65, 88, 208, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 50,
  },
  mainTitle: {
    fontSize: 56,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -2,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '400',
  },
  promiseContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  promiseLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 20,
  },
  promiseText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  ctaButton: {
    marginHorizontal: 30,
    marginBottom: 50,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4158D0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  ctaText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 10,
  },
  ctaArrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
  },
});