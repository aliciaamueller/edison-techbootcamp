// services/soundManager.js
import { Audio } from "expo-av";

let currentSound = null;

const SOUND_MAP = {
  energetic: require("../assets/sounds/energetic.mp3"),
  calm: require("../assets/sounds/calm.mp3"),
  rock: require("../assets/sounds/rock.mp3"),
  electronic: require("../assets/sounds/electronic.mp3"),
};

export async function ensureAudioMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: false, // Expo managed limitation
    playsInSilentModeIOS: true,
    shouldDuckAndroid: false,
    playThroughEarpieceAndroid: false,
  });
}

export async function playAlarmLoop(genre = "energetic", volume = 1.0) {
  await ensureAudioMode();

  // Stop any previous sound
  await stopAlarmSound();

  const source = SOUND_MAP[genre] || SOUND_MAP.energetic;

  const { sound } = await Audio.Sound.createAsync(source, {
    isLooping: true,
    volume,
    shouldPlay: true,
  });

  currentSound = sound;
  await currentSound.playAsync();
}

export async function setAlarmVolume(volume = 1.0) {
  if (!currentSound) return;
  await currentSound.setVolumeAsync(volume);
}

export async function stopAlarmSound() {
  if (!currentSound) return;
  try {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
  } finally {
    currentSound = null;
  }
}
