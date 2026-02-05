import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProofMethodScreen({ navigation, route }) {
  const [selectedMethod, setSelectedMethod] = useState('steps');

  const methods = [
    {
      id: 'steps',
      icon: '👟',
      title: 'Walk 30 Steps',
      subtitle: 'Uses motion sensors only',
      description: 'Your phone tracks movement to confirm you\'re up and walking',
      features: ['No camera required', 'Privacy-first', 'Works anywhere'],
      default: true,
    },
    {
      id: 'camera',
      icon: '📸',
      title: 'Camera Movement',
      subtitle: 'On-device only, not saved',
      description: 'Complete simple physical tasks like jumping jacks',
      features: ['Processed locally', 'Never stored', 'More engaging'],
      default: false,
    },
  ];

  return (
    <LinearGradient
      colors={['#0a0e27', '#1a1f3a', '#2a2f4a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 3 of 3</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>How will you{'\n'}prove it?</Text>
        
        <Text style={styles.subtitle}>
          Choose how the alarm confirms you're awake
        </Text>

        {/* Method Cards */}
        <View style={styles.methodsContainer}>
          {methods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardActive
              ]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.9}
            >
              <View style={styles.methodHeader}>
                <View style={styles.methodIconContainer}>
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                </View>
                <View style={styles.methodHeaderText}>
                  <View style={styles.methodTitleRow}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    {method.default && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>
              </View>

              <Text style={styles.methodDescription}>{method.description}</Text>

              <View style={styles.featuresContainer}>
                {method.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {selectedMethod === method.id && (
                <View style={styles.selectedIndicator}>
                  <LinearGradient
                    colors={['#4158D0', '#C850C0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.selectedGradient}
                  >
                    <Text style={styles.selectedText}>✓ Selected</Text>
                  </LinearGradient>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            You'll complete this task 3 times: once immediately, then twice more at 5-minute intervals to confirm you stay awake.
          </Text>
        </View>
      </ScrollView>

      {/* Activate Button */}
      <TouchableOpacity 
        style={styles.activateButton}
        onPress={() => {
          navigation.navigate('AlarmRinging', {
            ...route.params,
            proofMethod: selectedMethod,
            round: 1,
          });
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#4158D0', '#C850C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.activateGradient}
        >
          <Text style={styles.activateText}>Activate Alarm</Text>
          <Text style={styles.activateIcon}>⚡</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '300',
  },
  stepIndicator: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingBottom: 120,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 50,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 32,
    lineHeight: 24,
  },
  methodsContainer: {
    gap: 20,
  },
  methodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  methodCardActive: {
    borderColor: '#4158D0',
    backgroundColor: 'rgba(65, 88, 208, 0.1)',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  methodIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodIcon: {
    fontSize: 28,
  },
  methodHeaderText: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  methodTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  defaultBadge: {
    backgroundColor: 'rgba(65, 88, 208, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4158D0',
    letterSpacing: 0.5,
  },
  methodSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  methodDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheck: {
    fontSize: 16,
    color: '#4158D0',
    marginRight: 10,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  selectedIndicator: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedGradient: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(200, 80, 192, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200, 80, 192, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  activateButton: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    right: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4158D0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  activateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  activateText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  activateIcon: {
    fontSize: 24,
  },
});