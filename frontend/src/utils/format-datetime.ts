import { format, formatDistanceToNow as dateFnsformatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export function formatDatetime(rawDate: string): string {
    const date = new Date(rawDate);

    return format(date, "MM/dd/yyyy 'at' HH'h'mm", {
        locale: enUS,
    })
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