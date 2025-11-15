"use client";

import { JSX, useEffect, useMemo } from "react";
import Link from "next/link";
import { useHomeDataStore } from "@/stores/useHomeDataStore";
import TravelCard from "@/components/ui/travelcard";
import SkeletonTripCard from "@/components/ui/SkeletonTripCard";
import SkeletonTopRecommended from "@/components/ui/SkeletonTopRecommended";
import TopRecommended from "@/components/ui/TopRecomanded";
import CategorySelector from "@/components/ui/catagory";
import { Skeleton } from "@/components/ui/skeleton";

function toNum(v: string | number | null | undefined): number | undefined {
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    if (typeof v === "string") {
        const n = Number(v.replace(/[^\d.-]/g, ""));
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
}

export default function Page(): JSX.Element {
    const cards = useHomeDataStore((s) => s.cards);
    const loading = useHomeDataStore((s) => s.loading);
    const ensure = useHomeDataStore((s) => s.ensure);
    const query = useHomeDataStore((s) => s.query);

    useEffect(() => {
        void ensure(12);
    }, [ensure]);

    const filteredCards = useMemo(() => {
        if (!query.trim()) return cards;
        const q = query.toLowerCase();
        return cards.filter(
            (c) =>
                c.placeName?.toLowerCase().includes(q) ||
                c.location?.toLowerCase().includes(q) ||
                c.agencyName?.toLowerCase().includes(q)
        );
    }, [cards, query]);

    const showInitialSkeletons = loading && cards.length === 0;

    return (
        <div className="pb-32">
            {showInitialSkeletons ? (
                <SkeletonTopRecommended />
            ) : query.trim() === "" ? (
                <TopRecommended cards={cards} />
            ) : null}

            <CategorySelector />

            <div className="flex items-center ml-5 justify-between mb-1">
                <h2
                    className="text-gray-500 text-xs"
                    style={{
                        fontFamily: "'Red Hat', sans-serif",
                        fontWeight: 500,
                    }}
                >
                    Tips for you
                </h2>
                <button
                    className="text-gray-400 text-xs mr-4"
                    style={{
                        fontFamily: "'Red Hat', sans-serif",
                        fontWeight: 300,
                    }}
                >
                    See all
                </button>
            </div>

            {showInitialSkeletons ? (
                <div className="p-2 grid grid-cols-1 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonTripCard key={i} />
                    ))}
                </div>
            ) : filteredCards.length === 0 ? (
                <div className="p-2 text-xs text-gray-400  text-center">
                    No trips found.
                </div>
            ) : (
                <>
                    {loading && (
                        <div className="px-4 pb-2">
                            <Skeleton className="h-3 w-24 rounded" />
                        </div>
                    )}
                    <div className="p-2 grid grid-cols-1 gap-6">
                        {filteredCards.map((c, i) => (
                            <Link
                                key={c.id}
                                href={`/trip/${c.id}`}
                                className="block"
                                title={
                                    c.agencyAbout
                                        ? `${c.agencyName} — ${c.agencyAbout}`
                                        : c.agencyName
                                }
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
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
