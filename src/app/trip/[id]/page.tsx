"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
    ChevronLeft,
    Heart,
    Star,
    MapPin,
    BadgeCheck,
    ArrowLeftCircle,
    ArrowLeft,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import NavBar from "@/components/ui/navBar";
import Detailfilter from "@/components/ui/Detailfilter";
import ResortPage from "@/components/ui/Bilbord";
import TravelCard from "../../../components/ui/travelcard";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ---------- light helpers (no changes to your Detailfilter) ---------- */
const DEFAULT_TOUR_BUCKET = "tours";
const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);
const getStringField = (obj: Record<string, unknown>, k: string) =>
    typeof obj[k] === "string" ? (obj[k] as string) : undefined;
const getNumberField = (obj: Record<string, unknown>, k: string) =>
    typeof obj[k] === "number" && Number.isFinite(obj[k] as number)
        ? (obj[k] as number)
        : undefined;
const getStringArray = (v: unknown): string[] | undefined =>
    Array.isArray(v) && v.every((x) => typeof x === "string")
        ? (v as string[])
        : undefined;

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
function fmtMoneyStr(n?: number | null): string {
    if (!Number.isFinite(n as number)) return "";
    return new Intl.NumberFormat("en-ET", { maximumFractionDigits: 0 }).format(
        n as number
    );
}
function diffDaysInclusive(a?: string | null, b?: string | null): number {
    if (!a || !b) return 0;
    const da = new Date(a);
    const db = new Date(b);
    if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 0;
    const ms = db.getTime() - da.getTime();
    return Math.max(1, Math.round(ms / (24 * 3600 * 1000)) + 1);
}

/** Build activities JSON string compatible with Detailfilter:
 * {
 *   "day1": { "activities": [{ "time": "08:00", "activity": "..." }], "meals": {...} },
 *   "day2": { ... }
 * }
 */
function buildActivitiesJson(val: unknown): string | undefined {
    // if DB already stores correct JSON string, keep it
    if (typeof val === "string") {
        try {
            JSON.parse(val);
            return val;
        } catch {
            /* fall through and try to convert */
        }
    }

    // if we got an array of {time?, activity?}
    if (Array.isArray(val)) {
        const normalized = val
            .filter((x) => x && typeof x === "object")
            .map((x) => {
                const o = x as Record<string, unknown>;
                return {
                    time: typeof o.time === "string" ? o.time : undefined,
                    activity:
                        typeof o.activity === "string" ? o.activity : undefined,
                };
            });

        if (normalized.length) {
            const obj: Record<string, unknown> = {};
            // put all into day1 (we don't know day boundaries from array)
            obj["day1"] = { activities: normalized };
            return JSON.stringify(obj);
        }
    }

    // give up
    return undefined;
}

