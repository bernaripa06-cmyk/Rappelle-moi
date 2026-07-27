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

const TEMPORAL_RULES: Record<string, Array<[RegExp, string]>> = {
  en: [[/\bday after tomorrow\b/gi, "après-demain"], [/\btomorrow\b/gi, "demain"], [/\btoday\b/gi, "aujourd'hui"], [/\bat\s+(?=\d)/gi, "à "], [/\bin\s+(?=\d)/gi, "dans "], [/\bminutes?\b/gi, "minutes"], [/\bhours?\b/gi, "heures"], [/\bdays?\b/gi, "jours"], [/\bweeks?\b/gi, "semaines"]],
  de: [[/\bübermorgen\b/gi, "après-demain"], [/\bmorgen\b/gi, "demain"], [/\bheute\b/gi, "aujourd'hui"], [/\bum\s+(?=\d)/gi, "à "], [/\bin\s+(?=\d)/gi, "dans "], [/\buhr\b/gi, "h"], [/\bminuten?\b/gi, "minutes"], [/\bstunden?\b/gi, "heures"], [/\btagen?\b/gi, "jours"], [/\bwochen?\b/gi, "semaines"]],
  es: [[/\bpasado mañana\b/gi, "après-demain"], [/\bmañana\b/gi, "demain"], [/\bhoy\b/gi, "aujourd'hui"], [/\ba las?\s+(?=\d)/gi, "à "], [/\ben\s+(?=\d)/gi, "dans "], [/\bminutos?\b/gi, "minutes"], [/\bhoras?\b/gi, "heures"], [/\bdías?\b/gi, "jours"], [/\bsemanas?\b/gi, "semaines"]],
  it: [[/\bdopodomani\b/gi, "après-demain"], [/\bdomani\b/gi, "demain"], [/\boggi\b/gi, "aujourd'hui"], [/\balle?\s+(?=\d)/gi, "à "], [/\b(?:tra|fra)\s+(?=\d)/gi, "dans "], [/\bminuti?\b/gi, "minutes"], [/\bore\b/gi, "heures"], [/\bgiorni?\b/gi, "jours"], [/\bsettimane?\b/gi, "semaines"]],
  pt: [[/\bdepois de amanhã\b/gi, "après-demain"], [/\bamanhã\b/gi, "demain"], [/\bhoje\b/gi, "aujourd'hui"], [/\bàs?\s+(?=\d)/gi, "à "], [/\b(?:em|daqui a)\s+(?=\d)/gi, "dans "], [/\bminutos?\b/gi, "minutes"], [/\bhoras?\b/gi, "heures"], [/\bdias?\b/gi, "jours"], [/\bsemanas?\b/gi, "semaines"]],
  nl: [[/\bovermorgen\b/gi, "après-demain"], [/\bmorgen\b/gi, "demain"], [/\bvandaag\b/gi, "aujourd'hui"], [/\bom\s+(?=\d)/gi, "à "], [/\bminuten?\b/gi, "minutes"], [/\buren?\b/gi, "heures"], [/\bdagen?\b/gi, "jours"], [/\bweken?\b/gi, "semaines"]],
  ru: [[/послезавтра/gi, "après-demain"], [/завтра/gi, "demain"], [/сегодня/gi, "aujourd'hui"], [/\bв\s+(?=\d)/gi, "à "], [/минут[уы]?/gi, "minutes"], [/час(?:а|ов)?/gi, "heures"], [/дн(?:я|ей)/gi, "jours"], [/недел(?:ю|и|ь)/gi, "semaines"], [/через\s+/gi, "dans "]],
  uk: [[/післязавтра/gi, "après-demain"], [/завтра/gi, "demain"], [/сьогодні/gi, "aujourd'hui"], [/\bо\s+(?=\d)/gi, "à "], [/хвилин(?:у|и)?/gi, "minutes"], [/годин(?:у|и)?/gi, "heures"], [/дн(?:і|ів)/gi, "jours"], [/тиж(?:день|ні)/gi, "semaines"], [/через\s+/gi, "dans "]],
  th: [[/มะรืน/gi, " après-demain "], [/พรุ่งนี้/gi, " demain "], [/วันนี้/gi, " aujourd'hui "], [/อีก\s*/gi, " dans "], [/นาที/gi, " minutes "], [/ชั่วโมง/gi, " heures "], [/วัน/gi, " jours "], [/สัปดาห์/gi, " semaines "], [/(?:เวลา|ตอน)\s*(?=\d)/gi, " à "], [/นาฬิกา/gi, " h "]],
  ar: [[/بعد غد/gi, " après-demain "], [/غد(?:اً|ا)?/gi, " demain "], [/اليوم/gi, " aujourd'hui "], [/بعد\s+/gi, " dans "], [/دقائق?|دقيقة/gi, " minutes "], [/ساعات?|ساعة/gi, " heures "], [/أيام?|يوم/gi, " jours "], [/أسابيع?|أسبوع/gi, " semaines "], [/الساعة\s*(?=\d)/gi, " à "]],
  hi: [[/परसों/gi, " après-demain "], [/कल/gi, " demain "], [/आज/gi, " aujourd'hui "], [/मिनट/gi, " minutes "], [/घंटे?/gi, " heures "], [/दिन/gi, " jours "], [/सप्ताह/gi, " semaines "], [/बजे/gi, " h "]],
  vi: [[/ngày kia/gi, "après-demain"], [/ngày mai/gi, "demain"], [/hôm nay/gi, "aujourd'hui"], [/\blúc\s+(?=\d)/gi, "à "], [/\bphút\b/gi, "minutes"], [/\bgiờ\b/gi, "heures"], [/\bngày\b/gi, "jours"], [/\btuần\b/gi, "semaines"], [/\bsau\s+/gi, "dans "]],
  id: [[/lusa/gi, "après-demain"], [/besok/gi, "demain"], [/hari ini/gi, "aujourd'hui"], [/\bpukul\s+(?=\d)/gi, "à "], [/\bmenit\b/gi, "minutes"], [/\bjam\b/gi, "heures"], [/\bhari\b/gi, "jours"], [/\bminggu\b/gi, "semaines"], [/\bdalam\s+/gi, "dans "]],
  zh: [[/后天/gi, " après-demain "], [/明天/gi, " demain "], [/今天/gi, " aujourd'hui "], [/分钟/gi, " minutes "], [/小时/gi, " heures "], [/周|星期/gi, " semaines "], [/点/gi, " h "], [/后/gi, " dans "]],
  ja: [[/明後日/gi, " après-demain "], [/明日|あした/gi, " demain "], [/今日/gi, " aujourd'hui "], [/分後/gi, " minutes "], [/時間後/gi, " heures "], [/日後/gi, " jours "], [/週間後/gi, " semaines "], [/時/gi, " h "]],
  ko: [[/모레/gi, " après-demain "], [/내일/gi, " demain "], [/오늘/gi, " aujourd'hui "], [/분 후/gi, " minutes "], [/시간 후/gi, " heures "], [/일 후/gi, " jours "], [/주 후/gi, " semaines "], [/시에?/gi, " h "]]
};

