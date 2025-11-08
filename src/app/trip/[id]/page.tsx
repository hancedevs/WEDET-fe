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
    X,
    Verified, // Import the 'X' icon for closing the modal
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import NavBar from "@/components/ui/navBar";

import ResortPage from "@/components/ui/Bilbord";
import TravelCard from "../../../components/ui/travelcard";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    buildActivitiesJson,
    diffDaysInclusive,
    fmtMoneyStr,
    getNumberField,
    getStringArray,
    getStringField,
    toImageUrlFromStorageKey,
} from "@/lib/utils";
import Detailfilter from "@/components/ui/UserDetailFilter";

export default function TourPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const numericId = useMemo(() => Number(id), [id]);

    const [loading, setLoading] = useState(true);

    const [currentImage, setCurrentImage] = useState(0);
    const [Images, setImages] = useState<string[]>([]);

    // NEW STATE: To control the full-screen image preview
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [locationText, setLocationText] = useState("");
    const [durationDays, setDurationDays] = useState(0);
    const [discountPercent, setDiscountPercent] = useState<number | undefined>(
        undefined
    );
    const [priceNowStr, setPriceNowStr] = useState("");
    const [priceOldStr, setPriceOldStr] = useState("");
    const [groupSize, setGroupSize] = useState<number | undefined>(undefined);

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

    // Function to handle image click and open the preview
    const openImagePreview = () => {
        if (Images.length > 0) {
            setIsPreviewOpen(true);
        }
    };

    return (
        <div className="w-full mx-auto  bg-white ">
            {/* HERO */}
            <div
                className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full overflow-hidden cursor-pointer"
                onClick={openImagePreview} // ADDED: Click handler to open the preview
            >
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

                <div className="absolute inset-0 bg-black/10" />

                {/* Controls (Back, Heart, Dots) are kept for good UX */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <button
                        className="p-2 bg-white/80 rounded-full hover:bg-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            backToHome();
                        }}
                    >
                        <ArrowLeft size={20} className="text-green-500" />
                    </button>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <button
                        className="p-2 bg-white/80 rounded-full hover:bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Heart size={20} className="text-green-500" />
                    </button>
                </div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {Images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImage(index);
                            }}
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
                <div className="bg-white relative mt-[-1.5rem] left-1/2 transform -translate-x-1/2 w-full max-w-4xl shadow-lg rounded-t-[35px] p-4 pb-36 lg:mb-36 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0 mb-0">
                        <div className="flex-1 min-w-[180px] flex flex-col gap-2">
                            {loading ? (
                                <Skeleton className="h-6 w-2/3 mb-0" />
                            ) : title ? (
                                <h1 className="text-lg sm:text-xl font-bold leading-tight break-words whitespace-normal max-w-full mb-1">
                                    {title}
                                </h1>
                            ) : null}
                            {/* Ratings and badge row */}
                            <div className="flex items-center gap-2 mt-1">
                                <Star
                                    size={15}
                                    className="text-yellow-500 fill-yellow-500"
                                />
                                <span className="text-sm font-semibold text-black">
                                    4.7
                                </span>
                                <span className="text-xs text-gray-400 font-semibold">
                                    (156 reviews)
                                </span>
                                <span className="px-2 py-0.5 rounded-full border border-green-400 text-green-600 text-xs font-semibold ml-2">
                                    Moderate
                                </span>
                            </div>
                            {/* Location row (untouched, uses real locationText) */}
                            <div className="flex items-center mt-1 text-[#959494] font-light text-xs mb-3">
                                <MapPin
                                    size={15}
                                    className="mr-1 text-[#28B872]"
                                />
                                {loading ? (
                                    <Skeleton className="h-3 w-24" />
                                ) : locationText ? (
                                    <span>{locationText}</span>
                                ) : null}
                            </div>
                        </div>
                        {/* Price box - right-aligned, compact, vertical */}
                        <div className="flex flex-col items-end min-w-[120px] max-w-full mt-1">
                            {typeof discountPercent === "number" &&
                                discountPercent > 0 && (
                                    <span className="inline-block bg-[#F00505] rounded-full text-white px-3 py-0.5 font-bold text-xs whitespace-nowrap min-w-fit w-auto mb-2">
                                        Save {discountPercent}%
                                    </span>
                                )}
                            {priceNowStr ? (
                                <span className="text-green-500 font-bold text-lg leading-tight">
                                    {priceNowStr}
                                </span>
                            ) : null}
                            {priceOldStr ? (
                                <span className="text-[#A6A6A6] text-xs line-through">
                                    {priceOldStr}
                                </span>
                            ) : null}
                            <span className="text-[#A6A6A6] text-xs font-semibold">
                                {priceNowStr ? "per person" : ""}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-wrap font-bold gap-2 px-1 sm:px-13">
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
                    <div className="mb-6 border border-[#E9F4F4] pl-8 sm:px-10 py-3 sm:py-5 rounded-[35px] flex flex-wrap justify-between gap-4 sm:gap-0">
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
                    <div className="shadow-xl bg-white flex flex-col rounded-[35px] p-4 mb-6 ">
                        <div className="flex flex-row justify-between items-center mb-4 flex-nowrap gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="h-12 w-12 sm:h-15 sm:w-15 rounded-full overflow-hidden border-2 border-green-500">
                                    <img
                                        src={"https://github.com/shadcn.png"} // Placeholder for the actual image, assuming shadcn.png is used here for simplicity as the original is an Ethiopian name and the code uses a placeholder
                                        alt={"Abebe balcha"}
                                        className="object-cover h-full w-full"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex gap-2 items-center">
                                        <h3 className="font-bold text-base sm:text-lg truncate">
                                            Abebe balcha
                                        </h3>
                                        {/* BadgeCheck icon (simulated with a green checkmark/emoji for pure HTML/Tailwind, or using a component if available) */}
                                        <span className="text-green-700 w-5 h-5 font-extrabold text-xl leading-none">
                                            <Verified />
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm truncate">
                                        18 years experience
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 min-w-[120px]">
                                <span className="text-[#959494] font-semibold text-sm truncate">
                                    Your Expert Guide
                                </span>
                                <div className="flex items-center  w-full justify-center">
                                    {/* Star icon (simulated with a yellow star emoji) */}
                                    <span className="text-yellow-500 text-lg leading-none">
                                        &#9733;
                                    </span>
                                    <span className="ml-1 text-base font-medium">
                                        4.7
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="ml-0 sm:ml-0">
                            <p className="text-[#4e4d4d] sm:text-left text-sm mb-4">
                                Carlos is a naturalist guide born in the Amazon
                                basin. His encyclopedic knowledge of rain
                                ecology, combined with his ability to spot even
                                the most elusive wildlife, makes him one of
                                Peru's most respected jungle guides.
                            </p>
                            <p className="text-[#4e4d4d] text-justify font-bold text-sm mb-2">
                                Specialties:
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["Wildlife", "jungle", "Culture"].map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-center border border-[#E9F4F4] text-black rounded-[35px] px-3 py-1 text-xs sm:text-sm shadow-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className="text-center border border-[#E9F4F4] text-black rounded-[35px] px-3 py-1 text-xs sm:text-sm shadow-sm">
                                Wildlife
                            </span>
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
                </div>
                <div className="fixed bottom-0 w-full bg-white p-4 sm:p-6 lg:flex lg:justify-center">
                    <button
                        className={`w-full lg:w-1/2 xl:w-1/3 flex items-center justify-center py-3 rounded-[35px] font-bold transition-colors text-sm sm:text-base cursor-pointer ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#28B872] hover:bg-[#28B880] text-white"
                        }`}
                        onClick={async () => {
                            if (loading) return;

                            setLoading(true);
                            const { data: userData } =
                                await supabase.auth.getUser();
                            const user = userData?.user;
                            if (!user) {
                                router.push("/auth/login");
                                return;
                            }

                            const { data: tickets } = await supabase
                                .from("tickets")
                                .select("id")
                                .eq("user_id", user.id)
                                .limit(1);

                            if (tickets && tickets.length > 0) {
                                router.push(
                                    `/book/${numericId}/book-destination`
                                );
                            } else {
                                router.push(
                                    `/book/${numericId}/book-destination`
                                );
                            }

                            setLoading(false);
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            </div>
                        ) : (
                            "Book now!"
                        )}
                    </button>
                </div>
            </div>

            {/* NEW: Full-Screen Image Preview Modal */}
            {isPreviewOpen && Images.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/30 rounded-full hover:bg-white/50 z-20"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPreviewOpen(false);
                        }}
                    >
                        <X size={24} className="text-white" />
                    </button>

                    <div className="relative w-full h-full max-w-7xl max-h-screen">
                        {/* Only display the current image in the modal */}
                        <Image
                            src={Images[currentImage]}
                            alt={`Full-screen view of image ${
                                currentImage + 1
                            }`}
                            fill
                            className="object-contain"
                            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking the image
                        />

                        {/* Navigation arrows for multiple images */}
                        {Images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/40 transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImage(
                                            (prev) =>
                                                (prev - 1 + Images.length) %
                                                Images.length
                                        );
                                    }}
                                >
                                    <ChevronLeft
                                        size={24}
                                        className="text-white"
                                    />
                                </button>
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/40 transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImage(
                                            (prev) => (prev + 1) % Images.length
                                        );
                                    }}
                                >
                                    <ChevronLeft
                                        size={24}
                                        className="text-white transform rotate-180"
                                    />
                                </button>
                            </>
                        )}

                        {/* Image counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                            {currentImage + 1} / {Images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
