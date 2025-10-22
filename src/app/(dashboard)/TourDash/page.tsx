/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Navbar from "@/components/Tourguidecomponents/TourGuideNavbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Tour {
    id: number;
    price: number;
    discount: number;
    total: number;
    tourName: string;
    start_date: string;
    end_date: string;
    group_number: number;
    selectedDay: string;
}

interface TripCardProps {
    title: string;
    duration: string;
    price: string;
    capacity: number;
    date: string;
    day: number;
    total: string;
    bgcolor?: string;
    path: string;
}

const TripCard: React.FC<TripCardProps> = ({
    title,
    duration,
    price,
    capacity,
    date,
    day,
    total,
    bgcolor = "#28B872",
    path,
}) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(path)}
            className="relative bg-white rounded-4xl p-4 flex justify-between items-center w-full mb-8 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg"
            style={{
                boxShadow: `0 4px 12px ${bgcolor}80`,
            }}
        >
            <div className="flex-1 mr-4">
                <div>
                    <p className="text-xs text-[#B0C8C8]">
                        Duration: {duration}
                    </p>
                    <h2 className="text-4xl font-semibold">{title}</h2>
                    <p className="text-xs text-[#B0C8C8]">{price} per person</p>
                    <p className="text-xs text-[#B0C8C8]">
                        Capacity: {capacity}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between h-full">
                <span
                    className="absolute top-[-14px] not-[]:text-xs px-3 py-1 rounded-full font-medium mb-2"
                    style={{
                        backgroundColor: bgcolor,
                        color:
                            bgcolor === "#28B872" || bgcolor === "#FF2D2D"
                                ? "white"
                                : "black",
                    }}
                >
                    {date}
                </span>

                <div className="flex flex-col items-center">
                    <span className="text-5xl font-bold">{day}</span>
                    <span className="text-sm font-semibold text-black-500">
                        {total}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            alert("Edit button clicked");
                        }}
                        className="mt-2 px-8 py-1 rounded-full bg-[#28B872] text-white text-sm font-medium hover:bg-green-600 transition"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper function to calculate days between dates
const getDaysBetweenDates = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
};

// Helper function to format date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

