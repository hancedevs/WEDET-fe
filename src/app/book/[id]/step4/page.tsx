"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BookingStepLayout from "@/components/booking/BookingStepLayout";
import NavBar from "@/components/ui/navBar";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

import { step4Schema } from "@/lib/validation";
import type { Step4FormData, TripSummaryData } from "@/types/type";
import { supabase } from "@/lib/supabaseClient";

/* ---------- helpers (same pattern as steps 1–3) ---------- */
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

async function toImageUrlFromStorageKey(
    path: string,
    bucket = DEFAULT_TOUR_BUCKET
) {
    if (isFullUrl(path) || isDataUrl(path)) return path;
    return toSignedUrl(bucket, path);
}

function getStringField(row: Record<string, unknown>, key: string) {
    const v = row[key];
    return typeof v === "string" ? v : undefined;
}
function getNumberField(row: Record<string, unknown>, key: string) {
    const v = row[key];
    return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
function getStringArray(val: unknown): string[] | undefined {
    return Array.isArray(val) && val.every((x) => typeof x === "string")
        ? (val as string[])
        : undefined;
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
    const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
        d.toLocaleDateString("en-US", opts);
    return sameYear
        ? `${fmt(s, { month: "short", day: "numeric" })}–${fmt(e, {
              month: "short",
              day: "numeric",
              year: "numeric",
          })}`
        : `${fmt(s, { month: "short", day: "numeric", year: "numeric" })}–${fmt(
              e,
              { month: "short", day: "numeric", year: "numeric" }
          )}`;
}

/* ---------- Trip Summary Skeleton ---------- */
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
export default function Step4() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const numericId = useMemo(() => Number(id), [id]);

    const [trip, setTrip] = useState<TripSummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    // simple price state (fallback to your constants if DB missing)
    const [perPerson, setPerPerson] = useState<number>(2700);
    const [people, setPeople] = useState<number>(1); // if you store this in step2, wire it here
    const [serviceFee] = useState<number>(100);
    const [processingFee] = useState<number>(25);

    const total = perPerson * people + serviceFee + processingFee;

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<Step4FormData>({
        resolver: zodResolver(step4Schema),
        defaultValues: {
            agreed: false,
        },
    });

    // fetch trip & price by id
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

                // Trip Summary
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
                    tourName && destination
                        ? `${tourName}, ${destination}`
                        : tourName || destination || "Trip";
                const dateRange = formatDateRange(start_date, end_date);
                const days = diffDaysInclusive(start_date, end_date);
                const duration = days > 0 ? `${days} days` : "";
                const guide =
                    getStringField(row, "guideName") ??
                    getStringField(row, "guide") ??
                    "Local guide";

                setTrip({
                    imageUrl: img,
                    title,
                    location: destination,
                    dateRange,
                    duration,
                    guide,
                });

                // Price: prefer total if present, else price (both numbers in your schema)
                const totalFromDb = getNumberField(row, "total");
                const priceFromDb = getNumberField(row, "price");
                const effectivePerPerson = totalFromDb ?? priceFromDb ?? 2700;
                setPerPerson(effectivePerPerson);
                // If you stored `people` in a global store or query param, set it here:
                // setPeople(myPeopleCountFromStoreOrQuery);
            }

            setLoading(false);
        })();
        return () => {
            mounted = false;
        };
    }, [numericId]);

    const onSubmit = (data: Step4FormData) => {
        console.log("Final step data", data);
        router.push(`/book/${numericId}/step5`);
    };

    return (
        <>
            {loading && (
                <div className="max-w-screen-lg mx-auto px-4">
                    <div className="mt-4 mb-4">
                        <TripSummarySkeleton />
                    </div>

                    {/* Price & Terms skeleton */}
                    <div
                        className="bg-white rounded-3xl shadow-md border border-[#f0f0f0] px-5 py-5 mb-4"
                        style={{ fontFamily: "'Century Gothic', sans-serif" }}
                    >
                        <Skeleton className="h-6 w-40 mb-3" />
                        <div className="space-y-2 mb-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                        <Skeleton className="h-px w-full my-2" />
                        <div className="flex justify-between items-center mt-1">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>

                    <div
                        className="mt-7 ml-3"
                        style={{ fontFamily: "'Century Gothic', sans-serif" }}
                    >
                        <Skeleton className="h-6 w-56 mb-2" />
                        <div className="flex items-start gap-2 mt-2">
                            <Skeleton className="h-5 w-5 rounded-sm mt-1" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>
            )}

            {!loading && trip && (
                <BookingStepLayout
                    step={4}
                    trip={trip}
                    onNext={handleSubmit(onSubmit)}
                    onPrev={() => router.push(`/book/${numericId}/step3`)}
                >
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Price Breakdown Card */}
                        <div
                            className="bg-white rounded-3xl shadow-md border border-[#f0f0f0] px-5 py-5 mb-4"
                            style={{
                                fontFamily: "'Century Gothic', sans-serif",
                            }}
                        >
                            <div className="text-lg font-bold text-black mb-2">
                                Price Breakdown
                            </div>

                            <div className="flex justify-between items-center mb-1 text-base">
                                <span className="text-black">
                                    {perPerson.toLocaleString()} Br x {people}{" "}
                                    Person
                                </span>
                                <span className="text-black">.</span>
                                <span className="text-black">
                                    {(perPerson * people).toLocaleString()}Br
                                </span>
                            </div>

                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="text-gray-400">
                                    Service fee
                                </span>
                                <span className="text-gray-400">
                                    {serviceFee}Br
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-400">
                                    Processing fee
                                </span>
                                <span className="text-gray-400">
                                    {processingFee}Br
                                </span>
                            </div>

                            <hr className="border-gray-400 my-2" />

                            <div className="flex justify-between items-center mt-1">
                                <span className="text-lg font-bold text-black">
                                    Total
                                </span>
                                <span className="text-lg font-bold text-[#26cc73]">
                                    {total.toLocaleString()}Br
                                </span>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div
                            className="mt-7 ml-3"
                            style={{
                                fontFamily: "'Century Gothic', sans-serif",
                            }}
                        >
                            <div className="text-xl font-bold text-black mb-1">
                                Terms & Conditions
                            </div>
                            <div className="flex items-start gap-2 mt-2">
                                {/* register the field so RHF tracks it */}
                                <input type="hidden" {...register("agreed")} />
                                <Checkbox
                                    id="agree"
                                    className="mt-1 border-2 border-[#26cc73] focus:ring-0 focus:ring-offset-0"
                                    onCheckedChange={(checked) =>
                                        setValue("agreed", !!checked, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        })
                                    }
                                />
                                <label
                                    htmlFor="agree"
                                    className="text-sm font-semibold text-gray-500 select-none"
                                >
                                    <span className="font-semibold text-green">
                                        I agree to the Terms of Service and
                                        Privacy Policy.
                                    </span>{" "}
                                    <span className="font-normal text-gray-500">
                                        I understand the cancellation policy and
                                        acknowledge that this adventure involves
                                        physical activity and inherent risks.
                                    </span>
                                </label>
                            </div>
                            {errors.agreed && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.agreed.message}
                                </p>
                            )}
                        </div>
                    </form>
                </BookingStepLayout>
            )}
        </>
    );
}
