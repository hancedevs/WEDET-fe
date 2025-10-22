"use client";

import React from "react";
import { Search, Calendar, Filter, SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Tourguidecomponents/TourGuideNavbar";

// Trip Card Props
interface TripCardProps {
    title: string;
    duration: string;
    price: string;
    capacity: number;
    date: string;
    day: number;
    total: string;
    borderColor: string;
    badgeColor: string;
}

const TripCard: React.FC<TripCardProps> = ({
    title,
    duration,
    price,
    capacity,
    date,
    day,
    total,
    borderColor,
    badgeColor,
}) => {
    const router = useRouter();

    return (
        <div
            className="relative rounded-4xl border-2 p-4 flex justify-between items-center w-full mb-8 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg"
            style={{
                borderColor,
                boxShadow: `0 4px 12px ${borderColor}55`, // shadow based on border color
            }}
            onClick={() => router.push("../BookingDetail/detail")}
        >
            {/* Left Section */}
            <div className="flex-1">
                <span
                    className="absolute -top-3 right-4 text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                        backgroundColor: badgeColor,
                        color:
                            badgeColor === "#28B872" || badgeColor === "#FF2D2D"
                                ? "white"
                                : "black",
                    }}
                >
                    {date}
                </span>
                <p className="text-xs text-[#B0C8C8]">Duration: {duration}</p>
                <h2 className="text-4xl font-bold">{title}</h2>
                <p className="text-xs text-[#B0C8C8]">{price} per person</p>
                <p className="text-xs text-[#B0C8C8]">Capacity: {capacity}</p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{day}</span>
                <span className="text-sm font-semibold text-black">
                    {total}
                </span>
                <button
                    className="mt-2 px-8 py-1 rounded-full bg-[#28B872] text-white text-sm font-medium hover:bg-green-600 transition"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent card click
                        alert("Edit button clicked!");
                    }}
                >
                    Edit
                </button>
            </div>
        </div>
    );
};

export default function TripsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white p-4 pb-20 relative">
            {/* Search Row */}
            <div className="flex items-center mb-6 gap-3">
                {/* Search Input */}
                <div className="flex items-center flex-1 rounded-full px-4 py-2 mx-3 mt-3 shadow-sm">
                    <Search className="w-5 h-5 text-[#28B872] mr-2" />
                    <input
                        type="text"
                        placeholder="Search Destination"
                        className="flex-1 bg-transparent focus:outline-none text-sm"
                    />
                </div>

                {/* Calendar Button */}
                <button className="mt-3 rounded-full hover:bg-gray-200 transition">
                    <Calendar className="w-5 h-5 text-green-600" />
                </button>

                {/* Filter Button */}
                <button className="mt-3 rounded-full hover:bg-gray-200 transition">
                    <Filter className="w-5 h-5 text-green-600" />
                </button>
            </div>

            {/* Trip List */}
            <TripCard
                title="Wenchi"
                duration="2 days"
                price="2,700 Br"
                capacity={26}
                date="01/10/2025"
                day={26}
                total="22,000 Br"
                borderColor="#FF2D2D"
                badgeColor="#FF2D2D"
            />
            <TripCard
                title="Suba"
                duration="2 days"
                price="2,700 Br"
                capacity={26}
                date="01/10/2025"
                day={24}
                total="19,000 Br"
                borderColor="#FFEA00"
                badgeColor="#FFEA00"
            />
            <TripCard
                title="Wenchi"
                duration="2 days"
                price="2,700 Br"
                capacity={26}
                date="01/10/2025"
                day={24}
                total="19,000 Br"
                borderColor="#28B872"
                badgeColor="#28B872"
            />
            <TripCard
                title="Wenchi"
                duration="2 days"
                price="2,700 Br"
                capacity={26}
                date="01/10/2025"
                day={24}
                total="19,000 Br"
                borderColor="#28B872"
                badgeColor="#28B872"
            />

            {/* Add Button inside container with margin */}
            <div className="flex justify-end mr-3 my-5">
                <button
                    className="w-14 h-14 rounded-full bg-[#28B872] text-white flex items-center justify-center shadow-lg hover:bg-green-600 transition"
                    onClick={() => alert("Add Trip button clicked!")}
                >
                    <SquarePlus className="w-7 h-7" />
                </button>
            </div>

            <Navbar />
        </div>
    );
}
