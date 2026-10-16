import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (loaded) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, loaded]);
  return [value, setValue] as const;
}

export type Activity = { id: string; type: "email" | "research" | "chat"; title: string; at: number };
const ACT_KEY = "wpa.activity";

export function logActivity(a: Omit<Activity, "id" | "at">) {
  try {
    const list: Activity[] = JSON.parse(localStorage.getItem(ACT_KEY) || "[]");
    list.unshift({ ...a, id: crypto.randomUUID(), at: Date.now() });
    localStorage.setItem(ACT_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {}
}
export function readActivity(): Activity[] {
  try { return JSON.parse(localStorage.getItem(ACT_KEY) || "[]"); } catch { return []; }
}

export const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms));
