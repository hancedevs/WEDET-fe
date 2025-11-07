"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Pencil, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Detailfilter from "@/components/ui/Detailfilter";
import Navbar from "@/components/Tourguidecomponents/TourGuideNavbar";
import PassengerCard from "@/components/ui/PassengerCard";
import type { Passenger } from "@/types/type";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { initialTourData } from "@/mock/data";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/* ----------------------------- TripCard ----------------------------- */
interface TripCardProps {
    date: string;
    duration: string;
    title: string;
    pricePerPerson: string;
    capacity: number;
    seatLeft: number;
    seatsBooked: number;
    seatsPending: number;
    totalPrice: string;
    onPassengerListClick?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({
    date,
    duration,
    title,
    pricePerPerson,
    capacity,
    seatLeft,
    seatsBooked,
    seatsPending,
    totalPrice,
    onPassengerListClick,
}) => {
    const router = useRouter();

    let bgcolor = "#28B872";
    if (seatsBooked === 0) {
        bgcolor = "#FF2D2D";
    } else if (seatsPending > 0) {
        bgcolor = "#F59E0B";
    }

    const badgeColor = ["#28B872", "#FF2D2D", "#1D4ED8"].includes(bgcolor)
        ? "white"
        : "black";

    return (
        <div
            className={`relative bg-white rounded-4xl p-4 flex flex-col justify-between items-stretch w-full mb-8 cursor-pointer transition hover:scale-[1.02] hover:shadow-xl `}
            style={{
                border: `1px solid ${bgcolor}`,
                boxShadow: `0 4px 8px ${bgcolor}30`,
            }}
        >
            <div className="flex-1 mr-4 min-w-0 pt-3">
                <span
                    className="absolute top-[-12px] right-4 text-xs px-3 py-1 rounded-full font-medium shadow-md"
                    style={{
                        backgroundColor: bgcolor,
                        color: badgeColor,
                    }}
                >
                    {date}
                </span>
            </div>

            <div className="flex justify-between items-start w-full">
                {/* Left Column */}
                <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-500 font-medium">
                        Duration: {duration}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800 line-clamp-1">
                        {title}
                    </h2>
                    <div className="text-xs text-[#B0C8C8] space-y-0.5 mt-1">
                        <p>{pricePerPerson} per person</p>
                        <p>Capacity: {capacity}</p>
                        <p>Seat Left: {seatLeft}</p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col items-end justify-between ml-4">
                    <p className="text-xl font-semibold text-start  w-full">
                        <span className="text-green-600">{seatsBooked}</span>
                        <span className="text-red-500">/{seatsPending}</span>
                        <span className="text-xs text-gray-500 ml-1">
                            Seats
                        </span>
                    </p>
                    <span className="text-3xl font-bold text-gray-900 mt-2">
                        {totalPrice}
                    </span>
                </div>
            </div>

            <div className="flex justify-between  mt-4  items-center">
                <button
                    onClick={onPassengerListClick}
                    className="px-4 py-2 rounded-full  bg-[#28B872] text-white text-sm font-semibold hover:bg-green-50 transition"
                >
                    Passenger List
                </button>
                <button
                    onClick={() => {}}
                    className="px-4 py-2 rounded-full border border-[#28B872] text-[#28B872] text-sm font-semibold hover:bg-green-50 transition"
                >
                    Generate Ticket
                </button>
            </div>
        </div>
    );
};

/* ----------------------- Same-page Passenger View ----------------------- */
function PassengerListView({
    title,
    passengers,
    onBack,
}: {
    title: string;
    passengers: Passenger[];
    onBack: () => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "All" | "Paid" | "Pending"
    >("All");

    const filteredPassengers = passengers.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ??
                false);

        const matchesStatus =
            statusFilter === "All" ? true : p.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-[60vh] flex flex-col">
            <div className="flex items-center space-x-3 p-4 border-b border-gray-100">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                    <ArrowLeft className="text-green-600" size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        {title} – Passengers
                    </h1>
                    <p className="text-sm text-gray-500">
                        {filteredPassengers.length} shown / {passengers.length}{" "}
                        total
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 my-4 gap-3">
                <Input
                    type="text"
                    placeholder="Search by name, email, phone, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-2xl p-4 border-none shadow-sm w-full md:w-1/2 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 transition"
                />

                <div className="w-1/3">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                            setStatusFilter(value as "All" | "Paid" | "Pending")
                        }
                    >
                        <SelectTrigger className="w-full md:w-[200px] rounded-xl shadow-sm focus:ring-green-500">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="border-0 ">
                            <SelectItem value="All">All Status</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex-1 px-4 mb-20 pb-6">
                {filteredPassengers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredPassengers.map((p, i) => (
                            <PassengerCard key={i} p={p} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">
                        No passengers found matching your search or filters.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ----------------------------- Loading Skeleton ----------------------------- */
const LoadingSkeleton = () => (
    <div className="p-4 animate-pulse">
        <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="space-y-1">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>

        <div className="relative bg-white rounded-2xl p-4 flex justify-between items-stretch w-full mb-8 border border-gray-100 shadow-lg">
            <div className="flex-1 mr-4 min-w-0 pt-3">
                <div className="absolute top-[-12px] right-4 h-5 w-20 bg-green-200 rounded-full"></div>
                <div className="mt-3 space-y-2">
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                    <div className="h-3 w-28 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between py-2">
                <div className="space-y-2 mt-4 flex flex-col items-center">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-300 rounded"></div>
                </div>
                <div className="space-y-2 mt-4">
                    <div className="h-7 w-28 bg-green-300 rounded-full"></div>
                    <div className="h-7 w-28 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>

        <div className="space-y-6 px-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
                <div className="h-4 w-full bg-gray-100 rounded"></div>
                <div className="h-4 w-11/12 bg-gray-100 rounded"></div>
                <div className="h-4 w-10/12 bg-gray-100 rounded"></div>
            </div>
            <div className="h-8 w-1/4 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-full bg-gray-100 rounded"></div>
            <div className="h-4 w-11/12 bg-gray-100 rounded"></div>
        </div>
    </div>
);

/* -------------------------------- Page -------------------------------- */
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
    destination: string;
    overview: string;
    highlights: string;
    activities: string;
}

export default function TourPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tourId = searchParams.get("id");

    const [tour, setTour] = useState<Tour | null>(initialTourData);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [trips, setTrips] = useState<any[]>([]);

    const passengersByTrip: Record<string, Passenger[]> = {
        wenchi: [
            {
                name: "Abel Tadesse",
                email: "abel@example.com",
                phone: "+251912345678",
                status: "Paid",
                amountBr: 5400,
                people: 2,
                location: "Addis Ababa, Mexico",
                dateISO: "2025-10-01",
                time: "08:30 AM",
                note: "Vegetarian meal.",
            },
            {
                name: "Sara M.",
                email: "sara@example.com",
                phone: "+251911112222",
                status: "Pending",
                amountBr: 2700,
                people: 1,
                location: "Bole",
                dateISO: "2025-10-01",
                time: "08:30 AM",
            },
            {
                name: "Yonatan K.",
                email: "yonatan@example.com",
                phone: "+251900001234",
                status: "Paid",
                amountBr: 2700,
                people: 1,
                location: "Gerji",
                dateISO: "2025-10-01",
                time: "08:30 AM",
                note: "Allergic to peanuts.",
            },
        ],
    };

    const [view, setView] = useState<"details" | "passengers">("details");
    const [activeTrip, setActiveTrip] = useState<any | null>(null);

    const handleTourDataUpdate = useCallback((field: keyof any, value: any) => {
        setTour((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const handleEditSave = () => {
        if (isEditing) {
            // In a real application, you would call an API here to persist `tour`
            console.log("Saving tour data:", tour);
        }
        setIsEditing((prev) => !prev);
    };
    useEffect(() => {
        const fetchTour = async () => {
            if (!tourId) return;

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("tours")
                    .select("*")
                    .eq("id", tourId)
                    .single();

                if (error) {
                    throw error;
                }

                if (data) {
                    setTour(data);

                    const duration = getDaysBetweenDates(
                        data.start_date,
                        data.end_date
                    );
                    const formattedDate = data.selectedDay
                        ? formatDate(data.selectedDay)
                        : formatDate(data.start_date);

                    const tripData = {
                        slug: data.id.toString(),
                        date: formattedDate,
                        duration: `${duration} days`,
                        title: data.tourName || "Unnamed Tour",
                        pricePerPerson: `$${data.price || 0}`,
                        capacity: data.group_number || 0,
                        seatLeft: calculateSeatLeft(data.group_number || 0, 10),
                        seatsBooked: 10,
                        seatsPending: 3,
                        totalPrice: `${data.total || 0} Br`,
                    };

                    setTrips([tripData]);
                    setActiveTrip(tripData);
                }
            } catch (error) {
                console.error("Error fetching tour:", error);
                setError("Failed to load tour data");
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [tourId]);

    const getDaysBetweenDates = (
        startDate: string,
        endDate: string
    ): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const calculateSeatLeft = (capacity: number, booked: number): number => {
        return Math.max(0, capacity - booked);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <LoadingSkeleton />
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="flex flex-col min-h-screen bg-white justify-center items-center p-8">
                <p className="text-red-500 text-lg mb-4">
                    {error || "Tour not found"}
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-6 py-3 rounded-full bg-[#28B872] hover:bg-green-600 text-white font-semibold transition shadow-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white relative">
            <div className="max-w-4xl mx-auto w-full relative">
                {view === "details" ? (
                    <>
                        <div className="flex items-center space-x-3 p-4 border-b border-gray-100">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                            >
                                <ArrowLeft
                                    className="text-green-600"
                                    size={20}
                                />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">
                                    {tour.tourName || "Tour Details"}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Details Overview
                                </p>
                            </div>
                        </div>

                        <div className="px-4">
                            {trips.map((trip) => (
                                <TripCard
                                    key={trip.slug}
                                    {...trip}
                                    onPassengerListClick={() => {
                                        setActiveTrip(trip);
                                        setView("passengers");
                                    }}
                                />
                            ))}
                        </div>

                        <div className="flex-1 px-4 pb-28">
                            <Detailfilter
                                tourData={tour}
                                isEditing={isEditing}
                                onUpdate={handleTourDataUpdate}
                            />
                        </div>

                        <div className="fixed bottom-0 inset-x-0 flex justify-center px-4 pb-4 z-50 bg-white">
                            <button
                                onClick={handleEditSave}
                                className={`w-2/3 mt-2 max-w-4xl gap-2 px-6 py-3 rounded-full text-white font-bold transition-all shadow-lg flex items-center justify-center
            ${
                isEditing
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#28B872] hover:bg-green-600"
            }`}
                            >
                                {isEditing ? <>Save Changes</> : <>Edit</>}
                            </button>
                        </div>
                    </>
                ) : (
                    <PassengerListView
                        title={activeTrip?.title ?? "Trip"}
                        passengers={passengersByTrip["wenchi"]}
                        onBack={() => setView("details")}
                    />
                )}
            </div>
        </div>
    );
}