/* ---------- page ---------- */
export default function TourPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const numericId = useMemo(() => Number(id), [id]);

    const [loading, setLoading] = useState(true);

    // slideshow
    const [currentImage, setCurrentImage] = useState(0);
    const [Images, setImages] = useState<string[]>([]);

    // header data
    const [title, setTitle] = useState("");
    const [locationText, setLocationText] = useState("");
    const [durationDays, setDurationDays] = useState(0);
    const [discountPercent, setDiscountPercent] = useState<number | undefined>(
        undefined
    );
    const [priceNowStr, setPriceNowStr] = useState("");
    const [priceOldStr, setPriceOldStr] = useState("");
    const [groupSize, setGroupSize] = useState<number | undefined>(undefined);

    // 👉 single object for Detailfilter
    const [tourData, setTourData] = useState<
        | {
              id?: number;
              overview?: string;
              highlights?: string;
              includes?: string[];
              notIncludes?: string[];
              essentialEquipment?: string[];
              activities?: string; // JSON string for Detailfilter
          }
        | undefined
    >(undefined);

    // Add state for business profile
    const [businessProfile, setBusinessProfile] = useState<{
        business_name?: string;
        about?: string;
    } | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    const backToHome = () => router.back();

    useEffect(() => {
        if (!Images.length) return;
        const idTimer = setInterval(
            () => setCurrentImage((prev) => (prev + 1) % Images.length),
            5000
        );
        return () => clearInterval(idTimer);
    }, [Images.length]);

    useEffect(() => {
        if (!numericId || Number.isNaN(numericId)) return;
        let mounted = true;

        (async () => {
            setLoading(true);

            const { data: row, error } = await supabase
                .from("tours")
                .select("*")
                .eq("id", numericId)
                .maybeSingle();

            if (!mounted) return;

            if (!error && row) {
                const r = row as Record<string, unknown>;

                // photos
                const rawPhotos = getStringArray(r.photos) ?? [];
                const resolved = await Promise.all(
                    rawPhotos.map((p) =>
                        toImageUrlFromStorageKey(p).catch(() => p)
                    )
                );
                setImages(resolved);

                // title/location
                const name = (getStringField(r, "tourName") ?? "").trim();
                const loc = (getStringField(r, "destination") ?? "").trim();
                setTitle(name && loc ? `${name}, ${loc}` : name || loc);
                setLocationText(loc);

                // pricing
                const disc = getNumberField(r, "discount");
                const total = getNumberField(r, "total");
                const price = getNumberField(r, "price");
                const now = total ?? price;
                const old =
                    disc && disc > 0 && typeof price === "number"
                        ? price
                        : undefined;

                setDiscountPercent(disc);
                setPriceNowStr(
                    now !== undefined ? `${fmtMoneyStr(now)} Br` : ""
                );
                setPriceOldStr(
                    old !== undefined ? `${fmtMoneyStr(old)} Br` : ""
                );

                // duration
                const start_date = getStringField(r, "start_date") ?? null;
                const end_date = getStringField(r, "end_date") ?? null;
                setDurationDays(diffDaysInclusive(start_date, end_date));

                // group size
                setGroupSize(getNumberField(r, "group_number"));

                // ---- build the object Detailfilter expects
                setTourData({
                    id: typeof r.id === "number" ? (r.id as number) : undefined,
                    overview: getStringField(r, "overview"),
                    highlights: getStringField(r, "highlights"),
                    includes: getStringArray(r.includes) ?? [],
                    notIncludes: getStringArray(r.notIncludes) ?? [],
                    essentialEquipment:
                        getStringArray(r.essentialEquipment) ?? [],
                    activities: buildActivitiesJson(r.activities), // critical: JSON string
                });

                // Fetch business profile
                const businessUserId = r.business_user_id;
                if (businessUserId && typeof businessUserId === "string") {
                    const { data: profileData, error: profileError } =
                        await supabase
                            .from("business_profiles")
                            .select("business_name, about")
                            .eq("user_id", businessUserId)
                            .single();

                    if (!mounted) return;
                    if (!profileError && profileData) {
                        setBusinessProfile(profileData);
                    }
                }
            }

            setLoading(false);
            setProfileLoading(false);
        })();

        return () => {
            mounted = false;
        };
    }, [numericId]);

    return (
        <div className="w-full mx-auto bg-white ">
            {/* HERO */}
            <div className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full overflow-hidden">
                {(loading || Images.length === 0) && (
                    <Skeleton className="absolute inset-0 h-full w-full" />
                )}

                {Images.map((img, index) => (
                    <Image
                        key={index}
                        src={img}
                        fill
                        alt={`Tour image ${index + 1}`}
                        className={`object-cover transition-opacity duration-700 ${
                            currentImage === index ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}

                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <button className="p-2 bg-white/80 rounded-full hover:bg-white">
                        <ArrowLeft
                            size={20}
                            className="text-green-500"
                            onClick={backToHome}
                        />
                    </button>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <button className="p-2 bg-white/80 rounded-full hover:bg-white">
                        <Heart size={20} className="text-green-500" />
                    </button>
                </div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {Images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                currentImage === index
                                    ? "bg-green-500"
                                    : "bg-white/50 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-20">
                <div className="bg-white relative mt-[-1.5rem] left-1/2 transform -translate-x-1/2 w-full max-w-4xl border rounded-t-[35px] p-4 sm:p-5">
                    <div className="mb-4 mt-3">
                        {/* Title */}
                        {loading ? (
                            <Skeleton className="h-6 w-2/3 mb-2" />
                        ) : title ? (
                            <h1 className="text-xl sm:text-2xl font-bold">
                                {title}
                            </h1>
                        ) : null}

                        {/* Ratings row — skeletons only */}
                        <div className="flex flex-wrap items-center mt-1 gap-2">
                            <div className="flex items-center">
                                <Star
                                    size={16}
                                    className="text-yellow-500 fill-yellow-500"
                                />
                                {loading ? (
                                    <Skeleton className="h-3 w-10 ml-2" />
                                ) : null}
                            </div>
                            {loading ? <Skeleton className="h-3 w-24" /> : null}
                            {loading ? (
                                <Skeleton className="h-5 w-16 rounded-full" />
                            ) : null}
                        </div>

                        {/* Location */}
                        <div className="flex items-center mt-2 text-[#959494] font-light text-sm">
                            <MapPin size={14} className="mr-1 text-[#28B872]" />
                            {loading ? (
                                <Skeleton className="h-3 w-24" />
                            ) : locationText ? (
                                <span>{locationText}</span>
                            ) : null}
                        </div>

                        {/* Price box */}
                        <div className="absolute top-7 right-5 rounded-lg p-1 sm:p-3 text-right z-10">
                            {loading ? (
                                <>
                                    <Skeleton className="h-5 w-24 rounded-3xl mb-2" />
                                    <Skeleton className="h-6 w-24 mb-1" />
                                    <Skeleton className="h-4 w-20" />
                                </>
                            ) : (
                                <>
                                    {typeof discountPercent === "number" &&
                                        discountPercent > 0 && (
                                            <div className="bg-[#F00505] rounded-[35px] text-white px-2 py-1 font-bold text-xs sm:text-sm">
                                                Save {discountPercent}%
                                            </div>
                                        )}
                                    {priceNowStr ? (
                                        <div className="text-green-600 font-bold text-lg sm:text-xl">
                                            {priceNowStr}
                                        </div>
                                    ) : null}
                                    {priceOldStr ? (
                                        <div className="text-[#A6A6A6] text-xs sm:text-sm line-through mr-2 sm:mr-6">
                                            {priceOldStr}
                                        </div>
                                    ) : null}
                                    <div className="text-[#A6A6A6] text-[10px] sm:text-xs mr-1 sm:mr-4">
                                        {priceNowStr ? "per person" : ""}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-wrap font-bold gap-1 px-1 sm:px-13">
                            {["Wildlife", "Jungle", "Culture", "Wildlife"].map(
                                (tag, i) => (
                                    <span
                                        key={i}
                                        className="flex-1 text-center border border-[#E9F4F4] text-black font-semibold rounded-[35px] px-3 sm:px-3 py-1 text-xs sm:text-sm"
                                    >
                                        {tag}
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    {/* Facts row */}
                    <div className="mb-6 border border-[#E9F4F4] pl-8 sm:px-10 py-3 sm:py-5 rounded-[35px] flex justify-between sm:gap-0">
                        <div className="min-w-[80px]">
                            <div className="text-xs text-[#959494]">
                                Duration
                            </div>
                            {loading ? (
                                <Skeleton className="h-4 w-12" />
                            ) : durationDays > 0 ? (
                                <div className="font-medium text-[#28B872]">
                                    {durationDays} Days
                                </div>
                            ) : null}
                        </div>

                        <div className="min-w-[80px]">
                            <div className="text-xs text-[#959494]">
                                Group Size
                            </div>
                            {loading ? (
                                <Skeleton className="h-4 w-10" />
                            ) : typeof groupSize === "number" ? (
                                <div className="font-medium text-[#28B872]">
                                    {groupSize}{" "}
                                    {groupSize === 1 ? "person" : "people"}
                                </div>
                            ) : null}
                        </div>

                        <div className="min-w-[80px]">
                            <div className="text-xs text-[#959494]">
                                Min Age
                            </div>
                            {loading ? <Skeleton className="h-4 w-8" /> : null}
                        </div>
                    </div>

                    {/* Guide card (actual data) */}
                    <div className="shadow-xl bg-white flex flex-col rounded-[35px] p-3 sm:p-4">
                        <div className="flex flex-row justify-between items-center mb-4 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2 min-w-0">
                                <Avatar className="h-12 w-12 sm:h-15 sm:w-15 border-2 border-green-500">
                                    {profileLoading ? (
                                        <AvatarFallback>
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                        </AvatarFallback>
                                    ) : (
                                        <>
                                            <AvatarImage
                                                src={
                                                    "https://github.com/shadcn.png"
                                                }
                                                alt={
                                                    businessProfile?.business_name ||
                                                    "Business"
                                                }
                                            />
                                            <AvatarFallback>
                                                {businessProfile?.business_name
                                                    ?.substring(0, 2)
                                                    .toUpperCase() || "BP"}
                                            </AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <div className="min-w-0">
                                    {profileLoading ? (
                                        <>
                                            <Skeleton className="h-4 w-32 mb-2" />
                                            <Skeleton className="h-3 w-24" />
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex gap-2 items-center">
                                                <h3 className="font-bold text-sm sm:text-base truncate">
                                                    {businessProfile?.business_name ||
                                                        "Tour Operator"}
                                                </h3>
                                                <BadgeCheck
                                                    strokeWidth={3}
                                                    className="text-green-700 w-4 h-4 sm:w-5 sm:h-5"
                                                />
                                            </div>
                                            <p className="text-gray-500 text-xs sm:text-sm truncate">
                                                {"Professional tour guide"}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 min-w-[120px]">
                                <span className="text-[#959494] font-semibold text-xs sm:text-sm truncate">
                                    Your Expert Guide
                                </span>
                                {profileLoading ? (
                                    <Skeleton className="h-4 w-10" />
                                ) : (
                                    <div className="flex items-center justify-end">
                                        <Star
                                            size={16}
                                            className="text-yellow-500"
                                        />
                                        <span className="ml-1 text-sm font-medium">
                                            4.8
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="ml-12">
                            {profileLoading ? (
                                <>
                                    <Skeleton className="h-3 w-full mb-2" />
                                    <Skeleton className="h-3 w-3/4" />
                                </>
                            ) : (
                                <p className="text-[#959494] text-justify font-bold text-xs sm:text-sm px-2 sm:px-16 mb-4 max-w-[400]">
                                    {businessProfile?.about ||
                                        "Professional tour operator with extensive experience in creating memorable travel experiences."}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1 px-1 sm:px-13">
                            {["Adventure", "Culture", "Nature", "Guided"].map(
                                (tag, i) => (
                                    <span
                                        key={i}
                                        className="flex-1 text-center border border-[#E9F4F4] text-black font-semibold rounded-[35px] px-3 sm:px-3 py-1 text-xs sm:text-sm"
                                    >
                                        {tag}
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    {/* 🔗 Detailfilter gets one prop: tourData */}
                    <div className="w-full max-w-full overflow-hidden">
                        <Detailfilter tourData={tourData} />
                    </div>

                    {/* Billboard */}
                    <ResortPage />

                    {/* Bottom card */}
                    {loading ? (
                        <div className="mt-4">
                            <Skeleton className="h-60 w-full rounded-3xl" />
                        </div>
                    ) : Images.length ||
                      title ||
                      locationText ||
                      priceNowStr ? (
                        <TravelCard
                            imageUrl={Images[0] || "/tipsimage.png"}
                            placeName={(title.split(",")[0] || "").trim()}
                            location={locationText}
                            tripDuration={
                                durationDays > 0
                                    ? `${durationDays} day's trip`
                                    : ""
                            }
                            price={priceNowStr}
                            oldPrice={priceOldStr || undefined}
                            discountPercent={discountPercent}
                            rating={0}
                            reviews={0}
                            agencyName=""
                        />
                    ) : null}

                    <button
                        className="w-full bg-[#28B872] hover:bg-[#28B880] text-white py-3 mt-6 sm:mt-10 mb-16 sm:mb-20 rounded-[35px] font-bold transition-colors text-sm sm:text-base cursor-pointer"
                        onClick={() => router.push(`/book/${numericId}/step1`)}
                        disabled={loading}
                    >
                        {loading ? "…" : "Book now!"}
                    </button>
                </div>
            </div>
        </div>
    );
}
