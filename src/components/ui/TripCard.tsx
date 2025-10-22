"use client";

import Image from "next/image";
import { Trip } from "@/types/type";
import { MapPin, Tag, Calendar } from "lucide-react";
import React from "react";

type Props = {
    trip: Trip;
    onBook?: (t: Trip) => void;
};

function MetaRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div
            className="flex items-start gap-2"
            style={{ fontFamily: "Century Gothic, sans-serif" }}
        >
            <div className="mt-[2px]">{icon}</div>
            <div className="leading-tight">
                <div className="text-[10px] text-[#A0A0A0]">{label}</div>
                <div className="text-[12px] text-[#2B2B2B]">{value}</div>
            </div>
        </div>
    );
}

export default function TripCard({ trip, onBook }: Props) {
    return (
        <div
            className="
      w-full overflow-hidden
      max-[380px]:[--s:.92] max-[340px]:[--s:.88]
    "
        >
            <div
                className="
        origin-top-left
        max-[380px]:w-[calc(100%/var(--s))] max-[380px]:scale-[var(--s)]
      "
            >
                <article
                    className="bg-white border-[3px] border-[#ECECEC] rounded-4xl shadow-[0_2px_10px_rgba(0,0,0,0.08)] px-3 py-4"
                    style={{ fontFamily: "Century Gothic, sans-serif" }}
                >
                    <div className="flex gap-4 items-start">
                        <div className="relative w-[160px] h-[200px] rounded-3xl overflow-hidden shrink-0 bg-gray-100">
                            <Image
                                src={trip.imageUrl}
                                alt={trip.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 160px"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-[18px] mt-3 ml-2 font-bold text-[#111] mb-3">
                                {trip.title}
                            </h3>

                            <div className="ml-2 space-y-2">
                                <MetaRow
                                    icon={
                                        <MapPin className="w-[18px] h-[18px] text-[#28B872]" />
                                    }
                                    label="Location"
                                    value={trip.location}
                                />
                                <MetaRow
                                    icon={
                                        <Tag className="w-[18px] h-[18px] text-[#28B872]" />
                                    }
                                    label="Price"
                                    value={`${trip.priceBr.toLocaleString()} Br`}
                                />
                                <MetaRow
                                    icon={
                                        <Calendar className="w-[18px] h-[18px] text-[#28B872]" />
                                    }
                                    label="Days"
                                    value={`${trip.durationDays} day${
                                        trip.durationDays > 1 ? "’s" : ""
                                    } trip`}
                                />
                            </div>

                            <div className="mt-4 w-full flex justify-end">
                                <button
                                    onClick={() => onBook?.(trip)}
                                    className="rounded-full bg-[#28B872] text-white text-[14px] font-thin px-5 py-[7px] shadow-[0_3px_6px_rgba(40,184,114,0.3)] border border-[#28B872] active:scale-95 transition"
                                    style={{ fontFamily: "Century Gothic" }}
                                >
                                    Book Trip
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
