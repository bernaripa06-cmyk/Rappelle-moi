import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reminder } from "../types/reminder";

const KEY = "rappelle-moi/reminders/v1";

export async function loadReminders(): Promise<Reminder[]> {
  const value = await AsyncStorage.getItem(KEY);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Array<Reminder & { timeZone?: string }>;
    let timeZone = "UTC";
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || timeZone;
    } catch {
      // Keep the safe default on older Android devices.
    }
    return parsed.map((item) => ({ ...item, timeZone: item.timeZone ?? timeZone }));
  } catch {
    return [];
  }
}

export async function saveReminders(reminders: Reminder[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(reminders));
}
