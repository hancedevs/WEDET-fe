"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BookingStepLayout from "@/app/components/booking/BookingStepLayout";
import NavBar from "@/app/components/ui/navBar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // 👈 use your shadcn skeleton
import { supabase } from "@/lib/supabaseClient";

import { step1Schema } from "@/lib/validation";
import type { Step1FormData, TripSummaryData } from "@/app/types/type";

/* ---------- helpers (no UI changes) ---------- */
const DEFAULT_TOUR_BUCKET = "tours";
const FALLBACK_IMG = "/image2.jpg"; // ensure this exists in /public

const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);

async function toSignedUrl(bucket: string, path: string, secs = 60 * 60 * 6) {
  const key = path.replace(new RegExp(`^${bucket}/`), "");
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(key, secs);
  if (!error && data?.signedUrl) return data.signedUrl;
  return supabase.storage.from(bucket).getPublicUrl(key).data.publicUrl;
}

async function toImageUrlFromStorageKey(path: string, bucket = DEFAULT_TOUR_BUCKET) {
  if (isFullUrl(path) || isDataUrl(path)) return path;
  return toSignedUrl(bucket, path);
}

function getStringField(row: Record<string, unknown>, key: string) {
  const v = row[key];
  return typeof v === "string" ? v : undefined;
}
function getStringArray(val: unknown): string[] | undefined {
  return Array.isArray(val) && val.every((x) => typeof x === "string") ? (val as string[]) : undefined;
}
function diffDaysInclusive(a?: string | null, b?: string | null) {
  if (!a || !b) return 0;
  const da = new Date(a), db = new Date(b);
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 0;
  const ms = db.getTime() - da.getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}
function formatDateRange(start?: string | null, end?: string | null) {
  if (!start || !end) return "";
  const s = new Date(start), e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
  const sameYear = s.getFullYear() === e.getFullYear();
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-US", opts);
  return sameYear
    ? `${fmt(s, { month: "short", day: "numeric" })}–${fmt(e, { month: "short", day: "numeric", year: "numeric" })}`
    : `${fmt(s, { month: "short", day: "numeric", year: "numeric" })}–${fmt(e, { month: "short", day: "numeric", year: "numeric" })}`;
}

/* ---------- Trip Summary Skeleton (matches your card) ---------- */
function TripSummarySkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-[#e5e5e5] shadow-sm px-4 py-4 space-y-2">
      <Skeleton className="h-4 w-24" /> {/* Trip Summary title */}
      <div className="flex items-start gap-4">
        <div className="min-w-[110px] h-[110px] relative rounded-2xl overflow-hidden border border-[#e5e5e5]">
          <Skeleton className="absolute inset-0 w-full h-full" />
        </div>
        <div className="flex flex-col justify-between text-sm space-y-2 py-0.5 w-full">
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

/* ---------- component ---------- */
export default function Step1Page() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const numericId = useMemo(() => Number(id), [id]);

  const [trip, setTrip] = useState<TripSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1FormData>({ resolver: zodResolver(step1Schema) });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!numericId || Number.isNaN(numericId)) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const { data: rowData, error } = await supabase
        .from("tours")
        .select("*")
        .eq("id", numericId)
        .maybeSingle();

      if (!mounted) return;

      if (!error && rowData) {
        const row = rowData as Record<string, unknown>;
        const tourName = getStringField(row, "tourName") ?? "";
        const destination = getStringField(row, "destination") ?? "";
        const photos = getStringArray(row.photos) ?? [];
        const start_date = getStringField(row, "start_date") ?? null;
        const end_date = getStringField(row, "end_date") ?? null;

        // resolve image with guaranteed non-empty fallback
        let img = FALLBACK_IMG;
        if (photos.length) {
          try {
            const url = await toImageUrlFromStorageKey(photos[0]);
            if (url && url.trim() !== "") img = url;
          } catch {}
        }

        const title =
          tourName && destination ? `${tourName}, ${destination}` : tourName || destination || "Trip";
        const dateRange = formatDateRange(start_date, end_date);
        const days = diffDaysInclusive(start_date, end_date);
        const duration = days > 0 ? `${days} days` : "";
        const guide = getStringField(row, "guideName") ?? getStringField(row, "guide") ?? "Local guide";

        setTrip({
          imageUrl: img,
          title,
          location: destination,
          dateRange,
          duration,
          guide,
        });
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [numericId]);

  const onSubmit = (data: Step1FormData) => {
    console.log("Step1 Data", data);
    router.push(`/book/${numericId}/step2`);
  };

  return (
    <div>
      {loading && (
        // Skeleton zone shown during fetch
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="mt-4 mb-4">
            <TripSummarySkeleton />
          </div>

          {/* Optional: light skeleton for the form box */}
          <div className="bg-white rounded-2xl shadow-md border border-[#f0f0f0] px-5 py-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Skeleton className="h-10 rounded-full" />
              <Skeleton className="h-10 rounded-full" />
            </div>
            <Skeleton className="h-10 rounded-full mb-3" />
            <Skeleton className="h-10 rounded-full mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-10 rounded-full" />
              <Skeleton className="h-10 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {!loading && trip && (
        <BookingStepLayout step={1} trip={trip} onNext={handleSubmit(onSubmit)}>
          {/* --- your original form (unchanged design) --- */}
          <form className="space-y-0" onSubmit={handleSubmit(onSubmit)}>
            <div
              className="bg-white rounded-2xl shadow-md border border-[#f0f0f0] px-5 py-5"
              style={{ fontFamily: "'Century Gothic', sans-serif" }}
            >
              <div className="mb-3">
                <span
                  className="block text-x font-bold text-black"
                  style={{ fontFamily: "'Century Gothic', sans-serif" }}
                >
                  Personal Information
                </span>
              </div>

              <div className="flex gap-3 mb-3">
                <div className="w-full">
                  <label className="block text-sm font-semibold mb-1 text-black" htmlFor="firstName">
                    First Name*
                  </label>
                  <Input
                    id="firstName"
                    className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                    placeholder="John"
                    {...register("firstName")}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-semibold mb-1 text-black" htmlFor="lastName">
                    Last Name*
                  </label>
                  <Input
                    id="lastName"
                    className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                    placeholder="Doe"
                    {...register("lastName")}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="email">
                  Email Address*
                </label>
                <Input
                  id="email"
                  className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="john.doe@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="phone">
                  Phone Number*
                </label>
                <Input
                  id="phone"
                  className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="+251"
                  {...register("phone")}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="flex gap-3">
                <div className="w-full">
                  <label className="block text-sm font-semibold mb-1 text-black" htmlFor="dateOfBirth">
                    Date of Birth
                  </label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                    placeholder="27/07/2025"
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-semibold mb-1 text-black" htmlFor="nationality">
                    Nationality
                  </label>
                  <Input
                    id="nationality"
                    className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                    placeholder="United States"
                    {...register("nationality")}
                  />
                  {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>}
                </div>
              </div>
            </div>
          </form>
        </BookingStepLayout>
      )}

      <NavBar />
    </div>
  );
}
