import { ParsedReminder, ReminderCategory } from "../types/reminder";

const MONTHS: Record<string, number> = {
  janvier: 0,
  février: 1,
  fevrier: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  août: 7,
  aout: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  décembre: 11,
  decembre: 11
};

const WEEKDAYS: Record<string, number> = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6
};

const CATEGORY_PATTERNS: Array<[ReminderCategory, RegExp]> = [
  ["birthday", /\banniversaire\b/i],
  ["shopping", /\b(ach[eè]te|acheter|courses?|ajoute|liste)\b/i],
  ["call", /\b(appelle|appeler|téléphone|telephon(?:e|er))\b/i],
  ["note", /\b(note|idée|idee|souviens)\b/i]
];

function normalized(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function inferCategory(text: string): ReminderCategory {
  return CATEGORY_PATTERNS.find(([, pattern]) => pattern.test(text))?.[0] ?? "task";
}

function applyTime(date: Date, text: string): Date {
  const match = text.match(
    /(?:à|a|vers)\s*(\d{1,2})(?:(?:\s*h(?:\s*(\d{1,2}))?)|(?:\s*:\s*(\d{1,2})))?\b/i
  );
  if (match) {
    const hours = Number(match[1]);
    const minutes = Number(match[2] ?? match[3] ?? 0);
    if (hours <= 23 && minutes <= 59) date.setHours(hours, minutes, 0, 0);
  } else if (/\bmatin\b/i.test(text)) {
    date.setHours(9, 0, 0, 0);
  } else if (/\b(?:midi)\b/i.test(text)) {
    date.setHours(12, 0, 0, 0);
  } else if (/\b(?:soir|ce soir)\b/i.test(text)) {
    date.setHours(19, 0, 0, 0);
  } else {
    date.setHours(9, 0, 0, 0);
  }
  return date;
}

function parseRelative(text: string, now: Date): Date | null {
  const relative = text.match(
    /\bdans\s+(\d+)\s*(minute|minutes|heure|heures|jour|jours|semaine|semaines)\b/i
  );
  if (!relative) return null;
  const value = Number(relative[1]);
  const unit = relative[2]?.toLowerCase() ?? "";
  const date = new Date(now);
  if (unit.startsWith("minute")) date.setMinutes(date.getMinutes() + value);
  if (unit.startsWith("heure")) date.setHours(date.getHours() + value);
  if (unit.startsWith("jour")) date.setDate(date.getDate() + value);
  if (unit.startsWith("semaine")) date.setDate(date.getDate() + value * 7);
  return date;
}

function parseCalendarDate(text: string, now: Date): Date | null {
  if (/\b(?:aujourd'hui|aujourdhui)\b/i.test(text)) {
    return applyTime(new Date(now), text);
  }
  if (/\bdemain\b/i.test(text)) {
    const date = new Date(now);
    date.setDate(date.getDate() + 1);
    return applyTime(date, text);
  }
  if (/\baprès-demain\b|\bapres-demain\b/i.test(text)) {
    const date = new Date(now);
    date.setDate(date.getDate() + 2);
    return applyTime(date, text);
  }

  for (const [weekday, targetDay] of Object.entries(WEEKDAYS)) {
    if (new RegExp(`\\b${weekday}\\b`, "i").test(text)) {
      const date = new Date(now);
      let delta = (targetDay - date.getDay() + 7) % 7;
      if (delta === 0) delta = 7;
      date.setDate(date.getDate() + delta);
      return applyTime(date, text);
    }
  }

  const explicit = text.match(
    /\b(?:le\s+)?(\d{1,2})(?:er)?\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)(?:\s+(\d{4}))?\b/i
  );
  if (explicit) {
    const day = Number(explicit[1]);
    const monthKey = explicit[2]?.toLowerCase() ?? "";
    const month = MONTHS[monthKey];
    if (month === undefined) return null;
    let year = explicit[3] ? Number(explicit[3]) : now.getFullYear();
    let date = new Date(year, month, day);
    if (!explicit[3] && date < now) date = new Date(year + 1, month, day);
    return applyTime(date, text);
  }
  return null;
}

function cleanTitle(text: string): string {
  const cleaned = text
    .replace(/\b(?:rappelle-moi|rappelle moi|pense à|pense a)\b/gi, "")
    .replace(/\b(?:aujourd'hui|aujourdhui|demain|après-demain|apres-demain)\b/gi, "")
    .replace(/\bdans\s+\d+\s*(?:minutes?|heures?|jours?|semaines?)\b/gi, "")
    .replace(/\b(?:ce\s+)?(?:matin|midi|soir)\b/gi, "")
    .replace(/(?:à|a|vers)\s*\d{1,2}(?:(?:\s*h(?:\s*\d{1,2})?)|(?:\s*:\s*\d{1,2}))?\b/gi, "")
    .replace(/\b(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/gi, "")
    .replace(/\b(?:le\s+)?\d{1,2}(?:er)?\s+(?:janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)(?:\s+\d{4})?\b/gi, "")
    .replace(/^[,.;:\s-]+|[,.;:\s-]+$/g, "");
  return normalized(cleaned) || normalized(text);
}

export function parseReminder(text: string, now = new Date()): ParsedReminder {
  const rawText = normalized(text);
  const dueAt =
    parseRelative(rawText, now)?.toISOString() ??
    parseCalendarDate(rawText, now)?.toISOString() ??
    null;
  return {
    rawText,
    title: cleanTitle(rawText),
    category: inferCategory(rawText),
    dueAt
  };
}