function canonicalTemporalText(text: string, locale: string): string {
  const language = locale.split(/[-_]/)[0]?.toLowerCase() || "fr";
  return (TEMPORAL_RULES[language] ?? []).reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    text
  );
}

function inferCategory(text: string): ReminderCategory {
  return CATEGORY_PATTERNS.find(([, pattern]) => pattern.test(text))?.[0] ?? "task";
}

function applyTime(date: Date, text: string): Date {
  const match = text.match(
    /(?:à|a|vers)\s*(\d{1,2})(?:(?:\s*h(?:\s*(\d{1,2}))?)|(?:\s*:\s*(\d{1,2})))?\s*(am|pm)?\b/i
  );
  if (match) {
    let hours = Number(match[1]);
    const minutes = Number(match[2] ?? match[3] ?? 0);
    const period = match[4]?.toLowerCase();
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
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

export function parseReminder(text: string, now = new Date(), locale = "fr-FR"): ParsedReminder {
  const rawText = normalized(text);
  const temporalText = normalized(canonicalTemporalText(rawText, locale));
  const dueAt =
    parseRelative(temporalText, now)?.toISOString() ??
    parseCalendarDate(temporalText, now)?.toISOString() ??
    null;
  return {
    rawText,
    title: cleanTitle(rawText),
    category: inferCategory(rawText),
    dueAt
  };
}
