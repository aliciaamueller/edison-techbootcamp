import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AlarmSetScreen({ navigation, route }) {
  const params = route.params || {};
  const { userName, reason, proofMethod } = params;
  
  // Format time properly (might be a Date object)
  const formatTime = () => {
    if (params.time) {
      if (typeof params.time === 'string') {
        return params.time;
      }
      // If it's a Date object
      if (params.time instanceof Date) {
        return params.time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      }
    }
    return '7:00 AM';
  };

  const timeString = formatTime();

  // Auto-navigate to AlarmRinging after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('AlarmRinging', {
        ...params,
        time: timeString, // Pass as string
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#0a0e27', '#1a1f3a', '#2a2f4a']} style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✅</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Alarm Set!</Text>

        {/* Details */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{timeString}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reason:</Text>
            <Text style={styles.detailValue}>{reason || 'Wake up'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Challenge:</Text>
            <Text style={styles.detailValue}>
              {proofMethod === 'steps' ? 'Walk Steps' : 'Hand Wave'}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Your alarm will ring in 3 seconds for testing...
          </Text>
        </View>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('AlarmRinging', {
            ...params,
            time: timeString,
          })}
        >
          <Text style={styles.skipText}>Skip to Alarm →</Text>
        </TouchableOpacity>
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 40,
    letterSpacing: -1,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(65, 88, 208, 0.15)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    lineHeight: 20,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    color: '#4158D0',
    fontWeight: '600',
  },
});