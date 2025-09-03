"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Detailfilter from "@/app/components/ui/Detailfilter";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";
import PassengerCard from "@/app/components/ui/PassengerCard";
import type { Passenger } from "@/app/types/type";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="mx-4 my-2 p-6 border border-green-400 rounded-3xl bg-green-50">
      <div className="flex justify-between font-semibold text-sm text-gray-600 mb-2">
        <span>{date}</span>
        <span>Duration: {duration}</span>
      </div>

      <div>
        <div className="flex justify-between items-start">
          <div className="font-semibold">
            <h2 className="text-4xl">{title}</h2>
            <div className="text-[#B0C8C8] text-sm ml-1">
              <p>{pricePerPerson} per person</p>
              <p>Capacity: {capacity}</p>
              <p>Seat Left: {seatLeft}</p>
            </div>
          </div>

          <div className="text-right mt-5">
            <p className="text-2xl mr-16">
              <span className="text-[#28B872] font-semibold">
                {seatsBooked}
              </span>
              <span className="text-red-500 font-semibold">
                /{seatsPending}
              </span>
              <span className="text-xs text-[#28B872] ml-1">Seats</span>
            </p>
            <p className="text-4xl font-bold">{totalPrice}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPassengerListClick}
          className="mt-4 px-4 py-2 rounded-full bg-[#28B872] text-white text-sm font-semibold"
        >
          Passenger List
        </button>
        <button
          onClick={() => router.push("/ticket")}
          className="mt-4 px-4 py-2 rounded-full border border-[#28B872] text-[#28B872] text-sm font-semibold"
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
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Pending">(
    "All"
  );

  // Filtered passengers
  const filteredPassengers = passengers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesStatus =
      statusFilter === "All" ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-[60vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200"
        >
          <ArrowLeft className="text-green-600" size={26} />
        </button>
        <div>
          <h1 className="text-lg font-bold">{title} – Passengers</h1>
          <p className="text-sm font-bold text-gray-500">
            {filteredPassengers.length} shown / {passengers.length} total
          </p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 mb-4 gap-3">
        {/* Search box */}
        <Input
          type="text"
          placeholder="Search by name, email, phone, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
        />

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "All" | "Paid" | "Pending")
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* List */}
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

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) Your trips (added slug to identify active trip)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);

  // 2) Passengers per trip (using mock data as requested)
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

  // 3) Simple view toggle state
  const [view, setView] = useState<"details" | "passengers">("details");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeTrip, setActiveTrip] = useState<any | null>(null);

  // Fetch tour data from Supabase
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

          // Convert the tour data to the trips format
          const duration = getDaysBetweenDates(data.start_date, data.end_date);
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
            seatLeft: calculateSeatLeft(data.group_number || 0, 10), // Mock booked seats
            seatsBooked: 10, // Mock data
            seatsPending: 3, // Mock data
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

  // Helper function to calculate days between dates
  const getDaysBetweenDates = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Helper function to calculate seats left
  const calculateSeatLeft = (capacity: number, booked: number): number => {
    return Math.max(0, capacity - booked);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white justify-center items-center">
        <p>Loading tour data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white justify-center items-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 rounded-full bg-[#28B872] text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex flex-col min-h-screen bg-white justify-center items-center">
        <p>Tour not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 rounded-full bg-[#28B872] text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {view === "details" ? (
        <>
          {/* Header */}
          <div className="flex items-center space-x-3 p-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200"
            >
              <ArrowLeft className="text-green-600" size={30} />
            </button>
            <div>
              <h1 className="text-lg font-bold">
                {tour.tourName || "Tour Details"}
              </h1>
              <p className="text-sm font-bold text-gray-500">Details</p>
            </div>
          </div>

          {/* Trip cards */}
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

          {/* Main Content */}
          <div className="flex-1">
            <Detailfilter tourData={tour} />
          </div>

          {/* Edit Button */}
          <div className="px-4 mt-3 mb-10 flex items-center justify-center">
            <button
              onClick={() => alert("Edit clicked")}
              className="w-20 gap-2 px-4 py-2 rounded-full bg-[#28B872] hover:bg-green-600 text-white font-semibold transition-colors"
            >
              Edit
            </button>
          </div>
        </>
      ) : (
        // Passenger list view (same page)
        <PassengerListView
          title={activeTrip?.title ?? "Trip"}
          passengers={passengersByTrip["wenchi"]}
          onBack={() => setView("details")}
        />
      )}

      <Navbar active="explore" />
    </div>
  );
}
