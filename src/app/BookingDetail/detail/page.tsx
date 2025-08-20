"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Detailfilter from "@/app/components/ui/Detailfilter";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";

import PassengerCard from "@/app/components/ui/PassengerCard";
import type { Passenger } from "@/app/types/type";

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
            {passengers.length} total
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-4 pb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {passengers.map((p, i) => (
            <PassengerCard key={i} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Page -------------------------------- */
type Trip = TripCardProps & { slug: string };

export default function TourPage() {
  const router = useRouter();

  // 1) Your trips (added slug to identify active trip)
  const trips: Trip[] = [
    {
      slug: "wenchi",
      date: "01/10/2025",
      duration: "2 days",
      title: "Wenchi",
      pricePerPerson: "2,700",
      capacity: 26,
      seatLeft: 16,
      seatsBooked: 20,
      seatsPending: 3,
      totalPrice: "27,000Br",
    },
  ];

  // 2) Passengers per trip (replace with real data fetch)
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
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

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
              <h1 className="text-lg font-bold">Wenchi Trip</h1>
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
                setView("passengers"); // 👉 swap to PassengerList in the SAME page
              }}
            />
          ))}

          {/* Main Content */}
          <div className="flex-1">
            <Detailfilter />
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
          passengers={passengersByTrip[activeTrip?.slug ?? "wenchi"] ?? []}
          onBack={() => setView("details")}
        />
      )}

      <Navbar active="explore" />
    </div>
  );
}
