import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayLabel(ts: number) {
  const date = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor(
    (new Date(now.toDateString()).getTime() -
      new Date(date.toDateString()).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Last Week";
  return date.toLocaleDateString();
}

export function truncate(str: string, len = 60) {
  return str.length > len ? str.slice(0, len).trim() + "…" : str;
}

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
