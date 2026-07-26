export type ReminderCategory =
  | "call"
  | "task"
  | "birthday"
  | "shopping"
  | "note";

export type Reminder = {
  id: string;
  title: string;
  rawText: string;
  category: ReminderCategory;
  dueAt: string | null;
  completed: boolean;
  createdAt: string;
  notificationId?: string;
  timeZone: string;
};

export type ParsedReminder = Pick<
  Reminder,
  "title" | "rawText" | "category" | "dueAt"
>;
