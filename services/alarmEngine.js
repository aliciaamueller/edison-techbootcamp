// services/alarmEngine.js
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { playAlarmLoop, stopAlarmSound } from "./soundManager";
import vibrationController from "./vibrationController";

// ✅ Ensure notifications show even in foreground (for demo credibility)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // sound will be handled in-app (Expo limitation)
    shouldSetBadge: false,
  }),
});

export async function initNotifications() {
  try {
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
  } catch (err) {
    console.warn("[alarmEngine] initNotifications failed:", err);
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

  const trigger = {
    type: Notifications.SchedulableTriggerInputTypes.DATE, // SDK 54 requires this
    date: target,
    ...(Platform.OS === "android" ? { channelId: "edison-alarm" } : {}),
  };

  console.log("[Notifications] scheduling", { targetDate: target.toISOString(), trigger });

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: "ALARM_TRIGGER" },
        ...(Platform.OS === "android" ? { channelId: "edison-alarm" } : {}),
      },
      trigger,
    });
    return { id, scheduledFor: target.toISOString() };
  } catch (err) {
    console.warn("[alarmEngine] Failed to schedule notification. Trigger object:", trigger, err);
    // Return null ID instead of throwing so flow continues
    return { id: null, scheduledFor: target.toISOString() };
  }
}

export async function cancelAlarmNotification(notificationId) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function startRinging({ musicGenre, volume = 1.0 }) {
  // vibration + in-app sound loop
  console.log("[AUDIO] start ringing", { volume, musicGenre });
  vibrationController.startAlarm();
  await playAlarmLoop(musicGenre || "energetic", volume);
}

/**
 * Loud ringing for initial wake screen
 */
export async function startAlarmRinging({ musicGenre }) {
  console.log("[AUDIO] start alarm ringing (loud)");
  return startRinging({ musicGenre, volume: 1.0 });
}

/**
 * Low volume ringing while performing tasks
 */
export async function startTaskRinging({ musicGenre }) {
  console.log("[AUDIO] start task ringing (low volume)");
  return startRinging({ musicGenre, volume: 0.25 });
}

export async function stopRinging() {
  console.log("[AUDIO] stop ringing");
  vibrationController.stop();
  await stopAlarmSound();
}

export function addNotificationTapListener(onTap) {
  // Fires when user taps notification
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response?.notification?.request?.content?.data || {};
    onTap?.(data);
  });
}
