import { BookingItem } from "@/types/type";
import { useRouter } from "next/navigation";
import Logo from "../../../public/logo_white.svg";
import Image from "next/image";
import { useState } from "react";

function BookingsTab({
    bookings,
    profile,
}: {
    bookings: BookingItem[];
    profile: any;
}) {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const filteredBookings = bookings.filter((booking) =>
        booking.title.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="lg:w-[500px]">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search bookings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full py-2 pl-5 pr-4 text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#28B872] transition shadow-sm"
                    style={{ fontFamily: "'Red Hat', sans-serif" }}
                />
            </div>

            {search.trim().length === 0 && (
                <div className="bg-gradient-to-l from-[#28B872] to-[#145c38] p-6 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#A7F3D0] rounded-full opacity-30"></div>
                    <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#A7F3D0] rounded-full opacity-30"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#A7F3D0] rounded-full opacity-10"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-white text-xl">
                                <Image
                                    src={Logo}
                                    alt="wedet-logo"
                                    className="h-7 w-28 text-white fill-[#FFFF]"
                                />
                            </span>
                            <div className="w-16 h-8 bg-white rounded-full opacity-30"></div>{" "}
                        </div>

                        <div className="flex flex-col justify-center items-center">
                            <div className="text-white text-2xl font-mono tracking-wider mb-2">
                                <span className="text-3xl mr-2">
                                    **** **** **** 1234
                                </span>
                            </div>

                            <div className="text-white text-sm opacity-80 mb-6">
                                Member since 2025
                            </div>
                        </div>

                        <div className="flex justify-between items-end text-white">
                            <div>
                                <div className="text-lg font-bold">
                                    {profile.firstName + " " + profile.lastName}
                                </div>
                                <div className="text-xs opacity-70 mt-1">
                                    Powered by WEDET
                                </div>
                            </div>
                            <div className="text-sm font-light flex flex-col text-right">
                                EXP{" "}
                                <span className="font-bold text-lg ml-1">
                                    12/30
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6 ">
                {filteredBookings.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        No bookings found.
                    </div>
                )}
                {filteredBookings.map((booking) => (
                    <div
                        onClick={() => {
                            router.push(
                                `/book/${booking.tour_id}/step5?id=${booking.id}`
                            );
                        }}
                        key={booking.id}
                        className="flex justify-between items-center pb-2 border-1 border-[#28B872]  shadow-sm cursor-pointer p-4 h-20 rounded-3xl"
                    >
                        <div className="-mt-1">
                            <Image
                                src={"/logo.svg"}
                                width={70}
                                height={70}
                                alt="logo"
                            />
                            <div className="font-bold text-lg text-[#28B872] ml-2">
                                {booking.title}
                            </div>
                        </div>
                        <div className="text-left">
                            <div
                                className={`font-extrabold text-xl ${"text-[#28B872]"}`}
                            >
                                {booking.total_price.toLocaleString()}Br
                            </div>
                            <div className="text-xs text-gray-400">
                                {new Date(booking.created_at).toLocaleString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookingsTab;
