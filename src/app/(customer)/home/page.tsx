"use client";

import { JSX, useEffect } from "react";
import NavBar from "@/components/ui/navBar";
import Header from "@/components/ui/Header";
import TopRecommended from "@/components/ui/TopRecomanded";
import CategorySelector from "@/components/ui/catagory";
import TravelCard from "@/components/ui/travelcard";
import { useHomeDataStore } from "@/stores/useHomeDataStore";
import SkeletonTripCard from "@/components/ui/SkeletonTripCard";
import SkeletonTopRecommended from "@/components/ui/SkeletonTopRecommended";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Convert "2,700" -> 2700 safely
function toNum(v: string | number | null | undefined): number | undefined {
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    if (typeof v === "string") {
        const n = Number(v.replace(/[^\d.-]/g, ""));
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
}

export default function Page(): JSX.Element {
    const { cards, loading, ensure } = useHomeDataStore();

    useEffect(() => {
        void ensure(12);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showInitialSkeletons = loading && cards.length === 0;

    return (
        <div className=" pb-32">
            {/* Top Recommended */}
            {showInitialSkeletons ? (
                <SkeletonTopRecommended />
            ) : (
                <TopRecommended cards={cards} />
            )}

            <CategorySelector />

            <div className="flex items-center ml-5 justify-between mb-1">
                <h2
                    className="text-gray-500 text-xs"
                    style={{
                        fontFamily: "'Century Gothic', sans-serif",
                        fontWeight: 500,
                    }}
                >
                    Tips for you
                </h2>
                <button
                    className="text-gray-400 text-xs mr-4"
                    style={{
                        fontFamily: "'Century Gothic', sans-serif",
                        fontWeight: 300,
                    }}
                >
                    See all
                </button>
            </div>

            {/* Trip list */}
            {showInitialSkeletons ? (
                <div className="p-2 grid grid-cols-1 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonTripCard key={i} />
                    ))}
                </div>
            ) : cards.length === 0 ? (
                <div className="p-2 text-xs text-gray-400">No trips yet.</div>
            ) : (
                <>
                    {loading && (
                        <div className="px-4 pb-2">
                            <Skeleton className="h-3 w-24 rounded" />
                        </div>
                    )}

                    <div className="p-2 grid grid-cols-1 gap-6">
                        {cards.map((c, i) => {
                            const tooltip = c.agencyAbout
                                ? `${c.agencyName} — ${c.agencyAbout}`
                                : c.agencyName;

                            return (
                                <Link
                                    key={c.id}
                                    href={`/trip/${c.id}`}
                                    className="block"
                                    title={tooltip}
                                >
                                    <TravelCard
                                        imageUrl={c.imageUrl}
                                        placeName={c.placeName}
                                        location={c.location}
                                        tripDuration={c.tripDuration}
                                        price={toNum(c.price) ?? 0}
                                        oldPrice={toNum(c.oldPrice)}
                                        discountPercent={c.discountPercent}
                                        rating={c.rating}
                                        reviews={c.reviews}
                                        agencyName={c.agencyName}
                                        priority={i < 2}
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
