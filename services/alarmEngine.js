// services/alarmEngine.js
import * as Notifications from "expo-notifications";
import { Platform, Vibration } from "react-native";
import { playAlarmLoop, stopAlarmSound } from "./soundManager";

// ✅ Ensure notifications show even in foreground (for demo credibility)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // sound will be handled in-app (Expo limitation)
    shouldSetBadge: false,
  }),
});

export async function initNotifications() {
  // Request permission
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notifications permission not granted.");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("edison-alarm", {
      name: "Edison Alarm",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [1000, 500, 1000],
      lightColor: "#FF231F7C",
      sound: undefined, // managed limitation
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

export async function scheduleAlarmNotification({ time, title = "Edison Alarm", body = "Tap to start wake verification." }) {
  // time is a Date
  const now = new Date();
  const target = new Date(time);

  // if in past, schedule next day
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const seconds = Math.max(1, Math.floor((target.getTime() - now.getTime()) / 1000));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: "ALARM_TRIGGER" },
      ...(Platform.OS === "android" ? { channelId: "edison-alarm" } : {}),
    },
    trigger: { seconds },
  });

  return { id, scheduledFor: target.toISOString() };
}

export async function cancelAlarmNotification(notificationId) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function startRinging({ musicGenre }) {
  // vibration + in-app sound loop
  Vibration.vibrate([1000, 500], true);
  await playAlarmLoop(musicGenre || "energetic", 1.0);
}

export async function stopRinging() {
  Vibration.cancel();
  await stopAlarmSound();
}

export function addNotificationTapListener(onTap) {
  // Fires when user taps notification
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response?.notification?.request?.content?.data || {};
    onTap?.(data);
  });
}