// Helper function to get random color for cards
const getRandomColor = (): string => {
    const colors = ["#28B872", "#FF2D2D", "#FFEA00"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center items-center space-x-2 my-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                    currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-600 hover:bg-green-100"
                }`}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={`px-3 py-1 rounded-full ${
                            1 === currentPage
                                ? "bg-green-600 text-white"
                                : "text-green-600 hover:bg-green-100"
                        }`}
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="px-1">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-full ${
                        page === currentPage
                            ? "bg-green-600 text-white"
                            : "text-green-600 hover:bg-green-100"
                    }`}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="px-1">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`px-3 py-1 rounded-full ${
                            totalPages === currentPage
                                ? "bg-green-600 text-white"
                                : "text-green-600 hover:bg-green-100"
                        }`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                    currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-600 hover:bg-green-100"
                }`}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default function Dashboard() {
    const router = useRouter();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [businessProfile, setBusinessProfile] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tripsPerPage = 5;

    useEffect(() => {
        fetchTours();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Fetch business profile after getting user
                fetchBusinessProfile(user.id);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    // Add function to fetch business profile
    const fetchBusinessProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("business_profiles")
                .select("business_name")
                .eq("user_id", userId)
                .single();

            if (error) {
                console.error("Error fetching business profile:", error);
                return;
            }

            setBusinessProfile(data);
        } catch (error) {
            console.error("Error fetching business profile:", error);
        }
    };

    const fetchTours = async () => {
        try {
            const { data, error } = await supabase
                .from("tours")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            setTours(data || []);
        } catch (error) {
            console.error("Error fetching tours:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrip = () => {
        router.push("/Tourguide/Tourtrip1");
    };

    // Calculate pagination values
    const indexOfLastTrip = currentPage * tripsPerPage;
    const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
    const currentTrips = tours.slice(indexOfFirstTrip, indexOfLastTrip);
    const totalPages = Math.ceil(tours.length / tripsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of trips section when page changes
        const tripsSection = document.getElementById("trips-section");
        if (tripsSection) {
            tripsSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center">
                <p>Loading tours...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full">
            <div className="w-full px-4 py pb-20">
                <div className="flex items-center mb-6 mt-4 pr-2">
                    <div className="relative w-12 h-12">
                        <Image
                            src="/man image.jpg"
                            alt="User"
                            fill
                            className="rounded-full object-cover border-2 border-green-500"
                        />
                    </div>
                    <div className="ml-2">
                        {/* Updated to show business name from business_profiles table */}
                        <p className="text-xs">
                            Good morning,{" "}
                            {businessProfile?.business_name ||
                                user?.user_metadata?.business_name ||
                                "user"}
                        </p>
                        <h1 className="text-lg font-semibold">
                            Discover and go
                        </h1>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 w-full">
                    <div className="bg-white rounded-4xl shadow-[0_4px_6px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
                        <Image
                            src="/Tickets.png"
                            alt="Ticket"
                            width={40}
                            height={40}
                            className="w-10 h-10 mr-3"
                        />
                        <div>
                            <p className="text-xs text-[#96A9AA]">
                                Total Tickets
                            </p>
                            <h2 className="text-2xl font-bold">280</h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-4xl shadow-[0_4px_6px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
                        <div className="flex-shrink-0 mr-3">
                            <Image
                                src="/refund.png"
                                alt="Refund"
                                width={48}
                                height={48}
                                className="object-contain w-10 h-10"
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-[#96A9AA] whitespace-nowrap truncate">
                                Refund Request
                            </p>
                            <h2 className="text-2xl font-bold">31</h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-4xl shadow-[0_4px_6px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
                        <Image
                            src="/Next (1).png"
                            alt="Ticket"
                            width={40}
                            height={40}
                            className="w-10 h-10 mr-3"
                        />
                        <div>
                            <p className="text-xs text-[#96A9AA]">
                                Upcoming Trip
                            </p>
                            <h2 className="text-2xl font-semibold">
                                {tours.length > 0
                                    ? tours[0].tourName
                                    : "No trips"}
                            </h2>
                            <span className="text-xs block -mt-1">
                                {tours.length > 0 && (
                                    <>
                                        <span className="text-red-500">
                                            {
                                                formatDate(
                                                    tours[0].start_date
                                                ).split("/")[1]
                                            }
                                        </span>
                                        <span className="text-green-500">
                                            /
                                            {
                                                formatDate(
                                                    tours[0].start_date
                                                ).split("/")[0]
                                            }
                                            /
                                            {
                                                formatDate(
                                                    tours[0].start_date
                                                ).split("/")[2]
                                            }
                                        </span>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="bg-[#F3FCFB] rounded-4xl shadow-[0_4px_6px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
                        <Image
                            src="/trip origin.png"
                            alt="Ticket"
                            width={40}
                            height={40}
                            className="w-10 h-10 mr-3"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#96A9AA]">
                                Total Trips
                            </p>
                            <div className="flex items-baseline space-x-2">
                                <h2 className="text-2xl font-bold">
                                    {tours.length}
                                </h2>
                                <p className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                                    Last Month
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trips Section */}
                <div
                    id="trips-section"
                    className="flex justify-between items-center mb-6 w-full"
                >
                    <h2 className="text-lg font-bold">Trips</h2>
                    <button
                        className="flex items-center gap-1 text-green-600 font-medium hover:underline"
                        onClick={handleAddTrip}
                    >
                        <Plus className="w-4 h-4" /> Add Trip
                    </button>
                </div>

                {/* Trip List */}
                {tours.length === 0 ? (
                    <p className="text-center py-8">
                        No trips available. Add your first trip!
                    </p>
                ) : (
                    <>
                        {currentTrips.map((tour) => {
                            const duration = getDaysBetweenDates(
                                tour.start_date,
                                tour.end_date
                            );
                            const formattedDate = tour.selectedDay
                                ? formatDate(tour.selectedDay)
                                : formatDate(tour.start_date);

                            return (
                                <TripCard
                                    key={tour.id}
                                    title={tour.tourName || "Unnamed Tour"}
                                    duration={`${duration} days`}
                                    price={`$${tour.price || 0}`}
                                    capacity={tour.group_number || 0}
                                    date={formattedDate}
                                    day={duration}
                                    total={`${tour.total || 0} Br`}
                                    bgcolor={getRandomColor()}
                                    path={`../BookingDetail/detail?id=${tour.id}`}
                                />
                            );
                        })}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>

            <Navbar />
        </div>
    );
}
