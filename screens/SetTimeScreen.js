import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SetTimeScreen({ navigation }) {
  const [time, setTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);

  const days = [
    { short: 'M', full: 'Mon' },
    { short: 'T', full: 'Tue' },
    { short: 'W', full: 'Wed' },
    { short: 'T', full: 'Thu' },
    { short: 'F', full: 'Fri' },
    { short: 'S', full: 'Sat' },
    { short: 'S', full: 'Sun' },
  ];

  const toggleDay = (index) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return { hours: displayHours, minutes: displayMinutes, ampm };
  };

  const timeDisplay = formatTime(time);

  return (
    <LinearGradient
      colors={['#0a0e27', '#1a1f3a', '#2a2f4a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 1 of 3</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>When do you{'\n'}want to wake?</Text>
        
        {/* Large Time Display */}
        <View style={styles.timeDisplayContainer}>
          <View style={styles.timeDisplay}>
            <Text style={styles.timeNumber}>{timeDisplay.hours}</Text>
            <Text style={styles.timeSeparator}>:</Text>
            <Text style={styles.timeNumber}>{timeDisplay.minutes}</Text>
            <Text style={styles.timeAmPm}>{timeDisplay.ampm}</Text>
          </View>
          <View style={styles.glowEffect} />
        </View>

        {/* iOS Time Picker */}
        <DateTimePicker
          value={time}
          mode="time"
          display="spinner"
          onChange={(event, selectedTime) => {
            if (selectedTime) setTime(selectedTime);
          }}
          textColor="#ffffff"
          style={styles.picker}
        />

        {/* Days Selector */}
        <View style={styles.daysSection}>
          <Text style={styles.daysLabel}>Repeat on</Text>
          <View style={styles.daysContainer}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  selectedDays.includes(index) && styles.dayButtonActive
                ]}
                onPress={() => toggleDay(index)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDays.includes(index) && styles.dayTextActive
                ]}>
                  {day.short}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity 
        style={[styles.nextButton, selectedDays.length === 0 && styles.nextButtonDisabled]}
        onPress={() => {
          if (selectedDays.length > 0) {
            navigation.navigate('Reason', { time, days: selectedDays });
          }
        }}
        activeOpacity={0.9}
        disabled={selectedDays.length === 0}
      >
        <LinearGradient
          colors={selectedDays.length > 0 ? ['#4158D0', '#C850C0'] : ['#555', '#666']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.nextGradient}
        >
          <Text style={styles.nextText}>Next</Text>
          <Text style={styles.nextArrow}>→</Text>
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
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 40,
    lineHeight: 50,
    letterSpacing: -1,
  },
  timeDisplayContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(65, 88, 208, 0.15)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(65, 88, 208, 0.3)',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: 'rgba(65, 88, 208, 0.2)',
    shadowColor: '#4158D0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    zIndex: -1,
  },
  timeNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -2,
  },
  timeSeparator: {
    fontSize: 72,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 5,
  },
  timeAmPm: {
    fontSize: 28,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 10,
  },
  picker: {
    height: 150,
  },
  daysSection: {
    marginTop: 40,
    marginBottom: 40,
  },
  daysLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#4158D0',
    borderColor: '#4158D0',
  },
  dayText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#ffffff',
  },
  nextButton: {
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
  nextButtonDisabled: {
    shadowOpacity: 0,
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
    fontWeight: '300',
  },
});