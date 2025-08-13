"use client";
// This is a client component
import { useMemo, useState } from "react";
import SegmentedTabs from "@/app/components/ui/SegmentedTabs";
import TripCard from "@/app/components/ui/TripCard";
import { Trip, TripStatus } from "@/app/types/type";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/ui/navBar";

//mock data
const ALL_TRIPS: Trip[] = [
  {
    id: "1",
    title: "Wenchi",
    location: "Wenchi, Oromia",
    priceBr: 4555,
    durationDays: 2,
    imageUrl: "/tipsimage.png",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Wenchi",
    location: "Wenchi, Oromia",
    priceBr: 2000,
    durationDays: 2,
    imageUrl: "/tipsimage.png",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Wenchi",
    location: "Wenchi, Oromia",
    priceBr: 2000,
    durationDays: 2,
    imageUrl: "/tipsimage.png",
    status: "confirming",
  },
  {
    id: "4",
    title: "Wenchi",
    location: "Wenchi, Oromia",
    priceBr: 2000,
    durationDays: 2,
    imageUrl: "/tipsimage.png",
    status: "confirming",
  },
  {
    id: "5",
    title: "Wenchi",
    location: "Wenchi, Oromia",
    priceBr: 2000,
    durationDays: 2,
    imageUrl: "/tipsimage.png",
    status: "wishlist",
  },
  {
    id: "6",
    title: "Wenchi",
    location: "Wenchi, Oromia",
    priceBr: 2000,
    durationDays: 2,
    imageUrl: "/tipsimage.png",
    status: "wishlist",
  },
  {
    id: "7",
    title: "Wenchi",
    location: "Wenchi, Oromia",
    priceBr: 2000,
    durationDays: 2,
    imageUrl: "/tipsimage.png",
    status: "wishlist",
  },
];

export default function TripsPage() {
  const [tab, setTab] = useState<TripStatus>("upcoming");
  const trips = useMemo(() => ALL_TRIPS.filter((t) => t.status === tab), [tab]);
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col  bg-white">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur px-3 py-2 border-b border-[#F0F0F0]">
        <div className="mx-auto mb-4 w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
          <button
            onClick={() => router.push("/pages/home")}
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
        <div className="mx-auto w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-fit">
              <SegmentedTabs value={tab} onChange={setTab} />
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

      {/* Fixed bottom nav (assumed fixed inside component); keep padding above (pb-24) */}
      <NavBar />
    </div>
  );
}
