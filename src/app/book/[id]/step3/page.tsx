"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BookingStepLayout from "@/app/components/booking/BookingStepLayout";
import NavBar from "@/app/components/ui/navBar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { supabase } from "@/lib/supabaseClient";
import { step3Schema } from "@/lib/validation";
import type { Step3FormData, TripSummaryData } from "@/app/types/type";

/* ---------- helpers (same pattern as step1/step2) ---------- */
const DEFAULT_TOUR_BUCKET = "tours";
const FALLBACK_IMG = "/image2.jpg"; // ensure exists under /public

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
      <Skeleton className="h-4 w-24" />
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

/* ---------- Component ---------- */
export default function Step3() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const numericId = useMemo(() => Number(id), [id]);

  const [trip, setTrip] = useState<TripSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      contactName: "",
      contactPhone: "",
      relationship: "",
    },
  });

  // fetch trip by id (same as step1/2)
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

  const onSubmit = (data: Step3FormData) => {
    console.log("Step 3 data", data);
    router.push(`/book/${numericId}/step4`);
  };

  return (
    <>
      {loading && (
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="mt-4 mb-4">
            <TripSummarySkeleton />
          </div>
          {/* light form skeleton */}
          <div className="bg-white rounded-2xl shadow-md border border-[#f0f0f0] px-5 py-5">
            <Skeleton className="h-6 w-56 mb-2" />
            <Skeleton className="h-4 w-64 mb-4" />
            <Skeleton className="h-10 rounded-full mb-5" />
            <Skeleton className="h-10 rounded-full mb-5" />
            <Skeleton className="h-10 rounded-full" />
          </div>
        </div>
      )}

      {!loading && trip && (
        <BookingStepLayout
          step={3}
          trip={trip}
          onNext={handleSubmit(onSubmit)}
          onPrev={() => router.push(`/book/${numericId}/step2`)}
        >
          <form className="space-y-0" onSubmit={handleSubmit(onSubmit)}>
            <div
              className="bg-white rounded-2xl shadow-md border border-[#f0f0f0] px-5 py-5"
              style={{ fontFamily: "'Century Gothic', sans-serif" }}
            >
              <div className="mb-1">
                <span className="block text-xl font-bold text-black">Emergency Contact</span>
                <span className="block text-xs font-medium text-gray-400 mt-0.5 mb-3">
                  Required for safety purposes during your adventure
                </span>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="contactName">
                  Full Name*
                </label>
                <Input
                  id="contactName"
                  className="rounded-full border-none bg-[#fafafa] shadow text-gray-400 font-medium text-[15px] px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="Emergency contact name"
                  {...register("contactName")}
                />
                {errors.contactName && (
                  <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="contactPhone">
                  Phone number*
                </label>
                <Input
                  id="contactPhone"
                  className="rounded-full border-none bg-[#fafafa] shadow text-gray-400 font-medium text-[15px] px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="Emergency contact phone"
                  {...register("contactPhone")}
                />
                {errors.contactPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="relationship">
                  Relationship*
                </label>

                {/* register the field so RHF tracks it */}
                <input type="hidden" {...register("relationship")} />

                <Select
                  onValueChange={(val) => setValue("relationship", val, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger
                    id="relationship"
                    className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 h-[48px] flex items-center w-full"
                  >
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {errors.relationship && (
                  <p className="text-red-500 text-xs mt-1">{errors.relationship.message}</p>
                )}
              </div>
            </div>
          </form>
          <NavBar />
        </BookingStepLayout>
      )}
    </>
  );
}
