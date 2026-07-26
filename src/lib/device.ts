export type DeviceContext = {
  locale: string;
  language: string;
  country: string | null;
  timeZone: string;
  uses24HourClock: boolean;
};

function detectCountry(locale: string): string | null {
  const match = locale.replace("_", "-").match(/-([A-Z]{2}|\d{3})\b/i);
  return match?.[1]?.toUpperCase() ?? null;
}

export function getDeviceContext(): DeviceContext {
  const resolved = Intl.DateTimeFormat().resolvedOptions();
  const locale = resolved.locale || "fr-FR";
  const hourParts = new Intl.DateTimeFormat(locale, { hour: "numeric" })
    .formatToParts(new Date(2026, 0, 1, 13))
    .map((part) => part.type);

  return {
    locale,
    language: locale.split(/[-_]/)[0]?.toLowerCase() || "fr",
    country: detectCountry(locale),
    timeZone: resolved.timeZone || "UTC",
    uses24HourClock: !hourParts.includes("dayPeriod")
  };
}

export function formatLocalDate(isoDate: string, context = getDeviceContext()): string {
  return new Intl.DateTimeFormat(context.locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: !context.uses24HourClock,
    timeZone: context.timeZone
  }).format(new Date(isoDate));
}
