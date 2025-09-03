"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import BookingStepLayout from "@/app/components/booking/BookingStepLayout";
import { useRouter, useParams } from "next/navigation";
import NavBar from "@/app/components/ui/navBar";
import { Skeleton } from "@/components/ui/skeleton";
import { step2Schema } from "@/lib/validation";
import type { Step2FormData, TripSummaryData } from "@/app/types/type";
import { supabase } from "@/lib/supabaseClient";

/* ================= Icons & UI bits (unchanged) ================= */
function PeopleIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#C1C1C1" strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

interface NumberStepperProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  min?: number;
  max?: number;
}
const NumberStepper: React.FC<NumberStepperProps> = ({ value, setValue, min = 0, max = 10 }) => (
  <div className="relative w-full">
    <div className="flex items-center w-full rounded-full bg-[#fafafa] shadow px-5 py-2 h-[48px]">
      <PeopleIcon />
      <span className="text-gray-400 flex-1 pl-2">Number of People*</span>
      <div className="flex items-center gap-0.5 ml-auto">
        <span className="text-gray-700 text-base font-semibold w-6 text-center">{value}</span>
        <div className="flex flex-col">
          <button
            type="button"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 text-xs mb-0.5"
            style={{ fontSize: "10px", lineHeight: "12px", padding: 0 }}
            onClick={() => setValue((v) => Math.min(max, v + 1))}
            tabIndex={-1}
            aria-label="Increase"
          >
            <svg width="10" height="10" viewBox="0 0 20 20">
              <polyline points="5 12 10 7 15 12" fill="none" stroke="gray" strokeWidth="2" />
            </svg>
          </button>
          <button
            type="button"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 text-xs mt-0.5"
            style={{ fontSize: "10px", lineHeight: "12px", padding: 0 }}
            onClick={() => setValue((v) => Math.max(min, v - 1))}
            disabled={value <= min}
            tabIndex={-1}
            aria-label="Decrease"
          >
            <svg width="10" height="10" viewBox="0 0 20 20">
              <polyline points="5 8 10 13 15 8" fill="none" stroke="gray" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ================= Skeleton for Trip Summary (matches your card) ================= */
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

/* ================= Helpers for fetching ================= */
const DEFAULT_TOUR_BUCKET = "tours";
const FALLBACK_IMG = "/image2.jpg"; // must exist in /public

const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);

async function toSignedUrl(bucket: string, path: string, secs = 60 * 60 * 6) {
  const key = path.replace(new RegExp(`^${bucket}/`), "");
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(key, secs);
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
  const da = new Date(a),
    db = new Date(b);
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 0;
  const ms = db.getTime() - da.getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}
function formatDateRange(start?: string | null, end?: string | null) {
  if (!start || !end) return "";
  const s = new Date(start),
    e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
  const sameYear = s.getFullYear() === e.getFullYear();
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-US", opts);
  return sameYear
    ? `${fmt(s, { month: "short", day: "numeric" })}–${fmt(e, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    : `${fmt(s, { month: "short", day: "numeric", year: "numeric" })}–${fmt(e, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
}

/* ================= Component ================= */
export default function Step2() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const numericId = useMemo(() => Number(id), [id]);

  const [trip, setTrip] = useState<TripSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      numberOfPeople: "0",
      people: [],
      dietaryRestrictions: "",
      medicalConditions: "",
      specialRequests: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "people",
  });

  const [numPeople, setNumPeople] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  // Fetch trip by id (same as Step 1 approach)
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

  // sync numberOfPeople string field + maintain people[] array count
  useEffect(() => {
    setValue("numberOfPeople", String(numPeople));
    if (numPeople > 1) {
      if (fields.length < numPeople) {
        for (let i = fields.length; i < numPeople; i++) {
          append({ name: "", phone: "" });
        }
      } else if (fields.length > numPeople) {
        for (let i = fields.length; i > numPeople; i--) {
          remove(i - 1);
        }
      }
    } else {
      replace([]);
    }
    // eslint-disable-next-line
  }, [numPeople]);

  // dropdown open/close behavior
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        stepperRef.current &&
        !stepperRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setShowDropdown(numPeople > 1);
  }, [numPeople]);

  const onSubmit = (data: Step2FormData) => {
    router.push(`/book/${numericId}/step3`);
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
            <Skeleton className="h-6 w-48 mb-5" />
            <Skeleton className="h-12 rounded-full mb-5" />
            <Skeleton className="h-28 rounded-xl mb-5" />
            <Skeleton className="h-10 rounded-full mb-5" />
            <Skeleton className="h-10 rounded-full mb-5" />
            <Skeleton className="h-10 rounded-full" />
          </div>
        </div>
      )}

      {!loading && trip && (
        <BookingStepLayout
          step={2}
          trip={trip}
          onNext={handleSubmit(onSubmit)}
          onPrev={() => router.push(`/book/${numericId}/step1`)}
        >
          <form className="space-y-0" onSubmit={handleSubmit(onSubmit)}>
            <div
              className="bg-white rounded-2xl shadow-md border border-[#f0f0f0] px-5 py-5"
              style={{ fontFamily: "'Century Gothic', sans-serif" }}
            >
              <div className="mb-5">
                <span className="block text-xl font-bold text-black">Personal Information</span>
              </div>

              {/* Number of People Stepper */}
              <div className="mb-5 relative" ref={stepperRef}>
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="numberOfPeople">
                  Number of People*
                </label>
                <div
                  tabIndex={0}
                  onFocus={() => numPeople > 1 && setShowDropdown(true)}
                  onClick={() => numPeople > 1 && setShowDropdown(true)}
                  className="focus:outline-none"
                >
                  <NumberStepper value={numPeople} setValue={setNumPeople} min={0} max={10} />
                </div>
                {errors.numberOfPeople && (
                  <p className="text-red-500 text-xs mt-1">{errors.numberOfPeople.message}</p>
                )}

                {showDropdown && numPeople > 1 && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-[#f0f0f0] px-5 py-4 z-30 max-h-60 overflow-y-auto"
                  >
                    <span className="block text-sm font-bold text-[#28B872] mb-2">
                      Add details for each person:
                    </span>
                    {fields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2 mb-3">
                        <Input
                          className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 flex-1"
                          placeholder={`Person ${idx + 1} Name`}
                          {...register(`people.${idx}.name` as const)}
                        />
                        <Input
                          className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 flex-1"
                          placeholder={`Person ${idx + 1} Phone`}
                          {...register(`people.${idx}.phone` as const)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dietary Restrictions */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="dietaryRestrictions">
                  Dietary Restrictions
                </label>
                <Input
                  id="dietaryRestrictions"
                  className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="Vegetarian, allergies, etc."
                  {...register("dietaryRestrictions")}
                />
              </div>

              {/* Medical Conditions */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="medicalConditions">
                  Medical Conditions
                </label>
                <Input
                  id="medicalConditions"
                  className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="Medical condition"
                  {...register("medicalConditions")}
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="specialRequests">
                  Special Requests
                </label>
                <Input
                  id="specialRequests"
                  className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="Accommodations"
                  {...register("specialRequests")}
                />
              </div>
            </div>
          </form>
          <NavBar />
        </BookingStepLayout>
      )}
    </>
  );
}
