"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { Heart, Star, MapPin, Calendar } from "lucide-react";
import type { TravelCardProps } from "@/types/type";
import { optimizeImageUrl } from "@/lib/img";
import { Skeleton } from "@/components/ui/skeleton";

type Extra = { priority?: boolean; imageWidth?: number; imageQuality?: number };

// helpers: robust numeric parsing + currency formatting
function toNumber(v: number | string | undefined): number | undefined {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
        // strip all but digits, dot, minus
        const cleaned = v.replace(/[^\d.-]/g, "");
        if (!cleaned) return undefined;
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
}

function formatETB(v: number | string | undefined): string {
    const n = toNumber(v);
    if (typeof n === "number") {
        return new Intl.NumberFormat("en-ET", {
            style: "currency",
            currency: "ETB",
            maximumFractionDigits: 0,
        }).format(n);
    }
    // fallback: if it's already a string like "2,700 Br", show as-is
    return typeof v === "string" ? v : "";
}

function TravelCardBase(props: TravelCardProps & Extra) {
    const {
        imageUrl,
        placeName,
        location,
        tripDuration,
        price,
        oldPrice,
        discountPercent,
        rating,
        reviews,
        agencyName,
        priority = false,
        imageWidth = 960,
        imageQuality = 70,
    } = props;

    const [loaded, setLoaded] = useState(false);
    const src = optimizeImageUrl(imageUrl, imageWidth, imageQuality);

    const hasDiscount =
        typeof discountPercent === "number" && discountPercent > 0;
    const priceNum = toNumber(price);
    const oldPriceNum = toNumber(oldPrice);
    const hasOldPrice = typeof oldPriceNum === "number";
    const hasRating = typeof rating === "number";
    const ratingNum = hasRating ? (rating as number) : undefined;

    return (
        <article
            className="relative w-full rounded-3xl overflow-hidden shadow-lg"
            aria-label={`${placeName} in ${location}`}
        >
            <div className="relative w-full h-60">
                {!loaded && (
                    <Skeleton className="absolute inset-0 h-full w-full" />
                )}

                <Image
                    src={src}
                    alt={placeName ?? "Destination"}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                        loaded ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 960px"
                    priority={priority}
                    loading={priority ? "eager" : "lazy"}
                    onLoad={() => setLoaded(true)}
                />

                <div className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm rounded-full p-2">
                    <Heart className="text-gray-700 w-4 h-4" aria-hidden />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
                    <div className="text-white space-y-1 mt-auto">
                        <h3 className="text-lg font-bold leading-tight line-clamp-1">
                            {placeName}
                        </h3>
                        <p className="text-sm flex items-center gap-1 text-gray-200">
                            <MapPin className="w-4 h-4" aria-hidden />
                            <span className="line-clamp-1">{location}</span>
                        </p>
                        <div className="flex items-center gap-1 text-gray-200">
                            <Calendar className="w-4 h-4" aria-hidden />
                            <span>{tripDuration}</span>
                        </div>
                    </div>

                    <div className="mt-2 flex items-end justify-between text-white">
                        <div className="flex items-center gap-2 min-w-0">
                            <div
                                className="w-5 h-5 rounded-full border-2 border-green-400"
                                aria-hidden
                            />
                            {agencyName && (
                                <p className="text-sm truncate">{agencyName}</p>
                            )}
                        </div>

                        <div className="flex flex-col items-center">
                            {hasRating && (
                                <div className="flex items-center gap-1">
                                    <Star
                                        className="w-4 h-4 text-yellow-400"
                                        aria-hidden
                                    />
                                    <span>
                                        {typeof ratingNum === "number" &&
                                        ratingNum <= 5
                                            ? ratingNum.toFixed(1)
                                            : `${ratingNum}%`}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-sm text-gray-200 mt-1">
                                {typeof reviews === "number" && (
                                    <span>{reviews}</span>
                                )}
                                <div className="flex -space-x-2">
                                    <Image
                                        src="/fox.jpg"
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="rounded-full border-2 border-white"
                                    />
                                    <Image
                                        src="/image1.jpg"
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="rounded-full border-2 border-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            {hasDiscount && (
                                <div className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-2xl font-bold mb-1">
                                    {discountPercent}% OFF
                                </div>
                            )}
                            <div className="text-green-400 font-bold text-lg">
                                {formatETB(price)}
                            </div>
                            {hasOldPrice && (
                                <div className="line-through text-gray-300 text-sm">
                                    {formatETB(oldPrice)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default memo(TravelCardBase);
