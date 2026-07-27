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
  let locale = "fr-FR";
  let timeZone = "UTC";
  let uses24HourClock = true;

  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions();
    locale = resolved.locale || locale;
    timeZone = resolved.timeZone || timeZone;

    const formatter = new Intl.DateTimeFormat(locale, { hour: "numeric" });
    if (typeof formatter.formatToParts === "function") {
      uses24HourClock = !formatter
        .formatToParts(new Date(2026, 0, 1, 13))
        .some((part) => part.type === "dayPeriod");
    }
  } catch {
    // Keep safe defaults on older Android devices.
  }

  return {
    locale,
    language: locale.split(/[-_]/)[0]?.toLowerCase() || "fr",
    country: detectCountry(locale),
    timeZone,
    uses24HourClock
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
