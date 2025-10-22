"use client";

import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Passenger } from "@/types/type"; // or use the interface shown above

const initials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]!.toUpperCase())
        .join("");

const Br = (v: number) => `${v.toLocaleString()}Br`;

export default function PassengerCard({ p }: { p: Passenger }) {
    return (
        <article className="rounded-[24px] border border-[#2AD180] bg-white px-3 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            {/* header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#28B872] text-white font-semibold">
                        {initials(p.name)}
                    </div>
                    <div>
                        <div className="font-semibold leading-tight text-[#111]">
                            {p.name}
                        </div>
                        <div className="text-xs text-gray-500">{p.email}</div>
                    </div>
                </div>

                {p.status && (
                    <span className="rounded-full bg-[#28B872] px-3 py-1 text-xs font-semibold text-white select-none">
                        {p.status}
                    </span>
                )}
            </div>

            {/* info pill */}
            <div className="relative mt-3 rounded-[18px] bg-[#F2F8F5] px-3 py-3">
                <div className="absolute right-3 top-3 text-right">
                    <div className="text-[10px] text-gray-500">
                        Total Amount
                    </div>
                    <div className="text-lg font-bold text-[#1F8F5D] leading-tight">
                        {Br(p.amountBr)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                        {p.people} person{p.people > 1 ? "s" : ""}
                    </div>
                </div>

                <div className="space-y-2 pr-28">
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-[#28B872] mt-[2px]" />
                        <span className="text-sm text-[#2B2B2B]">
                            {p.location}
                        </span>
                    </div>

                    <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-[#28B872] mt-[2px]" />
                        <span className="text-sm text-[#2B2B2B]">
                            {new Date(p.dateISO).toLocaleDateString(undefined, {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    <div className="flex items-start gap-2 opacity-60">
                        <Clock className="h-4 w-4 text-[#28B872] mt-[2px]" />
                        <span className="text-sm text-[#2B2B2B]">{p.time}</span>
                    </div>
                </div>
            </div>

            {/* note */}
            {p.note && (
                <>
                    <div className="mt-3 text-[12px] text-[#28B872] font-medium">
                        Note:
                    </div>
                    <div className="mt-1 rounded-[16px] bg-[#F5FAF8] px-3 py-3 text-sm text-[#2B2B2B]">
                        {p.note}
                    </div>
                </>
            )}

            {/* actions */}
            <div className="mt-3 flex items-center gap-3">
                <a
                    href={p.phone ? `tel:${p.phone}` : "#"}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#28B872] bg-white px-4 py-2 text-sm font-medium text-[#28B872] shadow-sm active:scale-95 transition"
                >
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#28B872]" />
                    Call
                </a>
                <a
                    href={p.phone ? `sms:${p.phone}` : "#"}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#28B872] bg-white px-4 py-2 text-sm font-medium text-[#2B2B2B] shadow-sm active:scale-95 transition"
                >
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#28B872]" />
                    Message
                </a>
            </div>
        </article>
    );
}
