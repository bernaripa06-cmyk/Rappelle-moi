import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function requestNotificationPermission(): Promise<void> {
  const current = await Notifications.getPermissionsAsync();
  if (!current.granted) await Notifications.requestPermissionsAsync();
}

export async function scheduleReminder(title: string, dueAt: string): Promise<string | undefined> {
  const date = new Date(dueAt);
  if (date.getTime() <= Date.now()) return undefined;
  return Notifications.scheduleNotificationAsync({
    content: { title: "Rappelle-moi", body: title, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date }
  });
}

export async function cancelReminder(notificationId?: string): Promise<void> {
  if (notificationId) await Notifications.cancelScheduledNotificationAsync(notificationId);
}
