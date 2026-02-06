import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProofMethodScreen({ navigation, route }) {
  const [selectedMethod, setSelectedMethod] = useState('steps');

  const methods = [
    { id: 'steps', icon: '👟', name: 'Walk Steps', desc: 'Take 30 steps' },
    { id: 'camera', icon: '📸', name: 'Hand Wave', desc: 'Wave at camera' },
  ];

  return (
    <LinearGradient colors={['#0a0e27', '#1a1f3a', '#2a2f4a']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 3 of 4</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>How do you want{'\n'}to prove you're awake?</Text>

        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardActive,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDesc}>{method.desc}</Text>
            </View>
            <View
              style={[
                styles.radio,
                selectedMethod === method.id && styles.radioActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => {
          console.log('✅ Navigating to AlarmSet with proofMethod:', selectedMethod);
          navigation.navigate('AlarmSet', { 
            ...route.params, 
            proofMethod: selectedMethod,
            round: 1, // Start at round 1
          });
        }}
      >
        <LinearGradient
          colors={['#4158D0', '#C850C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.nextGradient}
        >
          <Text style={styles.nextText}>Continue</Text>
          <Text style={styles.nextArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  },
  stepIndicator: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 30,
    lineHeight: 44,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  methodCardActive: {
    borderColor: '#4158D0',
    backgroundColor: 'rgba(65, 88, 208, 0.1)',
  },
  methodIcon: {
    fontSize: 48,
    marginRight: 20,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  radioActive: {
    borderColor: '#4158D0',
    backgroundColor: '#4158D0',
  },
  nextButton: {
    marginHorizontal: 30,
    marginBottom: 50,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  nextText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 10,
  },
  nextArrow: {
    fontSize: 24,
    color: '#ffffff',
  },
});