import { format, formatDistanceToNow as dateFnsformatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export function formatDatetime(rawDate: string): string {
    const date = new Date(rawDate);

    return format(date, "MM/dd/yyyy 'at' HH'h'mm", {
        locale: enUS,
    });
}

export function formatDatetimeUtc(rawDate: string): string {
    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
        throw new RangeError("Invalid time value");
    }

    const pad = (value: number) => String(value).padStart(2, "0");

    return `${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}/${date.getUTCFullYear()} at ${pad(date.getUTCHours())}h${pad(date.getUTCMinutes())}`;
}

export function formatDistanceToNow(rawDate: string): string {
    const date = new Date(rawDate);

    return dateFnsformatDistanceToNow(date, {
        locale: enUS,
        addSuffix: true,
    });
}

export function formatHour(timestampMs: number): string {
  const date = new Date(timestampMs);

  return format(date, 'HH:mm:ss', {
    locale: enUS,
  });
}

export function formatCurrentHour(): string {
  return formatHour(Date.now());
}