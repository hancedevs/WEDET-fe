"use client";

import Link from "next/link";
import PlaceNameCard from "@/app/components/ui/Card";
import type { TravelCardVM } from "@/lib/toursRepo";

export default function TopRecommended({ cards }: { cards: TravelCardVM[] }) {
    const top8 = (cards ?? []).slice(0, 8);

    return (
        <div
            className="w-full "
            style={{
                fontFamily: "'Century Gothic', sans-serif",
                fontWeight: 200,
            }}
        >
            <div className="flex gap-2 justify-between pt-4">
                <h2 className="text-sm text-[#959494] font-light mb-4 px-4">
                    Top Recommended
                </h2>
                <span className="pr-5 text-sm font-light text-[#959494]">
                    See all
                </span>
            </div>

            <div className="overflow-x-auto px-3 hide-scrollbar">
                <div className="flex gap-2 pb-4 snap-mandatory scroll-smooth">
                    {top8.map((item) => (
                        <Link
                            key={item.id}
                            href={`/pages/Detail/${item.id}`}
                            className="snap-start shrink-0 block"
                        >
                            <PlaceNameCard
                                image={item.imageUrl}
                                name={item.placeName}
                                location={item.location}
                                percentage={item.discountPercent ?? 0}
                                value={String(item.reviews ?? 0)}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
