import { Pressable, StyleSheet, Text, View } from "react-native";
import { Reminder, ReminderCategory } from "../types/reminder";
import { formatLocalDate, getDeviceContext } from "../lib/device";
import { Messages } from "../lib/i18n";

const COLORS: Record<ReminderCategory, string> = {
  call: "#1976D2",
  task: "#E56A43",
  birthday: "#9A5BD7",
  shopping: "#2D936C",
  note: "#6A6A72"
};

type Props = {
  messages: Messages;
  reminder: Reminder;
  onToggle: (id: string) => void;
};

export function ReminderCard({ messages, reminder, onToggle }: Props) {
  const date = reminder.dueAt
    ? formatLocalDate(reminder.dueAt, getDeviceContext())
    : messages.noDate;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: reminder.completed }}
      onPress={() => onToggle(reminder.id)}
      style={[styles.card, reminder.completed && styles.completedCard]}
    >
      <View style={[styles.dot, { backgroundColor: COLORS[reminder.category] }]} />
      <View style={styles.content}>
        <Text style={[styles.title, reminder.completed && styles.completedText]}>
          {reminder.title}
        </Text>
        <Text style={styles.meta}>
          {messages.categories[reminder.category]} · {date}
        </Text>
      </View>
      <View style={[styles.check, reminder.completed && styles.checked]}>
        <Text style={styles.checkmark}>{reminder.completed ? "✓" : ""}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
    shadowColor: "#162035",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2
  },
  completedCard: { opacity: 0.55 },
  dot: { borderRadius: 6, height: 12, marginRight: 14, width: 12 },
  content: { flex: 1 },
  title: { color: "#172033", fontSize: 17, fontWeight: "700" },
  completedText: { textDecorationLine: "line-through" },
  meta: { color: "#7C8290", fontSize: 12, fontWeight: "700", marginTop: 5 },
  check: {
    alignItems: "center",
    borderColor: "#D7DAE0",
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  checked: { backgroundColor: "#172033", borderColor: "#172033" },
  checkmark: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" }
});
