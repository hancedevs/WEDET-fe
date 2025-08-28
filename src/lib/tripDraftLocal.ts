"use client";

const KEY = "wedet.tripDraft.v1";

export type Draft = {
  step1?: unknown;
  step2?: unknown;
  step3?: unknown;
};

export function readDraft(): Draft {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}

export function saveDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
  const d = readDraft();
  d[key] = value;
  localStorage.setItem(KEY, JSON.stringify(d));
}

export function clearDraft() {
  localStorage.removeItem(KEY);
}
