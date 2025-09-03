"use client";

import { supabase } from "@/lib/supabaseClient";

// Storage bucket
const STORAGE_BUCKET = "tours";

/* ---------- DB rows ---------- */
type TourRow = {
  id: number;
  tourName?: string | null;
  tourType?: string | null;
  destination?: string | null;
  photos?: string[] | null;
  price?: number | null;
  discount?: number | null;
  total?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;

  // creator (business user)
  business_user_id?: string | null;
};

type BizProfileRow = {
  user_id: string;
  business_name: string | null;
  about: string | null;           // primary
  about_business?: string | null; // alias/legacy if present
};

/* ---------- View model ---------- */
export type TravelCardVM = {
  id: number;
  imageUrl: string;
  placeName: string;
  location: string;
  tripDuration: string;    // "2 day's trip"
  price: string;           // "2,700"
  oldPrice?: string;       // "3,000"
  discountPercent?: number;
  rating: number;
  reviews: number;
  agencyName: string;      // from business_profiles.business_name
  agencyAbout?: string;    // from business_profiles.about (fallback about_business)
};

const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);

async function toImageUrlFromStorageKey(path: string): Promise<string> {
  if (!path) return "/tipsimage.png";
  if (isFullUrl(path) || isDataUrl(path)) return path;

  const key = path.replace(new RegExp(`^${STORAGE_BUCKET}/`), "");
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(key, 60 * 60 * 6); // 6h

  if (!error && data?.signedUrl) return data.signedUrl;

  const pub = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);
  return pub.data.publicUrl || "/tipsimage.png";
}

function fmtMoney(n?: number | null): string {
  if (typeof n !== "number" || !Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US");
}

function diffDaysInclusive(a?: string | null, b?: string | null): number {
  if (!a || !b) return 1;
  const da = new Date(a);
  const db = new Date(b);
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 1;
  const ms = db.getTime() - da.getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

function pickAbout(b?: BizProfileRow | null) {
  return b?.about ?? b?.about_business ?? undefined;
}

function agencyNameOf(b?: BizProfileRow | null) {
  return (b?.business_name?.trim() || "") || "Local Guide";
}

/** Map DB -> VM */
async function mapRowToCardVM(row: TourRow, biz?: BizProfileRow | null): Promise<TravelCardVM> {
  const placeName = row.tourName?.trim() || "Untitled Trip";
  const location = row.destination?.trim() || "—";

  const days = diffDaysInclusive(row.start_date ?? null, row.end_date ?? null);
  const tripDuration = `${days} day's trip`;

  const discount = typeof row.discount === "number" ? row.discount : undefined;
  const priceNow =
    typeof row.total === "number" ? row.total :
    typeof row.price === "number" ? row.price : 0;
  const oldPrice =
    discount && discount > 0 && typeof row.price === "number"
      ? fmtMoney(row.price)
      : undefined;

  const first = Array.isArray(row.photos) ? row.photos[0] : undefined;
  const imageUrl = first ? await toImageUrlFromStorageKey(first) : "/tipsimage.png";

  return {
    id: row.id,
    imageUrl,
    placeName,
    location,
    tripDuration,
    price: fmtMoney(priceNow),
    oldPrice,
    discountPercent: discount,
    rating: 4.6,
    reviews: 200,
    agencyName: agencyNameOf(biz),
    agencyAbout: pickAbout(biz),
  };
}

/* ---------- Preferred: single-query LEFT join (needs FK) ---------- */
async function fetchWithJoin(limit = 10): Promise<TravelCardVM[]> {
  const { data, error } = await supabase
    .from("tours")
    .select(`
      id,tourName,tourType,destination,photos,price,discount,total,start_date,end_date,created_at,
      business_user_id,
      business_profiles(
        user_id,business_name,about,about_business
      )
    `) // LEFT join; tours still show when profile missing
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;

  const rows = (data ?? []) as unknown as Array<TourRow & { business_profiles?: BizProfileRow | null }>;
  return Promise.all(
    rows.map((r) => mapRowToCardVM(r, r.business_profiles ?? null))
  );
}

/* ---------- Fallback: 2 queries (no FK needed) ---------- */
async function fetchWithBatch(limit = 10): Promise<TravelCardVM[]> {
  const { data, error } = await supabase
    .from("tours")
    .select(
      "id,tourName,tourType,destination,photos,price,discount,total,start_date,end_date,created_at,business_user_id"
    )
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;

  const rows = (data ?? []) as TourRow[];
  if (rows.length === 0) {
    console.warn("fetchToursForHome: empty result (table empty or RLS denied).");
    return [];
  }

  const userIds = Array.from(
    new Set(rows.map((r) => r.business_user_id).filter(Boolean))
  ) as string[];

  let bizMap = new Map<string, BizProfileRow>();
  if (userIds.length) {
    const { data: biz, error: bErr } = await supabase
      .from("business_profiles")
      .select("user_id,business_name,about,about_business")
      .in("user_id", userIds);

    if (bErr) {
      console.warn("fetchToursForHome: business lookup failed:", bErr.message);
    } else if (biz?.length) {
      bizMap = new Map(biz.map((b) => [b.user_id, b] as const));
    }
  }

  return Promise.all(
    rows.map((r) =>
      mapRowToCardVM(
        r,
        r.business_user_id ? bizMap.get(r.business_user_id) ?? null : null
      )
    )
  );
}

/** Public API used by your store */
export async function fetchToursForHome(limit = 10): Promise<TravelCardVM[]> {
  try {
    return await fetchWithJoin(limit);
  } catch (e) {
    const err = e as { message?: string };
    console.warn("fetchToursForHome: join path failed, falling back. Reason:", err?.message ?? e);
    try {
      return await fetchWithBatch(limit);
    } catch (e2) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ee = e2 as any;
      console.error("fetchToursForHome error (batch):", {
        code: ee?.code,
        message: ee?.message,
        details: ee?.details,
        hint: ee?.hint,
      });
      return [];
    }
  }
}
