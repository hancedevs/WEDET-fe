"use client";
// This is a client component
import { useMemo, useState } from "react";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import TripCard from "@/components/ui/TripCard";
import { Trip, TripStatus } from "@/types/type";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/ui/navBar";

//mock data
const ALL_TRIPS: Trip[] = [
    {
        id: "1",
        title: "Wenchi",
        location: "Wenchi, Oromia",
        priceBr: 4555,
        durationDays: 2,
        imageUrl: "/tipsimage.png",
        status: "wishlist",
        tripStatus: "pending",
    },
    {
        id: "2",
        title: "Wenchi",
        location: "Wenchi, Oromia",
        priceBr: 2000,
        durationDays: 2,
        imageUrl: "/tipsimage.png",
        status: "wishlist",
        tripStatus: "accepted",
    },
    {
        id: "3",
        title: "Wenchi",
        location: "Wenchi, Oromia",
        priceBr: 2000,
        durationDays: 2,
        imageUrl: "/tipsimage.png",
        status: "confirming",
        tripStatus: "pending",
    },
    {
        id: "4",
        title: "Wenchi",
        location: "Wenchi, Oromia",
        priceBr: 2000,
        durationDays: 2,
        imageUrl: "/tipsimage.png",
        status: "confirming",
        tripStatus: "accepted",
    },
    {
        id: "5",
        title: "Wenchi",
        location: "Wenchi, Oromia",
        priceBr: 2000,
        durationDays: 2,
        imageUrl: "/tipsimage.png",
        status: "wishlist",
        tripStatus: "pending",
    },
    {
        id: "6",
        title: "Wenchi",
        location: "Wenchi, Oromia",
        priceBr: 2000,
        durationDays: 2,
        imageUrl: "/tipsimage.png",
        status: "wishlist",
        tripStatus: "accepted",
    },
    {
        id: "7",
        title: "Wenchi",
        location: "Wenchi, Oromia",
        priceBr: 2000,
        durationDays: 2,
        imageUrl: "/tipsimage.png",
        status: "wishlist",
        tripStatus: "pending",
    },
];

export default function TripsPage() {
    const [tab, setTab] = useState<TripStatus>("wishlist");
    const trips = useMemo(
        () => ALL_TRIPS.filter((t) => t.status === tab),
        [tab]
    );
    const router = useRouter();

    return (
        <div className="min-h-dvh flex flex-col  bg-white lg:w-[500px]">
            <div className="flex w-full  ">
                <header className="sticky top-0 z-40 bg-white/90 backdrop-blur px-3 py-2 border-b border-[#F0F0F0]">
                    <div className="mx-auto mb-4 w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
                        <button
                            onClick={() => router.push("/home")}
                            aria-label="Back"
                            className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#ECECEC] shadow-[0_2px_6px_rgba(0,0,0,0.05)] active:scale-95 transition"
                        >
                            <ArrowLeft size={20} className="text-[#28B872]" />
                        </button>
                    </div>
                </header>

                {/* Tabs row (allow horizontal scroll on tiny screens) */}
                {/* Tabs row - sticky */}
                <div className="sticky top-[60px] z-30 bg-white px-3 py-2 border-b border-[#F0F0F0]">
                    <div className="mx-auto w-[80vw] lg:w-[50vw] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg overflow-hidden">
                        <div className="overflow-x-auto no-scrollbar">
                            <div className="min-w-fit max-w-2xl">
                                <SegmentedTabs value={tab} onChange={setTab} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable content area */}
            <main className="flex-1 overflow-y-auto px-3">
                <div className="mx-auto w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
                    <div className="space-y-4 pb-24 pt-3">
                        {trips.map((t) => (
                            <TripCard
                                key={t.id}
                                trip={t}
                                onBook={(x) => console.log("book", x.id)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
