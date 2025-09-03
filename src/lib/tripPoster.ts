"use client";
import { supabase } from "@/lib/supabaseClient";
import { readDraft, clearDraft } from "./tripDraftLocal";

const TABLE_NAME = "tours";
const DRY_RUN = false as const;

type Status = "posted" | "scheduled";

// Draft shapes (minimal, extend as needed)
type Step1 = {
  photos?: string[];
  tourName?: string;
  tourType?: string;
  destination?: string;
  startingPoint?: string;
  overview?: string;
  highlights?: string;
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
};

type Step2 = {
  days?: number[];
  activities?: { activity: string; time: string }[];
  selectedDay?: string;
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
  groupNumber?: string | number;
};

type Step3 = {
  price?: number;
  discount?: number;
  total?: number;
  includes?: string[];
  notIncludes?: string[];
  essentialEquipment?: string[];
  postAction?: string;
  scheduleType?: string;
};

type RowInput = Record<string, unknown>;

// helper: "YYYY-MM-DD"
const toYMD = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function diffKeys(original: RowInput, finalRow: RowInput): string[] {
  const removed: string[] = [];
  for (const k of Object.keys(original)) if (!(k in finalRow)) removed.push(k);
  return removed;
}

/** Try inserting; if Supabase/Postgres says a column doesn't exist, strip it and retry. */
async function adaptiveInsert(row: RowInput) {
  // eslint-disable-next-line prefer-const
  let attempt: RowInput = { ...row };

  // Extract offending column name from different error message styles
  const findBadColumn = (msg: string): string | null => {
    // 1) 'col_name'
    const q = msg.match(/'([a-zA-Z0-9_]+)'/);
    if (q?.[1]) return q[1];
    // 2) column "col_name" ... does not exist
    const d = msg.match(/column\s+"?([a-zA-Z0-9_]+)"?\s+(?:of|does)/i);
    if (d?.[1]) return d[1];
    return null;
  };

  for (let tries = 0; tries < 25; tries++) {
    const { error } = await supabase.from(TABLE_NAME).insert(attempt);

    if (!error) return { ok: true as const, removed: diffKeys(row, attempt) };

    // Unknown column (covers Postgres & PostgREST variants)
    if (
      error.code === "42703" ||
      error.code === "PGRST204" ||
      error.code === "PGRST303"
    ) {
      const badKey = findBadColumn(error.message || "");
      if (badKey && badKey in attempt) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (attempt as Record<string, unknown>)[badKey];
        continue;
      }
    }

    // Different error: bubble it up (e.g., NOT NULL, RLS, etc.)
    throw error;
  }

  throw new Error(
    "Insert failed after multiple attempts removing unknown columns."
  );
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
  const s1: Partial<Step1> = (draft.step1 ?? {}) as Partial<Step1>;
  const s2: Partial<Step2> = (draft.step2 ?? {}) as Partial<Step2>;
  const s3: Partial<Step3> = (draft.step3 ?? {}) as Partial<Step3>;

  // Dates (Step 2 preferred), fallback so NOT NULL columns are satisfied.
  const today = new Date();
  const daysCount =
    Array.isArray(s2?.days) && s2.days.length > 0 ? s2.days.length : 1;

  const startYMD: string = s2?.startDate ?? s1?.startDate ?? toYMD(today);
  const endYMD: string =
    s2?.endDate ??
    s1?.endDate ??
    toYMD(addDays(today, Math.max(0, daysCount - 1)));

  // Group number: normalize to positive integer; default to 1 if missing/invalid
  const rawGroup = s2?.groupNumber;
  const groupNum =
    rawGroup === undefined || rawGroup === null || rawGroup === ""
      ? 1
      : Number.isFinite(Number(rawGroup)) && Number(rawGroup) > 0
      ? Math.floor(Number(rawGroup))
      : 1;

  // Build row. Include BOTH camelCase and snake_case for fields that may differ.
  const row: RowInput = {
    // Step 3 pricing & posting
    price: s3.price ?? null,
    discount: s3.discount ?? null,
    total: s3.total ?? null,
    includes: Array.isArray(s3.includes) ? s3.includes : [],
    notIncludes: Array.isArray(s3.notIncludes) ? s3.notIncludes : [],
    essentialEquipment: Array.isArray(s3.essentialEquipment)
      ? s3.essentialEquipment
      : [],
    postaction: s3.postAction ?? null, // some schemas use "postaction"
    scheduleType: s3.scheduleType ?? null,
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

    // Step 2 plan (text columns get JSON strings if present)
    activities: s2?.activities ? JSON.stringify(s2.activities) : null,
    days: s2?.days ? JSON.stringify(s2.days) : null,

    // Dates (send both naming styles)
    startDate: startYMD,
    endDate: endYMD,
    start_date: startYMD,
    end_date: endYMD,

    // Group number (snake case for typical DB column)
    group_number: groupNum,
  };

  if (DRY_RUN) {
    
    console.log("[DRY_RUN] Would insert into public.tours:", row);
    return { ok: true, dryRun: true as const };
  }

  await adaptiveInsert(row);

  clearDraft(); // only clear after successful write
  return { ok: true, dryRun: false as const };
}
