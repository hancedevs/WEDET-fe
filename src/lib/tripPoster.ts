/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { supabase } from "@/lib/supabaseClient";
import { readDraft, clearDraft } from "./tripDraftLocal";

const TABLE_NAME = "tours";
const DRY_RUN = false as const; // set true to log instead of writing

type Status = "posted" | "scheduled";

// helper: "YYYY-MM-DD"
const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

function addDays(d: Date, n: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

async function adaptiveInsert(row: Record<string, any>) {
  const attempt = { ...row };

  for (let tries = 0; tries < 20; tries++) {
    const { error } = await supabase.from(TABLE_NAME).insert(attempt);

    if (!error) return { ok: true as const, removed: diffKeys(row, attempt) };

    // Unknown-column error from PostgREST
    if (error.code === "PGRST204" && typeof error.message === "string") {
      const m = error.message.match(/'([^']+)'/); // offending column name
      const badKey = m?.[1];
      if (badKey && badKey in attempt) {
        delete attempt[badKey];
        continue; // retry without that key
      }
    }

    // Different error: bubble it up (e.g., NOT NULL violations)
    throw error;
  }

  throw new Error("Insert failed after removing unknown columns repeatedly.");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function diffKeys(original: Record<string, any>, finalRow: Record<string, any>) {
  const removed: string[] = [];
  for (const k of Object.keys(original)) if (!(k in finalRow)) removed.push(k);
  return removed;
}

/** Safe poster: fills required dates; adapts to camelCase/snake_case; strips unknowns. */
export async function postTripToSupabase(opts: {
  status: Status;
  scheduleAt?: Date | null;
  dateISO?: string | null;
}) {
  const { data: sess } = await supabase.auth.getSession();
  if (!sess?.session) throw new Error("Not signed in");

  const draft = readDraft();
  const s1 = (draft.step1 ?? {}) as Record<string, any>;
  const s2 = (draft.step2 ?? {}) as {
    days?: number[];
    dayData?: Record<string, {
      meals: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
      };
      activities: { activity: string; time: string }[];
    }>;
    selectedDay?: string;
    startDate?: string; // "YYYY-MM-DD"
    endDate?: string;   // "YYYY-MM-DD"
    groupNumber?: string | number;
  };
  const s3 = (draft.step3 ?? {}) as Record<string, any>;

  // Dates (Step 2 preferred), fallback so NOT NULL columns are satisfied.
  const today = new Date();
  const daysCount = Array.isArray(s2?.days) && s2.days.length > 0 ? s2.days.length : 1;

  const startYMD: string =
    s2?.startDate || (s1 as any)?.startDate || toYMD(today);

  const endYMD: string =
    s2?.endDate ||
    (s1 as any)?.endDate ||
    toYMD(addDays(today, Math.max(0, daysCount - 1)));

  // Group number: normalize to positive integer; default to 1 if missing/invalid
  const groupNum = (() => {
    const raw = (s2 as any)?.groupNumber;
    if (raw === undefined || raw === null || raw === "") return 1;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
  })();

  // Process dayData into a format suitable for database storage
  const processDayData = (dayData: Record<string, any> | undefined) => {
    if (!dayData) return null;
    
    const processed: Record<string, any> = {};
    
    Object.entries(dayData).forEach(([dayKey, dayInfo]) => {
      const dayNum = dayKey.replace('day', '');
      processed[`day${dayNum}`] = {
        meals: dayInfo.meals || {},
        activities: dayInfo.activities || []
      };
    });
    
    return processed;
  };

  // Build row. Include BOTH camelCase and snake_case for fields that may differ.
  const row: Record<string, any> = {
    // Step 3 pricing & posting
    price: s3.price ?? null,
    discount: s3.discount ?? null,
    total: s3.total ?? null,
    includes: Array.isArray(s3.includes) ? s3.includes : [],
    notIncludes: Array.isArray(s3.notIncludes) ? s3.notIncludes : [],
    essentialEquipment: Array.isArray(s3.essentialEquipment) ? s3.essentialEquipment : [],
    postaction: s3.postAction ?? null,       // DB often uses "postaction"
    scheduleType: s3.scheduleType ?? null,   // if DB uses snake_case, it'll be stripped
    scheduleAt: opts.status === "scheduled" ? opts.scheduleAt ?? null : null,
    dateISO: opts.dateISO ?? null,

    // Step 1 basics
    photos: Array.isArray(s1.photos) ? s1.photos : [],
    tourName: s1.tourName ?? null,
    tourType: s1.tourType ?? null,
    destination: s1.destination ?? null,
    startingPoint: s1.startingPoint ?? null,
    overview: s1.overview ?? null,
    highlights: s1.highlights ?? null,

    // Step 2 plan - store dayData as JSON
    activities: s2?.dayData ? JSON.stringify(processDayData(s2.dayData)) : null,
    days: s2?.days ? JSON.stringify(s2.days) : null,

    // Dates (send both naming styles)
    startDate: startYMD,
    endDate: endYMD,
    start_date: startYMD,
    end_date: endYMD,

    // Group number (send both naming styles)
    group_number: groupNum,
    groupNumber: groupNum,
  };

  if (DRY_RUN) {
    console.log("[DRY_RUN] Would insert into public.tours:", row);
    return { ok: true, dryRun: true };
  }

  const res = await adaptiveInsert(row);
  // if (res.removed?.length) console.warn("Removed unknown columns:", res.removed);

  clearDraft(); // only clear after successful write
  return { ok: true, dryRun: false };
}