"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import TripCard from "@/components/ui/TripCard";
import { TripStatus, Trip } from "@/types/type";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripsPage() {
    const [tab, setTab] = useState<TripStatus>("wishlist");
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("wishlist")
                    .select(`trip_id, user_id, status, favorite`)
                    .eq("status", tab);

                if (error) throw error;
                if (!data) {
                    setTrips([]);
                    setLoading(false);
                    return;
                }

                const formattedTrips: Trip[] = data.map((item: any) => ({
                    id: item.trip_id,
                    placeName: item.favorite.placeName,
                    location: item.favorite.location,
                    priceBr: item.favorite.price,
                    oldPrice: item.favorite.oldPrice,
                    imageUrl: item.favorite.imageUrl,
                    durationDays: item.favorite.tripDuration,
                    agencyName: item.favorite.agencyName,
                    priority: item.favorite.priority,
                    rating: item.favorite.rating,
                    reviews: item.favorite.reviews,
                    status: item.status,
                    tripStatus: item.status,
                }));

                setTrips(formattedTrips);
            } catch (err) {
                console.error("Error fetching wishlist trips:", err);
            } finally {
                setLoading(false);
            }
        };

        void fetchTrips();
    }, [tab]);

    return (
        <div className="min-h-dvh flex flex-col bg-white lg:w-[500px]">
            <div className="flex w-full">
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

                {/* Tabs row stays where it was originally */}
                <div className="w-full px-3 py-2 border-b border-[#F0F0F0]">
                    <div className="mx-auto w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg overflow-hidden">
                        <div className="overflow-x-auto no-scrollbar">
                            <div className="min-w-fit max-w-2xl">
                                <SegmentedTabs value={tab} onChange={setTab} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-3">
                <div className="mx-auto w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
                    <div className="space-y-4 pb-24 pt-3">
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                  <Skeleton
                                      key={i}
                                      className="h-[200px] w-full rounded-4xl"
                                  />
                              ))
                            : trips.map((t) => (
                                  <TripCard
                                      key={t.id}
                                      trip={t}
                                      onBook={(x) =>
                                          router.push(
                                              `/book/${x.id}/book-destination`
                                          )
                                      }
                                  />
                              ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
