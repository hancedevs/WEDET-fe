/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { supabase } from "@/lib/supabaseClient";

const STORAGE_BUCKET = "tours";

/* =========================
   Types
========================= */
export type TravelCardVM = {
  id: number;
  imageUrl: string;
  placeName: string;
  location: string;
  tripDuration: string;          // "3 day's trip"
  price: string | number;        // UI handles string/number
  oldPrice?: string | number;
  discountPercent?: number;
  rating: number;
  reviews: number;
  agencyName: string;
  agencyAbout?: string;
};

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

  business_user_id?: string | null;
  uuid?: string | null; // legacy field (fallback if business_user_id missing)
};

type BizProfileRow = {
  user_id: string;
  business_name: string | null;
  about: string | null;
  about_business?: string | null;
};

type QueryError = { code?: string; message?: string } | null;
type QueryResult<T> = { data: T | null; error: QueryError };

/* =========================
   Helpers
========================= */
const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);

async function toImageUrlFromStorageKey(path?: string): Promise<string> {
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
  return Math.max(1, Math.round((db.getTime() - da.getTime()) / 86_400_000) + 1);
}

function agencyNameOf(biz?: BizProfileRow | null): string {
  return (biz?.business_name?.trim() || "") || "Local Guide";
}

function pickAbout(biz?: BizProfileRow | null): string | undefined {
  return biz?.about ?? biz?.about_business ?? undefined;
}

function pickBizUserId(row: TourRow): string | null {
  return row.business_user_id ?? row.uuid ?? null;
}

/* =========================
   Map DB row -> VM
========================= */
async function mapRowToCardVM(row: TourRow, biz?: BizProfileRow | null): Promise<TravelCardVM> {
  const placeName = row.tourName?.trim() || "Untitled Trip";
  const location = row.destination?.trim() || "—";
  const days = diffDaysInclusive(row.start_date ?? null, row.end_date ?? null);
  const tripDuration = `${days} day's trip`;

  const discount = typeof row.discount === "number" ? row.discount : undefined;
  const priceNow =
    typeof row.total === "number" ? row.total :
    typeof row.price === "number" ? row.price : 0;

  const first = Array.isArray(row.photos) ? row.photos[0] : undefined;
  const imageUrl = first ? await toImageUrlFromStorageKey(first) : "/tipsimage.png";

  return {
    id: row.id,
    imageUrl,
    placeName,
    location,
    tripDuration,
    price: fmtMoney(priceNow),
    oldPrice: discount && discount > 0 && typeof row.price === "number" ? fmtMoney(row.price) : undefined,
    discountPercent: discount,
    rating: 4.6,  // placeholder until you have real ratings
    reviews: 200, // placeholder until you have real reviews
    agencyName: agencyNameOf(biz),
    agencyAbout: pickAbout(biz),
  };
}

/* =========================
   Query variants (typed)
========================= */
async function fetchWithRel(limit: number): Promise<QueryResult<Array<TourRow & { business_profiles?: BizProfileRow | null }>>> {
  const res = await supabase
    .from("tours")
    .select(`
      id,tourName,tourType,destination,photos,price,discount,total,start_date,end_date,created_at,
      business_user_id,
      business_profiles!tours_business_user_id_fkey(
        user_id,business_name,about,about_business
      )
    `)
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return { data: (res.data ?? null) as any, error: (res as any).error ?? null };
}

async function fetchBUSOnly(limit: number): Promise<QueryResult<TourRow[]>> {
  const res = await supabase
    .from("tours")
    .select(`
      id,tourName,tourType,destination,photos,price,discount,total,start_date,end_date,created_at,
      business_user_id
    `)
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return { data: (res.data ?? null) as any, error: (res as any).error ?? null };
}

async function fetchWithUUID(limit: number): Promise<QueryResult<TourRow[]>> {
  const res = await supabase
    .from("tours")
    .select(`
      id,tourName,tourType,destination,photos,price,discount,total,start_date,end_date,created_at,
      uuid
    `)
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return { data: (res.data ?? null) as any, error: (res as any).error ?? null };
}

async function batchJoinBusiness(rows: TourRow[]): Promise<Array<{ row: TourRow; biz: BizProfileRow | null }>> {
  const ids = Array.from(new Set(rows.map(pickBizUserId).filter((v): v is string => !!v)));
  let map = new Map<string, BizProfileRow>();
  if (ids.length) {
    const res = await supabase
      .from("business_profiles")
      .select("user_id,business_name,about,about_business")
      .in("user_id", ids);
    if (!("error" in res) || !res.error) {
      const data = (res.data ?? []) as BizProfileRow[];
      map = new Map<string, BizProfileRow>(data.map((b) => [b.user_id, b]));
    }
  }
  return rows.map((r) => ({
    row: r,
    biz: ((): BizProfileRow | null => {
      const uid = pickBizUserId(r);
      return uid ? map.get(uid) ?? null : null;
    })(),
  }));
}

/* =========================
   Public API
========================= */
export async function fetchToursForHome(limit = 12): Promise<TravelCardVM[]> {
  // 1) Try relational path
  const res = await fetchWithRel(limit);

  const colMissing =
    !!res.error &&
    (res.error.code === "42703" || /business_user_id/i.test(res.error.message ?? ""));

  const hasRelField =
    Array.isArray(res.data) &&
    res.data.length > 0 &&
    Object.prototype.hasOwnProperty.call(res.data[0] as object, "business_profiles");

  if (colMissing) {
    // 2) No business_user_id yet -> uuid fallback + batch join
    const uuidRes = await fetchWithUUID(limit);
    if (uuidRes.error) {
      // eslint-disable-next-line no-console
      console.error("fetchToursForHome (uuid path) error:", uuidRes.error);
      return [];
    }
    const raw = (uuidRes.data ?? []) as TourRow[];
    const enriched = await batchJoinBusiness(raw);
    return Promise.all(enriched.map(({ row, biz }) => mapRowToCardVM(row, biz)));
  }

  if (res.error || !hasRelField) {
    // 3) Column exists but relation not inferred -> tours only + batch join
    const fb = res.error ? await fetchBUSOnly(limit) : res;
    if (fb.error) {
      // eslint-disable-next-line no-console
      console.error("fetchToursForHome (BUS no-rel) error:", fb.error);
      return [];
    }
    const raw = (fb.data ?? []) as TourRow[];
    const enriched = await batchJoinBusiness(raw);
    return Promise.all(enriched.map(({ row, biz }) => mapRowToCardVM(row, biz)));
  }

  // 4) Relational path worked
  const rows = (res.data ?? []) as Array<TourRow & { business_profiles?: BizProfileRow | null }>;
  return Promise.all(
    rows.map((r) => mapRowToCardVM(r, (r as any).business_profiles ?? null))
  );
}
