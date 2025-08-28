"use client";
import { supabase } from "@/lib/supabaseClient";

// If your storage bucket has a different name, change this:
const STORAGE_BUCKET = "tours";

type TourRow = {
  id: number;
  tourName?: string | null;
  tourType?: string | null;
  destination?: string | null;
  photos?: string[] | null;
  price?: number | null;
  discount?: number | null;
  total?: number | null;
  start_date?: string | null; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD
};

export type TravelCardVM = {
  id: number;
  imageUrl: string;
  placeName: string;
  location: string;
  tripDuration: string; // "2 day's trip"
  price: string; // e.g. "2,700"
  oldPrice?: string; // e.g. "3,000"
  discountPercent?: number;
  rating: number; // placeholder (not in table)
  reviews: number; // placeholder (not in table)
  agencyName: string; // placeholder (not in table)
};

const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);

/** Return a signed URL for a storage key. Works for private or public buckets. */
async function toImageUrlFromStorageKey(path: string): Promise<string> {
  if (isFullUrl(path)) return path;

  // Remove bucket prefix if the path already includes it
  const key = path.replace(new RegExp(`^${STORAGE_BUCKET}/`), "");

  // Try signed URL first (works for private buckets)
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(key, 60 * 60 * 6); // 6 hours

  if (!error && data?.signedUrl) return data.signedUrl;

  // Fallback to public URL (works if bucket is public)
  const pub = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);
  return pub.data.publicUrl;
}

function fmtMoney(n?: number | null): string {
  const v = Number.isFinite(n as number) ? (n as number) : 0;
  return v.toLocaleString("en-US");
}

function diffDaysInclusive(a?: string | null, b?: string | null): number {
  if (!a || !b) return 2;
  const da = new Date(a);
  const db = new Date(b);
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 2;
  const ms = db.getTime() - da.getTime();
  return Math.max(1, Math.round(ms / (24 * 3600 * 1000)) + 1);
}

/** Map DB row -> the props your TravelCard needs */
async function mapRowToCardVM(row: TourRow): Promise<TravelCardVM> {
  const placeName = row.tourName ?? "Untitled Trip";
  const location = row.destination ?? "—";

  const days = diffDaysInclusive(row.start_date ?? null, row.end_date ?? null);
  const tripDuration = `${days} day's trip`;

  const discount = typeof row.discount === "number" ? row.discount : undefined;
  const priceNow = typeof row.total === "number" ? row.total : row.price ?? 0;
  const oldPrice =
    discount && discount > 0 && row.price ? fmtMoney(row.price) : undefined;

  // Image: prefer first photo; support http(s), data:, or storage key
  const first = row.photos?.[0];
  let imageUrl = "/tipsimage.png";
  if (first) {
    imageUrl =
      isFullUrl(first) || isDataUrl(first)
        ? first
        : await toImageUrlFromStorageKey(first);
  }

  return {
    id: row.id,
    imageUrl,
    placeName,
    location,
    tripDuration,
    price: fmtMoney(priceNow),
    oldPrice,
    discountPercent: discount,
    rating: 4.6, // placeholder until you add real columns
    reviews: 200, // placeholder
    agencyName: "Local Guide",
  };
}

/** Fetch only columns that actually exist in your schema */
export async function fetchToursForHome(limit = 10): Promise<TravelCardVM[]> {
  const { data, error } = await supabase
    .from("tours")
    // only existing columns per your schema
    .select(
      "id,tourName,tourType,destination,photos,price,discount,total,start_date,end_date"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchToursForHome error:", error);
    return [];
  }

  const rows = (data ?? []) as TourRow[];
  return Promise.all(rows.map(mapRowToCardVM));
}
